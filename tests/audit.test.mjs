import test from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppMessage, validateAuditLead } from "../lib/audit.mjs";

const validLead = {
  name: "Mona Ali",
  company: "Nile Works",
  website: "https://example.com",
  businessType: "Manufacturing",
  improvementGoal: "Generate more RFQs",
  email: "mona@example.com",
  whatsapp: "+201001234567"
};

test("accepts a valid lead and optional website", () => {
  assert.equal(validateAuditLead(validLead).ok, true);
  const withoutWebsite = { ...validLead, website: "" };
  assert.equal(validateAuditLead(withoutWebsite).ok, true);
});

test("rejects malformed required fields", () => {
  const result = validateAuditLead({ ...validLead, email: "bad", whatsapp: "" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.email);
  assert.ok(result.errors.whatsapp);
});

test("rejects an invalid website URL when present", () => {
  const result = validateAuditLead({ ...validLead, website: "not-a-url" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.website);
});

test("builds locale-aware WhatsApp follow-up messages", () => {
  const en = buildWhatsAppMessage(validLead, "en");
  const ar = buildWhatsAppMessage(validLead, "ar");
  assert.match(en, /Mona Ali/);
  assert.match(en, /Nile Works/);
  assert.match(ar, /Mona Ali/);
  assert.match(ar, /Nile Works/);
  assert.notEqual(en, ar);
});
