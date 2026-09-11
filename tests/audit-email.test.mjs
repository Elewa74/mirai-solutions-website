import test from "node:test";
import assert from "node:assert/strict";
import { buildLeadEmail } from "../lib/audit-email.mjs";

const lead = {
  name: "Mona Ali",
  company: "Nile Works",
  website: "https://example.com",
  businessType: "Manufacturing",
  improvementGoal: "Generate more RFQs",
  email: "mona@example.com",
  whatsapp: "+201001234567"
};

test("builds a useful lead email without HTML injection", () => {
  const message = buildLeadEmail({ ...lead, company: "<script>Nile</script>" });
  assert.match(message.subject, /Mona Ali/);
  assert.match(message.text, /Generate more RFQs/);
  assert.doesNotMatch(message.html, /<script>/);
  assert.match(message.html, /&lt;script&gt;Nile&lt;\/script&gt;/);
});
