import test from "node:test";
import assert from "node:assert/strict";
import { nextTheme, resolveTheme } from "../public/theme.mjs";

test("uses explicit stored theme before system preference", () => {
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
});

test("defaults to the light look regardless of the device setting until the visitor toggles", () => {
  assert.equal(resolveTheme(null, true), "light");
  assert.equal(resolveTheme(null, false), "light");
  assert.equal(resolveTheme(null, true, "light"), "light");
});

test("can follow the device setting when the site is configured for it", () => {
  assert.equal(resolveTheme(null, true, "system"), "dark");
  assert.equal(resolveTheme(null, false, "system"), "light");
  assert.equal(resolveTheme("dark", false, "system"), "dark");
});

test("toggles between light and dark", () => {
  assert.equal(nextTheme("light"), "dark");
  assert.equal(nextTheme("dark"), "light");
});
