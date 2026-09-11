#!/usr/bin/env node
/**
 * Mirai preflight — one-command pre-launch check.
 * Usage:  node scripts/preflight.mjs            (starts the site on :3999, checks, stops)
 *         node scripts/preflight.mjs --url http://localhost:3000   (check a running instance)
 * Output: console table + _reports/preflight.md + _reports/preflight.json ; exit 1 on FAIL.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";

const args = process.argv.slice(2);
const urlArg = args.includes("--url") ? args[args.indexOf("--url") + 1] : null;
const PORT = 3999;
const base = (urlArg || `http://localhost:${PORT}`).replace(/\/$/, "");
const routes = ["/", "/solutions", "/who-we-help", "/manufacturing", "/retail", "/ngo", "/work", "/about", "/audit"];
const all = [...routes, ...routes.map((r) => (r === "/" ? "/ar" : `/ar${r}`))];

const results = []; // {area, check, status: PASS|WARN|FAIL, detail}
const add = (area, check, ok, detail = "", warn = false) => results.push({ area, check, status: ok ? "PASS" : warn ? "WARN" : "FAIL", detail });

let child = null;
if (!urlArg) {
  child = spawn(process.execPath, ["server.mjs"], { env: { ...process.env, PORT: String(PORT), NODE_ENV: "production", SITE_URL: process.env.SITE_URL || "https://mirai.example" }, stdio: ["ignore", "pipe", "pipe"] });
  child.stderr.on("data", (d) => process.stderr.write(`[server] ${d}`));
  let up = false;
  for (let i = 0; i < 40 && !up; i++) { try { const r = await fetch(`${base}/health`); up = r.ok; } catch {} if (!up) await sleep(250); }
  add("server", "starts and answers /health", up, up ? `${base}/health` : "no answer after 10s");
  if (!up) { finish(); }
}

const strip = (s = "") => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const pages = {};
for (const route of all) {
  const t0 = Date.now();
  let res, html = "";
  try { res = await fetch(base + route, { headers: { "accept-encoding": "gzip" } }); html = await res.text(); } catch (e) { add("routes", `GET ${route}`, false, String(e)); continue; }
  const ms = Date.now() - t0;
  pages[route] = { res, html, ms };
  add("routes", `GET ${route}`, res.status === 200, `${res.status} · ${ms} ms · ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
}

// 404 behaviour
try { const r = await fetch(`${base}/this-page-does-not-exist`); add("routes", "unknown route returns 404", r.status === 404, String(r.status)); } catch (e) { add("routes", "unknown route returns 404", false, String(e)); }

// SEO per page
for (const [route, { html, res }] of Object.entries(pages)) {
  if (!html) continue;
  const title = strip((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
  const desc = ((html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) || [])[1] || "");
  const h1 = (html.match(/<h1\b/gi) || []).length;
  const canonical = (html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) || [])[1];
  const hreflangs = [...html.matchAll(/<link[^>]+hreflang=["']([^"']+)["']/gi)].map((m) => m[1]);
  const og = new Set([...html.matchAll(/<meta[^>]+property=["']og:(title|description|type|url|locale)["']/gi)].map((m) => m[1]));
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let ldOk = ld.length > 0; for (const m of ld) { try { JSON.parse(m[1]); } catch { ldOk = false; } }
  const imgs = html.match(/<img\b[^>]*>/gi) || []; const noAlt = imgs.filter((i) => !/\salt=/.test(i)).length;
  const lang = (html.match(/<html[^>]*\slang=["']([^"']+)["']/i) || [])[1];
  const dir = (html.match(/<html[^>]*\sdir=["']([^"']+)["']/i) || [])[1];
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const favicon = /<link[^>]+rel=["']icon["']/i.test(html);
  const isAr = route === "/ar" || route.startsWith("/ar/");
  const p = `SEO ${route}`;
  add(p, "title 20–70 chars", title.length >= 20 && title.length <= 70, `${title.length}: ${title.slice(0, 60)}`, title.length > 70 && title.length <= 80);
  add(p, "meta description 80–170 chars", desc.length >= 80 && desc.length <= 170, `${desc.length}`, desc.length > 0);
  add(p, "exactly one H1", h1 === 1, `${h1}`);
  add(p, "canonical present", !!canonical, canonical || "missing");
  add(p, "hreflang en + ar + x-default", ["en", "ar", "x-default"].every((k) => hreflangs.includes(k)), hreflangs.join(",") || "none");
  add(p, "Open Graph title/description/type/url", ["title", "description", "type", "url"].every((k) => og.has(k)), [...og].join(","));
  add(p, "JSON-LD present and valid", ldOk, `${ld.length} block(s)`);
  add(p, "all <img> have alt", noAlt === 0, `${imgs.length} images, ${noAlt} without alt`);
  add(p, "html lang/dir match locale", isAr ? lang === "ar" && dir === "rtl" : lang === "en" && dir === "ltr", `${lang}/${dir}`);
  add(p, "viewport meta", viewport, "");
  add(p, "favicon link", favicon, "");
  if (!isAr) { const ar = pages[route === "/" ? "/ar" : `/ar${route}`]; if (ar?.html) { const arTitle = strip((ar.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || ""); add(p, "Arabic title differs from English", arTitle !== title, ""); } }
}

// Headers on home
{
  const res = pages["/"]?.res;
  if (res) {
    const h = (k) => res.headers.get(k);
    add("headers", "content-type text/html; charset=utf-8", /text\/html;\s*charset=utf-8/i.test(h("content-type") || ""), h("content-type") || "");
    add("headers", "x-content-type-options: nosniff", h("x-content-type-options") === "nosniff", h("x-content-type-options") || "missing", true);
    add("headers", "referrer-policy set", !!h("referrer-policy"), h("referrer-policy") || "missing", true);
    add("headers", "content-security-policy set", !!h("content-security-policy"), h("content-security-policy") ? "present" : "missing", true);
    add("headers", "strict-transport-security (behind HTTPS)", !!h("strict-transport-security"), h("strict-transport-security") || "missing — fine locally, required in production", true);
    add("headers", "gzip/br compression", /gzip|br/.test(h("content-encoding") || ""), h("content-encoding") || "none", true);
  }
}

// Static assets
// photography referenced by the rendered pages must exist and stay within budget
{
  const refs = new Set();
  for (const p of all) { const html = pages[p]?.html || ""; for (const m of html.matchAll(/\/images\/[a-z0-9-]+\.(?:webp|jpg)/g)) refs.add(m[0]); }
  let total = 0, missing = [];
  for (const ref of refs) { try { const r = await fetch(base + ref); const buf = await r.arrayBuffer(); if (!r.ok) missing.push(ref); else total += buf.byteLength; } catch { missing.push(ref); } }
  add("assets", "every referenced photo is served", missing.length === 0, missing.join(" ") || `${refs.size} files · ${(total / 1024).toFixed(0)} KB total`);
  let biggest = 0, biggestName = "";
  for (const ref of refs) { if (!/-1600\.webp$/.test(ref)) continue; try { const buf = await (await fetch(base + ref)).arrayBuffer(); if (buf.byteLength > biggest) { biggest = buf.byteLength; biggestName = ref; } } catch {} }
  add("performance", "largest hero photo ≤ 140 KB", biggest <= 140 * 1024, `${biggestName} · ${(biggest / 1024).toFixed(0)} KB`, biggest <= 200 * 1024);
}
for (const asset of ["/site.css", "/site.js", "/theme.mjs", "/favicon.svg", "/favicon.ico", "/apple-touch-icon.png", "/site.webmanifest", "/brand/mirai-logo-light.webp", "/brand/mirai-logo-dark.webp", "/brand/mirai-logo-light.png", "/images/team-800.webp", "/images/glass-1600.webp", "/robots.txt", "/sitemap.xml"]) {
  try { const r = await fetch(base + asset); const buf = await r.arrayBuffer(); add("assets", `GET ${asset}`, r.ok, `${r.status} · ${(buf.byteLength / 1024).toFixed(0)} KB · ${r.headers.get("content-type")} · cache: ${r.headers.get("cache-control")}`); if (asset === "/sitemap.xml") { const xml = Buffer.from(buf).toString(); const missing = all.filter((p) => !xml.includes(`${p}</loc>`)); add("assets", "sitemap lists every route", missing.length === 0, missing.join(" ") || `${all.length} routes`); } } catch (e) { add("assets", `GET ${asset}`, false, String(e)); }
}
// budget
{
  const total = Object.values(pages).reduce((a, p) => a + Buffer.byteLength(p.html || ""), 0) / Object.keys(pages).length;
  add("performance", "average HTML < 60 KB", total < 60 * 1024, `${(total / 1024).toFixed(0)} KB avg`, total < 90 * 1024);
  const slow = Object.entries(pages).filter(([, p]) => p.ms > 300).map(([r, p]) => `${r} ${p.ms}ms`);
  add("performance", "server render < 300 ms per page", slow.length === 0, slow.join(", ") || "all fast");
}

// API
try {
  const bad = await fetch(`${base}/api/scan`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: "localhost" }) });
  add("api", "/api/scan rejects localhost (SSRF guard)", bad.status === 422, String(bad.status));
  const ip = await fetch(`${base}/api/scan`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: "http://169.254.169.254/" }) });
  add("api", "/api/scan rejects raw IPs", ip.status === 422, String(ip.status));
  const audit = await fetch(`${base}/api/audit`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Test", company: "Co", businessType: "Other", improvementGoal: "x", email: "bad", whatsapp: "+201000000000" }) });
  add("api", "/api/audit validates email", audit.status === 400, String(audit.status));
  const env = ["RESEND_API_KEY", "MIRAI_LEAD_EMAIL", "MIRAI_WHATSAPP", "SITE_URL"].filter((k) => !process.env[k] && !(k === "SITE_URL" && process.env.RENDER_EXTERNAL_URL));
  add("env", "production env vars set", env.length === 0, env.length ? `missing: ${env.join(", ")}` : "all set", true);
} catch (e) { add("api", "API reachable", false, String(e)); }

finish();

async function finish() {
  if (child) child.kill();
  const fails = results.filter((r) => r.status === "FAIL").length, warns = results.filter((r) => r.status === "WARN").length;
  const pad = (s, n) => String(s).padEnd(n).slice(0, n);
  console.log("\n" + pad("STATUS", 6) + " " + pad("AREA", 22) + " " + pad("CHECK", 46) + " DETAIL");
  for (const r of results) console.log(pad(r.status, 6) + " " + pad(r.area, 22) + " " + pad(r.check, 46) + " " + r.detail);
  console.log(`\n${results.length} checks · ${fails} FAIL · ${warns} WARN\n`);
  await mkdir("_reports", { recursive: true });
  const md = [`# Mirai preflight — ${new Date().toISOString()}`, ``, `Base: ${base}`, ``, `**${results.length} checks · ${fails} FAIL · ${warns} WARN**`, ``, `| Status | Area | Check | Detail |`, `|---|---|---|---|`, ...results.map((r) => `| ${r.status} | ${r.area} | ${r.check} | ${String(r.detail).replace(/\|/g, "/")} |`)].join("\n");
  await writeFile("_reports/preflight.md", md);
  await writeFile("_reports/preflight.json", JSON.stringify({ base, when: new Date().toISOString(), results }, null, 2));
  console.log("Report: _reports/preflight.md");
  process.exit(fails ? 1 : 0);
}
