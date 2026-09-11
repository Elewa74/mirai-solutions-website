import test from "node:test";
import assert from "node:assert/strict";
import { handleAuditSubmission, renderRequest } from "../lib/http.mjs";

const lead = {
  name: "Mona Ali",
  company: "Nile Works",
  website: "",
  businessType: "Manufacturing",
  improvementGoal: "Generate RFQs",
  email: "mona@example.com",
  whatsapp: "+201001234567",
  locale: "en"
};

test("renders recognized English and Arabic routes", () => {
  const en = renderRequest("/about");
  const ar = renderRequest("/ar/about");
  assert.equal(en.status, 200);
  assert.equal(ar.status, 200);
  assert.match(en.body, /About — Mirai Solutions/);
  assert.match(ar.body, /عن Mirai/);
});

test("returns a validated development-safe audit response without email credentials", async () => {
  const result = await handleAuditSubmission(lead, {}, async () => { throw new Error("fetch should not run"); });
  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
});

test("returns validation errors for bad audit data", async () => {
  const result = await handleAuditSubmission({ ...lead, email: "bad" }, {}, fetch);
  assert.equal(result.status, 400);
  assert.equal(result.body.ok, false);
  assert.ok(result.body.errors.email);
});
