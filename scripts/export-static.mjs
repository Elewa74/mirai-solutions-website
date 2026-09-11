#!/usr/bin/env node
/**
 * Static export for GitHub Pages (or any static host).
 *   node scripts/export-static.mjs            → dist/ served at the domain root (custom domain)
 *   BASE_PATH=/repo node scripts/export-static.mjs → dist/ served under https://user.github.io/repo/
 *
 * What changes versus the Node server:
 *   - every route becomes <route>/index.html (GitHub Pages serves folders)
 *   - root-relative URLs are prefixed with BASE_PATH; page links get a trailing slash
 *   - body gets data-static="1" so site.js degrades gracefully: the Mirai Lens form falls back to the
 *     audit page (no /api/scan) and the audit form shows a preview notice (no /api/audit)
 *   - a preview build (BASE_PATH set) is marked noindex and robots.txt disallows crawling; a root
 *     build (custom domain) keeps indexing on and ships sitemap.xml
 */
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderPage } from "../lib/render.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = resolve(root, "dist");
const BASE = (process.env.BASE_PATH || "").replace(/\/+$/, "");
const preview = BASE !== "";
const siteUrl = (process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || "https://miraisolutions.net").replace(/\/$/, "");
const routes = ["/", "/solutions", "/who-we-help", "/manufacturing", "/retail", "/ngo", "/work", "/about", "/audit"];
const all = [...routes.map((r) => ({ path: r, locale: "en" })), ...routes.map((r) => ({ path: r === "/" ? "/ar" : `/ar${r}`, locale: "ar" }))];
const routeSet = new Set(all.map((r) => r.path));

function rewrite(html) {
  // page links → BASE + route + trailing slash (so GitHub Pages serves index.html without a redirect)
  html = html.replace(/(href|action)="(\/[a-z-]*(?:\/[a-z-]+)?)"/g, (m, attr, p) => (routeSet.has(p) ? `${attr}="${BASE}${p === "/" ? "/" : p + "/"}"` : m));
  // assets
  html = html.replace(/(href|src|action)="\/(site\.css|site\.js|theme\.mjs|favicon\.svg|brand\/|images\/)/g, (m, attr, tail) => `${attr}="${BASE}/${tail}`);
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
await writeFile(resolve(dist, "404.html"), rewrite(renderPage("/not-found", "en")));

// static assets
for (const entry of ["site.css", "theme.mjs", "favicon.svg", "brand", "images"]) {
  await cp(resolve(root, "public", entry), resolve(dist, entry), { recursive: true });
}
const js = (await readFile(resolve(root, "public", "site.js"), "utf8")).replace('from "/theme.mjs"', `from "${BASE}/theme.mjs"`);
await writeFile(resolve(dist, "site.js"), js);
await writeFile(resolve(dist, ".nojekyll"), "");

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

console.log(`exported ${all.length} pages → dist/ (base path: "${BASE || "/"}", ${preview ? "preview/noindex" : "indexable"})`);
