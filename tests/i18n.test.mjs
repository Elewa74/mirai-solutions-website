import test from "node:test";
import assert from "node:assert/strict";
import { localeFromPath, localizePath } from "../lib/i18n.mjs";

test("detects Arabic only under /ar", () => {
  assert.equal(localeFromPath("/ar/about"), "ar");
  assert.equal(localeFromPath("/about"), "en");
});

test("preserves the logical page when switching locale", () => {
  assert.equal(localizePath("/solutions", "ar"), "/ar/solutions");
  assert.equal(localizePath("/ar/solutions", "en"), "/solutions");
  assert.equal(localizePath("/ar", "en"), "/");
});
