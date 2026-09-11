import test from "node:test";
import assert from "node:assert/strict";
import { siteContent } from "../content/site-content.mjs";

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]));
  }
  return typeof value;
}

test("English and Arabic content dictionaries have matching shapes", () => {
  assert.deepEqual(shape(siteContent.en), shape(siteContent.ar));
});

test("homepage keeps the approved hero and audiences", () => {
  assert.equal(siteContent.en.home.hero.title, "Websites built around what your business needs to achieve.");
  assert.equal(siteContent.en.home.audiences.items.length, 4);
  assert.match(siteContent.en.home.audiences.items[0].title, /SMEs/i);
  assert.match(siteContent.en.home.audiences.items[1].title, /Manufacturing/i);
  assert.match(siteContent.en.home.audiences.items[2].title, /Retail/i);
  assert.match(siteContent.en.home.audiences.items[3].title, /NGOs/i);
});

test("navigation exposes only the approved V1 pages", () => {
  assert.deepEqual(siteContent.en.nav.items.map((item) => item.href), [
    "/solutions",
    "/who-we-help",
    "/work",
    "/about"
  ]);
  assert.equal(siteContent.en.nav.audit.href, "/audit");
});
