import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { SCANNER_TEXT } from "./content.test.mjs";

const run = promisify(execFile);

async function exportTo(env) {
  const dir = await mkdtemp(join(tmpdir(), "mirai-export-"));
  await run(process.execPath, ["scripts/export-static.mjs"], { env: { ...process.env, ...env, EXPORT_DIR: dir, NODE_ENV: "production", SITE_URL: "https://miraisolutions.net" } });
  return dir;
}
async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out); else if (entry.name.endsWith(".html")) out.push(p);
  }
  return out;
}
const exists = (p) => stat(p).then(() => true, () => false);

test("static export: canonical pages + noindex legacy redirects, honest static flags, sitemap and links that resolve", async () => {
  const dir = await exportTo({ BASE_PATH: "", MIRAI_WHATSAPP: "+20 100 000 0000" });
  try {
    for (const p of ["index.html", "solutions/index.html", "who-we-help/index.html", "about/index.html", "ar/index.html", "ar/solutions/index.html", "ar/who-we-help/index.html", "ar/about/index.html", "404.html", ".nojekyll", "site.css", "site.js", "theme.mjs", "sitemap.xml", "robots.txt", "site.webmanifest"]) assert.ok(await exists(join(dir, p)), `missing ${p}`);

    // legacy redirects: noindex + meta refresh + canonical to the destination
    const legacy = { "work/index.html": "/#clients", "ar/work/index.html": "/ar/#clients", "audit/index.html": "/?consult=1", "ar/audit/index.html": "/ar/?consult=1", "manufacturing/index.html": "/who-we-help/", "retail/index.html": "/who-we-help/", "ngo/index.html": "/who-we-help/", "ar/manufacturing/index.html": "/ar/who-we-help/", "ar/retail/index.html": "/ar/who-we-help/", "ar/ngo/index.html": "/ar/who-we-help/" };
    for (const [file, to] of Object.entries(legacy)) {
      const html = await readFile(join(dir, file), "utf8");
      assert.match(html, /<meta name="robots" content="noindex, nofollow">/, file);
      assert.match(html, new RegExp(`http-equiv="refresh" content="0;url=${to.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`), file);
      assert.match(html, /location\.replace\(/, file);
    }

    // sitemap: only the eight canonical pages, with trailing slashes
    const sitemap = await readFile(join(dir, "sitemap.xml"), "utf8");
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.deepEqual(locs, ["https://miraisolutions.net/", "https://miraisolutions.net/solutions/", "https://miraisolutions.net/who-we-help/", "https://miraisolutions.net/about/", "https://miraisolutions.net/ar/", "https://miraisolutions.net/ar/solutions/", "https://miraisolutions.net/ar/who-we-help/", "https://miraisolutions.net/ar/about/"]);
    assert.match(await readFile(join(dir, "robots.txt"), "utf8"), /Allow: \/\nSitemap: https:\/\/miraisolutions\.net\/sitemap\.xml/);

    // every page: static flags, WhatsApp baked, no scanner text, and every internal link resolves to an exported file
    const pages = (await walk(dir)).filter((p) => !/\/(ar\/)?(work|audit|manufacturing|retail|ngo)\/index\.html$/.test(p));
    for (const file of pages) {
      const html = await readFile(file, "utf8");
      assert.match(html, /<body[^>]*data-static="1" data-base="">/, file);
      assert.match(html, /data-whatsapp="201000000000"/, file);
      assert.doesNotMatch(html, SCANNER_TEXT, file);
      assert.doesNotMatch(html, /href="\/(ar\/)?(work|audit|manufacturing|retail|ngo)\/?"/, file);
      if (!file.endsWith("404.html")) assert.doesNotMatch(html, /name="robots" content="noindex/, file);
      for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
        const target = m[1];
        const fsPath = target.endsWith("/") ? join(dir, target, "index.html") : join(dir, target);
        assert.ok(await exists(fsPath), `${file} → ${target} does not resolve in dist`);
      }
      for (const m of html.matchAll(/href="(\/[^"]*#[a-z-]+)"/g)) {
        const [path, hash] = m[1].split("#");
        const targetHtml = await readFile(join(dir, path, "index.html"), "utf8");
        assert.match(targetHtml, new RegExp(`id="${hash}"`), `${file} → ${m[1]} anchor missing`);
      }
    }
    // Arabic/English parity of exported pages
    for (const p of ["solutions", "who-we-help", "about"]) { assert.ok(await exists(join(dir, p, "index.html"))); assert.ok(await exists(join(dir, "ar", p, "index.html"))); }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("static export: a project-site preview (BASE_PATH) prefixes URLs and is noindex", async () => {
  const dir = await exportTo({ BASE_PATH: "/mirai-solutions-website" });
  try {
    const html = await readFile(join(dir, "ar", "index.html"), "utf8");
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
    assert.match(html, /href="\/mirai-solutions-website\/ar\/solutions\/"/);
    assert.match(html, /src="\/mirai-solutions-website\/site\.js/);
    assert.match(html, /data-base="\/mirai-solutions-website"/);
    assert.doesNotMatch(html, /data-whatsapp=/);
    const redirect = await readFile(join(dir, "audit", "index.html"), "utf8");
    assert.match(redirect, /url=\/mirai-solutions-website\/\?consult=1/);
    assert.match(await readFile(join(dir, "robots.txt"), "utf8"), /Disallow: \//);
    assert.ok(!(await exists(join(dir, "sitemap.xml"))));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
