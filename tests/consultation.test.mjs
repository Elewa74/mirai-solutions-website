import test from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppMessage, validateConsultation, whatsappHref } from "../lib/consultation.mjs";
import { buildConsultationEmail } from "../lib/consultation-email.mjs";

const valid = {
  name: "Mona Ali",
  company: "Nile Works",
  email: "mona@example.com",
  whatsapp: "+201001234567",
  businessType: "Manufacturing / Industrial",
  interest: "Websites & Digital Presence",
  website: "example.com",
  message: "We need a bilingual website that helps buyers request quotations."
};

test("accepts a valid request, normalises the optional website and trims fields", () => {
  const r = validateConsultation({ ...valid, name: "  Mona   Ali " });
  assert.equal(r.ok, true);
  assert.equal(r.data.name, "Mona Ali");
  assert.equal(r.data.website, "https://example.com/");
  assert.equal(validateConsultation({ ...valid, website: "" }).ok, true);
});

test("rejects missing required fields and malformed email / WhatsApp / URL with stable error codes", () => {
  const r = validateConsultation({ ...valid, email: "bad", whatsapp: "12", website: "not a url", message: "" });
  assert.equal(r.ok, false);
  assert.equal(r.errors.email, "email");
  assert.equal(r.errors.whatsapp, "whatsapp");
  assert.equal(r.errors.website, "url");
  assert.equal(r.errors.message, "required");
  const empty = validateConsultation({});
  assert.deepEqual(Object.keys(empty.errors), ["name", "company", "email", "whatsapp", "businessType", "interest", "message"]);
});

test("builds a professional pre-filled WhatsApp message in both languages and a wa.me link only when a number exists", () => {
  const en = buildWhatsAppMessage(valid, "en");
  const ar = buildWhatsAppMessage(valid, "ar");
  assert.match(en, /Hello Mirai, I'd like a free consultation\./);
  assert.match(en, /Company: Nile Works/);
  assert.match(en, /Interested in: Websites & Digital Presence/);
  assert.match(en, /What I need: We need a bilingual website/);
  assert.match(ar, /مرحبًا Mirai/);
  assert.match(ar, /الشركة: Nile Works/);
  assert.doesNotMatch(en, /audit|scan/i);
  assert.equal(whatsappHref(valid, "en", ""), null);
  const href = whatsappHref(valid, "en", "+20 (10) 0000-0000");
  assert.match(href, /^https:\/\/wa\.me\/201000000000\?text=/);
  assert.match(decodeURIComponent(href), /Nile Works/);
});

test("builds the internal notification email without HTML injection", () => {
  const message = buildConsultationEmail({ ...valid, company: "<script>Nile</script>" }, "ar");
  assert.match(message.subject, /New consultation request — Mona Ali/);
  assert.match(message.text, /Language: Arabic/);
  assert.doesNotMatch(message.html, /<script>/);
  assert.match(message.html, /&lt;script&gt;Nile&lt;\/script&gt;/);
});
