#!/usr/bin/env node
/**
 * Static export for GitHub Pages (or any static host).
 *   node scripts/export-static.mjs            → dist/ served at the domain root (custom domain)
 *   BASE_PATH=/repo node scripts/export-static.mjs → dist/ served under https://user.github.io/repo/
 *
 * What changes versus the Node server:
 *   - every route becomes <route>/index.html (GitHub Pages serves folders)
 *   - root-relative URLs are prefixed with BASE_PATH; page links get a trailing slash
 *   - body gets data-static="1" so site.js degrades honestly: there is no /api/consultation, so the
 *     consultation form validates client-side and hands off to WhatsApp with the details pre-filled
 *     (MIRAI_WHATSAPP is baked into data-whatsapp at export time)
 *   - legacy URLs (/work, /audit, /manufacturing, /retail, /ngo + Arabic) become noindex redirect pages
 *   - a preview build (BASE_PATH set) is marked noindex and robots.txt disallows crawling; a root
 *     build (custom domain) keeps indexing on and ships sitemap.xml with the canonical pages only
 */
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderPage } from "../lib/render.mjs";
import { LEGACY_REDIRECTS, PUBLIC_ROUTES, legacyRedirect } from "../lib/http.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = process.env.EXPORT_DIR ? resolve(process.env.EXPORT_DIR) : resolve(root, "dist");
const BASE = (process.env.BASE_PATH || "").replace(/\/+$/, "");
const preview = BASE !== "";
const siteUrl = (process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || "https://miraisolutions.net").replace(/\/$/, "");
const routes = PUBLIC_ROUTES;
const all = [...routes.map((r) => ({ path: r, locale: "en" })), ...routes.map((r) => ({ path: r === "/" ? "/ar" : `/ar${r}`, locale: "ar" }))];
const routeSet = new Set(all.map((r) => r.path));
const legacyPaths = Object.keys(LEGACY_REDIRECTS);
const legacy = [...legacyPaths.map((p) => ({ path: p, locale: "en" })), ...legacyPaths.map((p) => ({ path: `/ar${p}`, locale: "ar" }))];

/** "/who-we-help" → "<BASE>/who-we-help/", "/" → "<BASE>/", keeps ?query and #hash */
function staticUrl(dest) {
  const m = dest.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  const path = m[1] || "/", query = m[2] || "", hash = m[3] || "";
  const page = path === "/" ? "/" : `${path.replace(/\/$/, "")}/`;
  return `${BASE}${page}${query}${hash}`;
}

function rewrite(html) {
  // page links → BASE + route + trailing slash (so GitHub Pages serves index.html without a redirect)
  html = html.replace(/(href|action)="(\/[a-z-]*(?:\/[a-z-]+)?)(#[a-z-]+)?"/g, (m, attr, p, hash = "") => (routeSet.has(p) ? `${attr}="${BASE}${p === "/" ? "/" : p + "/"}${hash}"` : m));
  // assets
  html = html.replace(/(href|src|action)="\/(site\.css|site\.js|theme\.mjs|favicon\.svg|favicon\.ico|favicon-32\.png|apple-touch-icon\.png|site\.webmanifest|brand\/|images\/|fonts\/)/g, (m, attr, tail) => `${attr}="${BASE}/${tail}`);
  html = html.replace(/(srcset|imagesrcset)="([^"]+)"/g, (m, attr, list) => `${attr}="${list.replace(/(^|,\s*)\/(images|brand)\//g, `$1${BASE}/$2/`)}"`);
  // static-mode flags on <body>
  html = html.replace(/<body\b([^>]*)>/, `<body$1 data-static="1" data-base="${BASE}">`);
  if (preview) html = html.replace("</title>", '</title>\n  <meta name="robots" content="noindex, nofollow">');
  return html;
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const { path, locale } of all) {
  const html = rewrite(renderPage(path, locale));
  const dir = resolve(dist, "." + (path === "/" ? "" : path));
  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, "index.html"), html);
}
// legacy URLs → noindex redirect pages (meta refresh + JS + visible link)
for (const { path, locale } of legacy) {
  const dest = staticUrl(legacyRedirect(path));
  const html = rewrite(renderPage("/redirect", locale, { redirectTo: dest }));
  const dir = resolve(dist, "." + path);
  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, "index.html"), html);
}
await writeFile(resolve(dist, "404.html"), rewrite(renderPage("/not-found", "en")));

// static assets
for (const entry of ["site.css", "theme.mjs", "favicon.svg", "favicon.ico", "favicon-32.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "icon-512-maskable.png", "google81ab947214573202.html", "fonts", "brand", "images"]) {
  await cp(resolve(root, "public", entry), resolve(dist, entry), { recursive: true });
}
if (BASE) await writeFile(resolve(dist, "fonts", "fonts.css"), (await readFile(resolve(root, "public", "fonts", "fonts.css"), "utf8")).replaceAll("url(/fonts/", `url(${BASE}/fonts/`));
const js = (await readFile(resolve(root, "public", "site.js"), "utf8")).replace('from "/theme.mjs"', `from "${BASE}/theme.mjs"`);
await writeFile(resolve(dist, "site.js"), js);
await writeFile(resolve(dist, ".nojekyll"), "");
const manifest = JSON.parse(await readFile(resolve(root, "public", "site.webmanifest"), "utf8"));
manifest.start_url = `${BASE}/`; manifest.icons = manifest.icons.map((i) => ({ ...i, src: `${BASE}${i.src}` }));
await writeFile(resolve(dist, "site.webmanifest"), JSON.stringify(manifest, null, 2));

// crawling policy
if (preview) {
  await writeFile(resolve(dist, "robots.txt"), "User-agent: *\nDisallow: /\n");
} else {
  await writeFile(resolve(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
  const today = new Date().toISOString().slice(0, 10);
  const urls = all.map(({ path }) => {
    const logical = path === "/ar" ? "/" : path.replace(/^\/ar(?=\/)/, "");
    const en = logical, ar = logical === "/" ? "/ar" : `/ar${logical}`;
    return `<url><loc>${siteUrl}${path === "/" ? "/" : path + "/"}</loc><lastmod>${today}</lastmod><xhtml:link rel="alternate" hreflang="en" href="${siteUrl}${en === "/" ? "/" : en + "/"}"/><xhtml:link rel="alternate" hreflang="ar" href="${siteUrl}${ar}/"/></url>`;
  }).join("");
  await writeFile(resolve(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`);
}

console.log(`exported ${all.length} pages + ${legacy.length} legacy redirects → ${dist} (base path: "${BASE || "/"}", ${preview ? "preview/noindex" : "indexable"}${process.env.MIRAI_WHATSAPP ? ", WhatsApp hand-off configured" : ", MIRAI_WHATSAPP not set"})`);
