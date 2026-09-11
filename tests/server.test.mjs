import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { SCANNER_TEXT } from "./content.test.mjs";

async function withServer(env, fn) {
  const port = 4100 + Math.floor(Math.random() * 400);
  const child = spawn(process.execPath, ["server.mjs"], { env: { ...process.env, PORT: String(port), NODE_ENV: "production", SITE_URL: "https://miraisolutions.net", ...env }, stdio: "ignore" });
  try {
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://localhost:${port}/health`)).ok) break; } catch {} await sleep(150); }
    await fn(`http://localhost:${port}`);
  } finally { child.kill(); }
}

test("server: legacy URLs 301 to their new home, /api/scan is gone, sitemap lists only the eight canonical pages", async () => {
  await withServer({}, async (base) => {
    const expect = [["/work", "/#clients"], ["/ar/work", "/ar#clients"], ["/audit", "/?consult=1"], ["/ar/audit", "/ar?consult=1"], ["/manufacturing", "/who-we-help"], ["/retail", "/who-we-help"], ["/ngo", "/who-we-help"], ["/ar/ngo", "/ar/who-we-help"]];
    for (const [from, to] of expect) {
      const r = await fetch(base + from, { redirect: "manual" });
      assert.equal(r.status, 301, from);
      assert.equal(r.headers.get("location"), to, from);
      assert.match(await r.text(), /noindex/, `${from} body should be noindex`);
    }
    assert.equal((await fetch(`${base}/api/scan`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" })).status, 404);
    const bad = await fetch(`${base}/api/consultation`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "x", email: "bad" }) });
    assert.equal(bad.status, 400);
    const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.deepEqual(locs, ["https://miraisolutions.net/", "https://miraisolutions.net/solutions", "https://miraisolutions.net/who-we-help", "https://miraisolutions.net/about", "https://miraisolutions.net/ar", "https://miraisolutions.net/ar/solutions", "https://miraisolutions.net/ar/who-we-help", "https://miraisolutions.net/ar/about"]);
    for (const p of ["/", "/solutions", "/who-we-help", "/about", "/ar", "/ar/solutions", "/ar/who-we-help", "/ar/about"]) {
      const r = await fetch(base + p);
      assert.equal(r.status, 200, p);
      const html = await r.text();
      assert.doesNotMatch(html, SCANNER_TEXT, p);
      assert.doesNotMatch(html, /href="\/(ar\/)?(work|audit|manufacturing|retail|ngo)"/, p);
    }
    assert.equal((await fetch(`${base}/this-does-not-exist`)).status, 404);
  });
});

test("server: /api/consultation accepts a valid request and returns the WhatsApp hand-off without faking email", async () => {
  await withServer({ MIRAI_WHATSAPP: "201000000000" }, async (base) => {
    const r = await fetch(`${base}/api/consultation`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Mona", company: "Nile Works", email: "mona@example.com", whatsapp: "+201001234567", businessType: "Other", interest: "Not Sure Yet", website: "", message: "Hello", locale: "en" }) });
    assert.equal(r.status, 200);
    const body = await r.json();
    assert.equal(body.ok, true);
    assert.equal(body.emailSent, false);
    assert.equal(body.emailConfigured, false);
    assert.match(body.whatsappHref, /^https:\/\/wa\.me\/201000000000\?text=/);
  });
});
