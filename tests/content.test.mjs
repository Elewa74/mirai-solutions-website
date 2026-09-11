import test from "node:test";
import assert from "node:assert/strict";
import { siteContent } from "../content/site-content.mjs";
import { organizations } from "../content/organizations.mjs";

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]));
  return typeof value;
}
function strings(value, out = []) {
  if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  else if (typeof value === "string") out.push(value);
  return out;
}

export const SCANNER_TEXT = /mirai lens|scan my website|website score|10 checks|ten checks|instant scan|digital presence score|api\/scan|افحص موقعي|درجة الحضور الرقمي|الفحص الفوري/i;

test("English and Arabic content dictionaries have matching shapes (parity)", () => {
  assert.deepEqual(shape(siteContent.en), shape(siteContent.ar));
});

test("navigation exposes only the four-page IA and the consultation CTA", () => {
  for (const locale of ["en", "ar"]) {
    assert.deepEqual(siteContent[locale].nav.items.map((i) => i.href), ["/solutions", "/who-we-help", "/about"]);
    assert.ok(siteContent[locale].nav.cta.length > 5);
  }
  assert.equal(siteContent.en.nav.cta, "Get a Free Consultation");
  assert.equal(siteContent.ar.nav.cta, "اطلب استشارة مجانية");
});

test("positioning: four solution areas with websites as the flagship; AI is not a service", () => {
  for (const locale of ["en", "ar"]) {
    const s = siteContent[locale].solutions;
    assert.deepEqual(s.map((x) => x.key), ["websites", "brand", "content", "workflows"]);
    assert.deepEqual(s.map((x) => x.flagship), [true, false, false, false]);
    for (const sol of s) for (const k of ["name", "positioning", "problem", "helps", "useful"]) assert.ok(sol[k].length > 10, `${locale} ${sol.key}.${k}`);
    assert.ok(s.every((x) => !/\bAI\b/.test(x.name)), "no AI service name");
  }
  assert.equal(siteContent.en.home.hero.title, "Digital solutions built around what your business needs to achieve.");
  assert.equal(siteContent.ar.home.hero.title, "حلول رقمية تُبنى حول ما يحتاجه عملك فعلًا.");
  assert.deepEqual(siteContent.en.home.hero.ring.nodes, ["Websites", "Content", "Brand", "Workflows"]);
  assert.equal(siteContent.en.global.brandLine, "Practical digital solutions built around real business needs.");
  assert.equal(siteContent.ar.global.philosophy, "المستقبل لمن يصنعه.");
});

test("no scanner, audit or invented-timeline language anywhere in the copy", () => {
  for (const locale of ["en", "ar"]) {
    const all = strings(siteContent[locale]);
    for (const s of all) {
      assert.doesNotMatch(s, SCANNER_TEXT, `${locale}: ${s}`);
      assert.doesNotMatch(s, /\baudit\b/i, `${locale}: ${s}`);
      assert.doesNotMatch(s, /6\s*[–-]\s*10 weeks|ستة إلى عشرة أسابيع/, `${locale}: ${s}`);
      assert.doesNotMatch(s, /\/work\b|\/audit\b|\/manufacturing\b|\/retail\b|\/ngo\b/, `${locale}: ${s}`);
    }
  }
});

test("consultation form model: required fields, five business types, five interests (four solutions + not sure)", () => {
  for (const locale of ["en", "ar"]) {
    const k = siteContent[locale].consult;
    assert.deepEqual(Object.keys(k.fields), ["name", "company", "email", "whatsapp", "businessType", "interest", "website", "message", "choose"]);
    assert.equal(k.businessTypes.length, 5);
    assert.equal(k.interests.length, 5);
    assert.deepEqual(Object.keys(k.errors.required), ["name", "company", "email", "whatsapp", "businessType", "interest", "message"]);
    assert.deepEqual(Object.keys(k.states), ["static", "success", "noEmail", "noChannel"]);
  }
});

test("audiences: SMEs umbrella + three priority groups; FAQ has the seven approved questions", () => {
  for (const locale of ["en", "ar"]) {
    assert.equal(siteContent[locale].home.audiences.items.length, 4);
    assert.equal(siteContent[locale].whoWeHelp.groups.length, 4);
    assert.equal(siteContent[locale].home.faq.items.length, 7);
    assert.equal(siteContent[locale].home.process.steps.length, 4);
    assert.equal(siteContent[locale].home.why.items.length, 4);
    assert.equal(siteContent[locale].about.principles.length, 5);
  }
  assert.match(siteContent.en.home.audiences.items[0].title, /SMEs/);
  assert.match(siteContent.en.home.audiences.items[1].title, /Manufacturing/);
  assert.match(siteContent.en.home.audiences.items[2].title, /Retail/);
  assert.match(siteContent.en.home.audiences.items[3].title, /NGOs/);
});

test("organizations data model only holds real entries with a name (empty until the owner adds verified ones)", () => {
  assert.ok(Array.isArray(organizations));
  for (const org of organizations) {
    assert.ok(typeof org.name === "string" && org.name.trim(), "every organization needs a real name");
    if (org.websiteUrl) assert.match(org.websiteUrl, /^https?:\/\//);
    if (org.logo) assert.match(org.logo, /^\/brand\//);
  }
});
