import test from "node:test";
import assert from "node:assert/strict";
import { renderPage } from "../lib/render.mjs";
import { SCANNER_TEXT } from "./content.test.mjs";

const PAGES = [["/", "en"], ["/solutions", "en"], ["/who-we-help", "en"], ["/about", "en"], ["/ar", "ar"], ["/ar/solutions", "ar"], ["/ar/who-we-help", "ar"], ["/ar/about", "ar"]];
const links = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

test("English is the default locale with an LTR document; Arabic pages are RTL under /ar", () => {
  const en = renderPage("/", "en");
  assert.match(en, /<html[^>]*lang="en"[^>]*dir="ltr"/);
  assert.match(en, /Digital solutions built around/);
  assert.match(en, /href="\/ar"[^>]*>AR</);
  assert.match(en, /<nav class="desktop-nav"[^>]*>\s*<a aria-current="page" href="\/">Home<\/a>/);
  assert.match(renderPage("/about", "en"), /<nav class="desktop-nav"[^>]*>\s*<a  href="\/">Home<\/a>/);
  assert.match(renderPage("/ar/about", "ar"), /<a  href="\/ar">الرئيسية<\/a>/);
  const ar = renderPage("/ar/who-we-help", "ar");
  assert.match(ar, /<html[^>]*lang="ar"[^>]*dir="rtl"/);
  assert.match(ar, /أعمال مختلفة\. تحديات مختلفة\. حلول رقمية عملية\./);
  assert.match(ar, /href="\/who-we-help"[^>]*>EN</);
  assert.match(ar, /class="brand" href="\/ar"/);
});

test("every public page renders with the consultation CTA in header, footer, sticky bar and modal — no scanner, work or segment links", () => {
  for (const [path, locale] of PAGES) {
    const html = renderPage(path, locale);
    assert.match(html, /Mirai Solutions/);
    assert.doesNotMatch(html, SCANNER_TEXT, `${path} mentions the scanner`);
    assert.doesNotMatch(html, /\baudit\b/i, `${path} uses audit language`);
    for (const l of links(html)) assert.doesNotMatch(l, /^\/(ar\/)?(work|audit|manufacturing|retail|ngo)(\/|$|[?#])/, `${path} links to legacy route ${l}`);
    assert.doesNotMatch(html, /<a[^>]*href="[^"]*#lens/, `${path} links to the scanner band`);
    const ctas = html.match(/<button[^>]*data-consult\b/g) || [];
    assert.ok(ctas.length >= 4, `${path}: header + mobile nav + footer + sticky CTA expected, found ${ctas.length}`);
    assert.match(html, /class="site-header"[\s\S]*data-consult[\s\S]*<\/header>/, `${path}: header CTA`);
    assert.match(html, /<footer[\s\S]*data-consult[\s\S]*<\/footer>/, `${path}: footer CTA`);
    assert.match(html, /data-consult-modal/, `${path}: global modal`);
    assert.doesNotMatch(html, /Work<\/a>|أعمالنا<\/a>/, `${path}: Work nav link`);
  }
});

test("the consultation modal has dialog semantics, connected labels and the approved fields", () => {
  const html = renderPage("/", "en");
  assert.match(html, /role="dialog" aria-modal="true" aria-labelledby="consult-title" aria-describedby="consult-intro"/);
  assert.match(html, /<h2 id="consult-title">/);
  for (const name of ["name", "company", "email", "whatsapp", "businessType", "interest", "website", "message"]) {
    const id = `c-${name === "businessType" ? "business" : name}`;
    assert.match(html, new RegExp(`<label for="${id}">`), `label for ${name}`);
    assert.match(html, new RegExp(`id="${id}" name="${name}"`), `control ${name}`);
  }
  for (const name of ["name", "company", "email", "whatsapp", "businessType", "interest", "message"]) assert.match(html, new RegExp(`name="${name}"[^>]*required`), `${name} required`);
  assert.doesNotMatch(html, /name="website"[^>]*required/);
  assert.doesNotMatch(html, /name="budget"|name="timeline"|name="scanScore"/);
  assert.match(html, /<option value="Not Sure Yet">/);
  assert.match(html, /data-whatsapp-link[^>]*target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /data-consult-close aria-label="Close"/);
  const ar = renderPage("/ar", "ar");
  assert.match(ar, /<option value="لم أحدد بعد">/);
});

test("solution CTAs preselect the matching 'Interested in' value", () => {
  const home = renderPage("/", "en");
  for (const key of ["websites", "brand", "content", "workflows"]) assert.match(home, new RegExp(`data-consult data-interest="${key}"`), `home ${key}`);
  const sol = renderPage("/solutions", "en");
  for (const key of ["websites", "brand", "content", "workflows"]) assert.match(sol, new RegExp(`<article class="sol-detail" id="${key}"[\\s\\S]*?data-consult data-interest="${key}"`), `solutions ${key}`);
});

test("homepage follows the approved section order and has no fake proof", () => {
  const html = renderPage("/", "en");
  const order = ["hero-v4", 'id="trust"', 'id="solutions"', 'id="who-we-help"', "mix-section", 'id="how-we-work"', 'id="why-mirai"', 'id="faq"', "final-cta", "<footer"];
  let last = -1;
  for (const marker of order) { const i = html.indexOf(marker); assert.ok(i > last, `section ${marker} out of order`); last = i; }
  assert.match(html, /Websites &amp; Digital Presence/);
  assert.match(html, /Flagship solution/);
  assert.doesNotMatch(html, /case study|Social Impact Organization|SELECTED WORK/i);
  assert.doesNotMatch(html, /<a class="audience-row/, "audience rows must not be links");
  assert.match(html, /role="tablist"[\s\S]*role="tab"[\s\S]*role="tabpanel"/);
});

test("who-we-help rows are not links and carry needs; about lists what we do today", () => {
  const who = renderPage("/who-we-help", "en");
  assert.doesNotMatch(who, /<a class="audience-row/);
  assert.doesNotMatch(who, /Read the playbook|audience-arrow/);
  assert.match(who, /Needs may include/);
  const about = renderPage("/about", "en");
  assert.match(about, /What we do today/);
  assert.match(about, /12\+ years/);
  assert.match(about, /Mirai Solutions itself is a new company/);
  for (const p of ["Business first", "Technology with purpose", "Practical execution", "Human judgment", "Ownership"]) assert.match(about, new RegExp(p));
});

test("metadata: approved titles/descriptions, canonical, hreflang, Open Graph, JSON-LD with four services and no scan schema", () => {
  const home = renderPage("/", "en");
  assert.match(home, /<title>Mirai Solutions \| Practical Digital Solutions for Growing Businesses<\/title>/);
  assert.match(home, /<link rel="canonical" href="https:\/\/miraisolutions\.net\/">/);
  assert.match(home, /hreflang="en"[\s\S]*hreflang="ar"[\s\S]*hreflang="x-default"/);
  assert.match(home, /property="og:url"/);
  const ld = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const services = ld["@graph"].filter((n) => n["@type"] === "Service");
  assert.equal(services.length, 4);
  assert.ok(ld["@graph"].some((n) => n["@type"] === "FAQPage"));
  assert.doesNotMatch(JSON.stringify(ld), /scan|audit/i);
  assert.match(renderPage("/solutions", "en"), /<title>Digital Solutions for SMEs &amp; Organizations \| Mirai Solutions<\/title>/);
  assert.match(renderPage("/who-we-help", "en"), /<title>Digital Solutions for SMEs, Manufacturers, Retail &amp; NGOs \| Mirai Solutions<\/title>/);
  assert.match(renderPage("/about", "en"), /<title>About Mirai Solutions \| Business, Technology &amp; Practical Digital Solutions<\/title>/);
  assert.match(renderPage("/ar", "ar"), /<title>Mirai Solutions \| حلول رقمية عملية للأعمال النامية<\/title>/);
});

test("legacy redirect and 404 pages are noindex; redirect pages refresh to the destination", () => {
  const r = renderPage("/redirect", "ar", { redirectTo: "/ar/who-we-help" });
  assert.match(r, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(r, /http-equiv="refresh" content="0;url=\/ar\/who-we-help"/);
  assert.match(r, /location\.replace\("\/ar\/who-we-help"\)/);
  assert.match(r, /<link rel="canonical" href="https:\/\/miraisolutions\.net\/ar\/who-we-help">/);
  assert.doesNotMatch(r, /hreflang/);
  const nf = renderPage("/not-found", "en");
  assert.match(nf, /noindex/);
  assert.match(nf, /Page not found/);
});

test("photography: every image has localised alt text, responsive sources and reserved dimensions", () => {
  for (const [path, locale] of PAGES) {
    const html = renderPage(path, locale);
    const imgs = html.match(/<img\b[^>]*>/g) || [];
    assert.ok(imgs.length >= 3, `${path} should carry photography`);
    for (const img of imgs) {
      assert.match(img, /\salt="/, `${path}: img without alt → ${img.slice(0, 80)}`);
      assert.match(img, /\swidth="\d+"\s+height="\d+"/, `${path}: img without dimensions → ${img.slice(0, 80)}`);
    }
    if (locale === "ar") assert.match(html, /alt="[^"]*[؀-ۿ]/, `${path}: Arabic alt text expected`);
    assert.match(html, /<source type="image\/webp" srcset="\/images\/[a-z]+-800\.webp\?v=[^"]+ 800w, \/images\/[a-z]+-1600\.webp/);
    assert.match(html, /property="og:image" content="https:\/\/[^"]+\/images\/team-1200\.jpg"/);
  }
});

test("WhatsApp number and the optional email relay are exposed to the client only when configured", () => {
  const prev = { w: process.env.MIRAI_WHATSAPP, f: process.env.MIRAI_FORM_ENDPOINT, c: process.env.MIRAI_FORM_CC };
  delete process.env.MIRAI_WHATSAPP; delete process.env.MIRAI_FORM_ENDPOINT; delete process.env.MIRAI_FORM_CC;
  const bare = renderPage("/", "en");
  assert.doesNotMatch(bare, /data-whatsapp=|data-form-endpoint=|data-form-cc=/);
  process.env.MIRAI_WHATSAPP = "+20 100 000 0000";
  process.env.MIRAI_FORM_ENDPOINT = "https://formsubmit.co/ajax/leads@example.com";
  process.env.MIRAI_FORM_CC = "second@example.com";
  const html = renderPage("/", "en");
  assert.match(html, /data-whatsapp="201000000000"/);
  assert.match(html, /data-form-endpoint="https:\/\/formsubmit\.co\/ajax\/leads@example\.com" data-form-cc="second@example\.com"/);
  process.env.MIRAI_NOTIFY_URL = "https://api.callmebot.com/whatsapp.php?phone=201000000000&apikey=k&text={text}";
  assert.match(renderPage("/", "en"), /data-notify-url="https:\/\/api\.callmebot\.com\/whatsapp\.php\?phone=201000000000&amp;apikey=k&amp;text=\{text\}"/);
  delete process.env.MIRAI_NOTIFY_URL;
  process.env.MIRAI_FORM_ENDPOINT = "not-a-url";
  assert.doesNotMatch(renderPage("/", "en"), /data-form-endpoint=/, "only https endpoints are accepted");
  for (const [k, v] of [["MIRAI_WHATSAPP", prev.w], ["MIRAI_FORM_ENDPOINT", prev.f], ["MIRAI_FORM_CC", prev.c]]) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
});
