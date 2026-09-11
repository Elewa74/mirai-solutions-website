import test from "node:test";
import assert from "node:assert/strict";
import { renderPage } from "../lib/render.mjs";

test("renders English homepage with approved hero and LTR document", () => {
  const html = renderPage("/", "en");
  assert.match(html, /<html[^>]*lang="en"[^>]*dir="ltr"/);
  assert.match(html, /Websites built around what your business needs to achieve\./);
  assert.match(html, /href="\/solutions"/);
  assert.match(html, /href="\/ar"[^>]*>AR</);
});

test("renders Arabic logical pages under /ar with RTL document", () => {
  const html = renderPage("/ar/who-we-help", "ar");
  assert.match(html, /<html[^>]*lang="ar"[^>]*dir="rtl"/);
  assert.match(html, /أعمال مختلفة\. جماهير مختلفة\. خطوات مختلفة\./);
  assert.match(html, /href="\/who-we-help"[^>]*>EN</);
});

test("renders all approved page types", () => {
  for (const path of ["/", "/solutions", "/who-we-help", "/work", "/about", "/audit"]) {
    const html = renderPage(path, "en");
    assert.match(html, /Mirai Solutions/);
    assert.match(html, /Get a Free Audit/);
  }
});

test("keeps Arabic visitors in the Arabic experience from the logo and avoids unconfigured email links", () => {
  const html = renderPage("/ar", "ar");
  assert.match(html, /class="brand" href="\/ar"/);
  assert.doesNotMatch(html, /hello@miraisolutions\.com/);
});

test("photography: every image has localised alt text, responsive sources and reserved dimensions", () => {
  for (const [path, locale] of [["/", "en"], ["/ar", "ar"], ["/manufacturing", "en"], ["/ar/about", "ar"], ["/work", "en"], ["/audit", "en"], ["/who-we-help", "en"]]) {
    const html = renderPage(path, locale);
    const imgs = html.match(/<img\b[^>]*>/g) || [];
    assert.ok(imgs.length >= 3, `${path} should carry photography`);
    for (const img of imgs) {
      assert.match(img, /\salt="/, `${path}: img without alt → ${img.slice(0, 80)}`);
      assert.match(img, /\swidth="\d+"\s+height="\d+"/, `${path}: img without dimensions → ${img.slice(0, 80)}`);
    }
    if (locale === "ar") assert.match(html, /alt="[^"]*[؀-ۿ]/, `${path}: Arabic alt text expected`);
    if (path !== "/who-we-help") assert.match(html, /<source type="image\/webp" srcset="\/images\/[a-z]+-800\.webp\?v=[^"]+ 800w, \/images\/[a-z]+-1600\.webp/);
    else assert.match(html, /class="thumb" src="\/images\/manufacturing-thumb\.webp/);
    assert.match(html, /property="og:image" content="https:\/\/[^"]+\/images\/[a-z]+-1200\.jpg"/);
  }
  // segment pages preload their hero photo (LCP) and only one image is eager
  const seg = renderPage("/retail", "en");
  assert.match(seg, /<link rel="preload" as="image" imagesrcset="\/images\/retail-800\.webp/);
  assert.equal((seg.match(/loading="eager"/g) || []).length, 1);
});
