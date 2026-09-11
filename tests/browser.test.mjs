/**
 * Browser-level checks (consultation modal, keyboard access, static WhatsApp fallback, theme, mobile overflow).
 * Runs only when Playwright is available: `npm i -D playwright` locally, or set PLAYWRIGHT_MODULE to its index.mjs.
 * Skipped otherwise so `npm test` stays dependency-free.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

async function loadPlaywright() {
  for (const spec of ["playwright", process.env.PLAYWRIGHT_MODULE].filter(Boolean)) {
    try { return await import(spec); } catch {}
  }
  return null;
}
const pw = await loadPlaywright();

async function withServer(env, fn) {
  const port = 4600 + Math.floor(Math.random() * 300);
  const child = spawn(process.execPath, ["server.mjs"], { env: { ...process.env, PORT: String(port), NODE_ENV: "production", SITE_URL: "https://miraisolutions.net", ...env }, stdio: "ignore" });
  try {
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://localhost:${port}/health`)).ok) break; } catch {} await sleep(150); }
    await fn(`http://localhost:${port}`);
  } finally { child.kill(); }
}

test("browser: consultation modal — open/close, focus management, preselect, ?consult=1, validation, static WhatsApp hand-off, theme, no mobile overflow", { skip: pw ? false : "Playwright not installed" }, async () => {
  await withServer({ MIRAI_WHATSAPP: "201000000000" }, async (base) => {
    const browser = await pw.chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    // fonts are external; keep the test offline-safe
    await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: "text/css", body: "" }));
    const page = await ctx.newPage();
    const modal = page.locator("[data-consult-modal]");

    // header CTA opens the modal, first field focused, ESC closes and returns focus to the trigger
    await page.goto(`${base}/`);
    const headerCta = page.locator(".header-cta");
    await headerCta.click();
    await assert.doesNotReject(modal.waitFor({ state: "visible" }));
    assert.equal(await page.evaluate(() => document.activeElement?.id), "c-name");
    assert.equal(await page.locator("[role=dialog]").getAttribute("aria-modal"), "true");
    // Tab trap: shift+tab from the first control wraps to the last control inside the dialog
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.evaluate(() => !!document.activeElement?.closest("[data-consult-dialog]")), true);
    await page.keyboard.press("Escape");
    await modal.waitFor({ state: "hidden" });
    assert.equal(await page.evaluate(() => document.activeElement?.classList.contains("header-cta")), true);

    // contextual solution CTA preselects "Interested in"; backdrop click closes
    await page.locator('[data-consult][data-interest="content"]').first().click();
    await modal.waitFor({ state: "visible" });
    assert.equal(await page.locator("#c-interest").inputValue(), "Content Digitalization");
    await page.mouse.click(8, 450);
    await modal.waitFor({ state: "hidden" });

    // ?consult=1 auto-opens (legacy /audit lands here)
    await page.goto(`${base}/ar?consult=1`);
    await modal.waitFor({ state: "visible" });
    assert.equal(await page.evaluate(() => document.documentElement.dir), "rtl");

    // client-side validation blocks an empty submit and focuses the first invalid field
    await page.locator(".submit-button").click();
    assert.equal(await page.evaluate(() => document.activeElement?.id), "c-name");
    assert.ok((await page.locator('[data-error-for="name"]').textContent()).length > 3);

    // server mode without email config → WhatsApp hand-off, never a fake "sent"
    await page.fill("#c-name", "Mona"); await page.fill("#c-company", "Nile Works"); await page.fill("#c-email", "mona@example.com"); await page.fill("#c-whatsapp", "+201001234567");
    await page.selectOption("#c-business", { index: 1 }); await page.selectOption("#c-interest", { index: 1 }); await page.fill("#c-message", "نحتاج موقعًا ثنائي اللغة.");
    await page.locator(".submit-button").click();
    await page.locator("[data-consult-result]").waitFor({ state: "visible" });
    const wa = page.locator("[data-whatsapp-link]");
    assert.equal(await wa.isVisible(), true);
    assert.match(await wa.getAttribute("href"), /^https:\/\/wa\.me\/201000000000\?text=/);
    assert.match(decodeURIComponent(await wa.getAttribute("href")), /Nile Works/);
    assert.doesNotMatch(await page.locator("[data-result-title]").textContent(), /استلمنا طلبك/);

    // static export mode: inject the flags the exporter adds → WhatsApp hand-off without any API call
    let apiCalls = 0;
    await page.route("**/api/consultation", (r) => { apiCalls++; r.fulfill({ status: 500, body: "{}" }); });
    await page.route(`${base}/`, async (route) => {
      const res = await route.fetch();
      const html = (await res.text()).replace(/<body\b([^>]*)>/, '<body$1 data-static="1" data-base="">');
      await route.fulfill({ response: res, body: html, headers: { ...res.headers(), "content-type": "text/html; charset=utf-8", "content-length": String(Buffer.byteLength(html)) } });
    });
    await page.goto(`${base}/`);
    await page.locator(".header-cta").click();
    await page.fill("#c-name", "Mona"); await page.fill("#c-company", "Nile Works"); await page.fill("#c-email", "mona@example.com"); await page.fill("#c-whatsapp", "+201001234567");
    await page.selectOption("#c-business", { index: 2 }); await page.selectOption("#c-interest", { index: 5 }); await page.fill("#c-message", "Not sure yet — need advice.");
    await page.locator(".submit-button").click();
    await page.locator("[data-consult-result]").waitFor({ state: "visible" });
    assert.equal(apiCalls, 0, "static mode must not call the API");
    assert.match(await page.locator("[data-whatsapp-link]").getAttribute("href"), /Not%20Sure%20Yet/);
    assert.match(await page.locator("[data-result-title]").textContent(), /ready to send/i);

    // theme toggle: light default → dark → persisted
    await page.unroute(`${base}/`);
    await page.goto(`${base}/about`);
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "light");
    await page.locator("[data-theme-toggle]").click();
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "dark");
    await page.reload();
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "dark");
    await page.evaluate(() => localStorage.removeItem("mirai-theme"));

    // no horizontal overflow at 375px on every page in both locales, modal included
    await page.setViewportSize({ width: 375, height: 760 });
    for (const p of ["/", "/solutions", "/who-we-help", "/about", "/ar", "/ar/solutions", "/ar/who-we-help", "/ar/about"]) {
      await page.goto(base + p);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.equal(overflow, 0, `${p} overflows by ${overflow}px at 375px`);
    }
    await page.goto(`${base}/?consult=1`);
    await modal.waitFor({ state: "visible" });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0);
    await browser.close();
  });
});
