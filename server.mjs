import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync, brotliCompressSync, constants as zc } from "node:zlib";
import { handleConsultation, PUBLIC_ROUTES, renderRequest } from "./lib/http.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicDir = resolve(root, "public");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const isProd = process.env.NODE_ENV === "production";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};
const compressible = /^(text\/|application\/(javascript|json|xml)|image\/svg)/;

/* ---------- security headers (applied to every response) ---------- */
// Optional third-party endpoints the consultation form may call from the browser (static-site email relay + owner notification)
const extraConnect = ["MIRAI_FORM_ENDPOINT", "MIRAI_NOTIFY_URL"].map((k) => { try { return new URL(process.env[k] || "").origin; } catch { return ""; } }).filter((o) => /^https:/.test(o));
const cfAnalytics = /^[0-9a-f]{32}$/i.test(process.env.MIRAI_CF_BEACON_TOKEN || "");
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${cfAnalytics ? " https://static.cloudflareinsights.com" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https:",
  ["connect-src 'self'", ...new Set(extraConnect), ...(cfAnalytics ? ["https://cloudflareinsights.com"] : [])].join(" "),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://wa.me"
].join("; ");

function baseHeaders(extra = {}) {
  const h = {
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-frame-options": "DENY",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "content-security-policy": csp,
    ...extra
  };
  if (isProd) h["strict-transport-security"] = "max-age=31536000; includeSubDomains";
  return h;
}

function send(req, res, status, body, headers) {
  const h = baseHeaders(headers);
  const type = h["content-type"] || "";
  let payload = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const accept = req.headers["accept-encoding"] || "";
  if (compressible.test(type) && payload.length > 1024) {
    if (/\bbr\b/.test(accept)) { payload = brotliCompressSync(payload, { params: { [zc.BROTLI_PARAM_QUALITY]: 5 } }); h["content-encoding"] = "br"; }
    else if (/\bgzip\b/.test(accept)) { payload = gzipSync(payload, { level: 6 }); h["content-encoding"] = "gzip"; }
    h.vary = "accept-encoding";
  }
  h["content-length"] = payload.length;
  res.writeHead(status, h);
  res.end(req.method === "HEAD" ? undefined : payload);
}

function json(req, res, status, body) {
  send(req, res, status, JSON.stringify(body), { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 1_000_000) throw new Error("Body too large");
  }
  return body ? JSON.parse(body) : {};
}

async function serveStatic(req, pathname, res) {
  const relative = pathname.replace(/^\/+/, "");
  const filePath = resolve(publicDir, relative);
  if (!(filePath === publicDir || filePath.startsWith(publicDir + sep))) return false;
  try {
    const info = await stat(filePath);
    if (!info.isFile()) return false;
    const data = await readFile(filePath);
    const versioned = /[?&]v=/.test(req.url || "");
    const cache = !isProd ? "no-cache"
      : pathname.startsWith("/brand/") || versioned ? "public, max-age=31536000, immutable"
      : "public, max-age=3600";
    send(req, res, 200, data, {
      "content-type": mime[extname(filePath).toLowerCase()] || "application/octet-stream",
      "cache-control": cache,
      "last-modified": info.mtime.toUTCString()
    });
    return true;
  } catch {
    return false;
  }
}

function sitemap(origin) {
  const pages = PUBLIC_ROUTES;
  const urls = [...pages, ...pages.map((p) => (p === "/" ? "/ar" : `/ar${p}`))];
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.map((p) => {
    const logical = p === "/ar" ? "/" : p.replace(/^\/ar(?=\/)/, "");
    const en = logical, ar = logical === "/" ? "/ar" : `/ar${logical}`;
    return `<url><loc>${origin}${p}</loc><lastmod>${today}</lastmod><xhtml:link rel="alternate" hreflang="en" href="${origin}${en}"/><xhtml:link rel="alternate" hreflang="ar" href="${origin}${ar}"/></url>`;
  }).join("")}</urlset>`;
}

const server = http.createServer(async (req, res) => {
  // SITE_URL is the canonical origin; on Render the platform provides RENDER_EXTERNAL_URL until a custom domain is set
  const origin = (process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || `http://${req.headers.host || `localhost:${port}`}`).replace(/\/$/, "");
  const url = new URL(req.url || "/", origin);

  // Optional: once DNS points the real domain at this service, redirect every other host (onrender.com, www) to SITE_URL.
  if (process.env.MIRAI_REDIRECT_TO_SITE_URL === "1" && process.env.SITE_URL && req.method !== "POST" && url.pathname !== "/health") {
    const canonical = new URL(process.env.SITE_URL);
    const host = (req.headers["x-forwarded-host"] || req.headers.host || "").toString().split(",")[0].trim();
    if (host && host !== canonical.host) {
      return send(req, res, 301, "", { location: `${canonical.origin}${url.pathname}${url.search}`, "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" });
    }
  }

  if (!["GET", "HEAD", "POST"].includes(req.method)) {
    return send(req, res, 405, "Method Not Allowed", { "content-type": "text/plain; charset=utf-8", allow: "GET, HEAD, POST" });
  }

  if (req.method !== "POST" && url.pathname === "/health") return json(req, res, 200, { ok: true, uptime: Math.round(process.uptime()) });

  if (req.method !== "POST" && url.pathname === "/robots.txt") {
    return send(req, res, 200, `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`, { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" });
  }

  if (req.method !== "POST" && url.pathname === "/sitemap.xml") {
    return send(req, res, 200, sitemap(origin), { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" });
  }

  if (req.method === "POST" && url.pathname === "/api/consultation") {
    try {
      const payload = await readJson(req);
      const result = await handleConsultation(payload, process.env, fetch);
      return json(req, res, result.status, result.body);
    } catch (error) {
      return json(req, res, 400, { ok: false, error: "invalid_request", message: error instanceof Error ? error.message : "Invalid request" });
    }
  }

  if (req.method === "POST") return json(req, res, 404, { ok: false, error: "not_found" });

  // trailing-slash normalisation: /about/ -> /about
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    return send(req, res, 301, "", { location: url.pathname.replace(/\/+$/, "") + url.search, "content-type": "text/plain; charset=utf-8" });
  }

  if (await serveStatic(req, url.pathname, res)) return;

  const rendered = renderRequest(url.pathname);
  if (rendered.status === 301) {
    // legacy URLs (/work, /audit, sector pages) → their new home; body is a noindex fallback page
    return send(req, res, 301, rendered.body, { location: rendered.location, "content-type": rendered.contentType, "cache-control": "public, max-age=86400" });
  }
  return send(req, res, rendered.status, rendered.body, {
    "content-type": rendered.contentType,
    "cache-control": isProd ? "public, max-age=300, stale-while-revalidate=600" : "no-store"
  });
});

server.keepAliveTimeout = 65_000;
server.listen(port, host, () => {
  console.log(`Mirai website running at http://localhost:${port}${isProd ? " (production)" : ""}`);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => { console.log(`\n${sig} received — shutting down`); server.close(() => process.exit(0)); setTimeout(() => process.exit(0), 3000).unref(); });
}
