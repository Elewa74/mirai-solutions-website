import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

async function withServer(env, fn) {
  const port = 3900 + Math.floor(Math.random() * 90);
  const child = spawn(process.execPath, ["server.mjs"], { env: { ...process.env, PORT: String(port), NODE_ENV: "production", ...env }, stdio: "ignore" });
  try {
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://localhost:${port}/health`)).ok) break; } catch {} await sleep(150); }
    await fn(`http://localhost:${port}`);
  } finally { child.kill(); }
}

test("MIRAI_REDIRECT_TO_SITE_URL=1 sends other hosts to the canonical domain but keeps /health and POST working", async () => {
  await withServer({ SITE_URL: "https://miraisolutions.net", MIRAI_REDIRECT_TO_SITE_URL: "1" }, async (base) => {
    const r = await fetch(`${base}/ar/about?x=1`, { redirect: "manual", headers: { "x-forwarded-host": "mirai-solutions.onrender.com" } });
    assert.equal(r.status, 301);
    assert.equal(r.headers.get("location"), "https://miraisolutions.net/ar/about?x=1");
    const www = await fetch(`${base}/`, { redirect: "manual", headers: { "x-forwarded-host": "www.miraisolutions.net" } });
    assert.equal(www.headers.get("location"), "https://miraisolutions.net/");
    assert.equal((await fetch(`${base}/health`, { headers: { "x-forwarded-host": "mirai-solutions.onrender.com" } })).status, 200);
    const same = await fetch(`${base}/about`, { redirect: "manual", headers: { "x-forwarded-host": "miraisolutions.net" } });
    assert.equal(same.status, 200);
  });
});

test("redirect stays off by default so the onrender.com review link keeps working", async () => {
  await withServer({ SITE_URL: "https://miraisolutions.net" }, async (base) => {
    const r = await fetch(`${base}/about`, { redirect: "manual", headers: { "x-forwarded-host": "mirai-solutions.onrender.com" } });
    assert.equal(r.status, 200);
    assert.match(await r.text(), /rel="canonical" href="https:\/\/miraisolutions\.net\/about"/);
  });
});
