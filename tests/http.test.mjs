import test from "node:test";
import assert from "node:assert/strict";
import { handleConsultation, legacyRedirect, PUBLIC_ROUTES, renderRequest } from "../lib/http.mjs";

const lead = {
  name: "Mona Ali", company: "Nile Works", email: "mona@example.com", whatsapp: "+201001234567",
  businessType: "Manufacturing / Industrial", interest: "Websites & Digital Presence", website: "", message: "Bilingual website with RFQ journey.", locale: "en"
};

test("public IA is exactly four logical pages, served for English and Arabic", () => {
  assert.deepEqual(PUBLIC_ROUTES, ["/", "/solutions", "/who-we-help", "/about"]);
  for (const r of PUBLIC_ROUTES) {
    assert.equal(renderRequest(r).status, 200, r);
    assert.equal(renderRequest(r === "/" ? "/ar" : `/ar${r}`).status, 200, `/ar${r}`);
  }
  assert.match(renderRequest("/about").body, /About Mirai Solutions/);
  assert.match(renderRequest("/ar/about").body, /عن Mirai/);
  assert.equal(renderRequest("/nope").status, 404);
  assert.match(renderRequest("/nope").body, /noindex/);
});

test("legacy routes redirect: work → #clients, audit → ?consult=1, sector pages → who-we-help (both locales)", () => {
  assert.equal(legacyRedirect("/work"), "/#clients");
  assert.equal(legacyRedirect("/ar/work"), "/ar#clients");
  assert.equal(legacyRedirect("/audit"), "/?consult=1");
  assert.equal(legacyRedirect("/ar/audit"), "/ar?consult=1");
  for (const p of ["/manufacturing", "/retail", "/ngo"]) {
    assert.equal(legacyRedirect(p), "/who-we-help");
    assert.equal(legacyRedirect(`/ar${p}`), "/ar/who-we-help");
  }
  assert.equal(legacyRedirect("/about"), null);
  const r = renderRequest("/ar/retail");
  assert.equal(r.status, 301);
  assert.equal(r.location, "/ar/who-we-help");
  assert.match(r.body, /noindex/);
});

test("consultation: validation errors come back as 400 with field codes", async () => {
  const result = await handleConsultation({ ...lead, email: "bad", message: "" }, {}, fetch);
  assert.equal(result.status, 400);
  assert.equal(result.body.ok, false);
  assert.equal(result.body.errors.email, "email");
  assert.equal(result.body.errors.message, "required");
});

test("consultation: a filled honeypot is answered like a success but nothing is validated or sent", async () => {
  const result = await handleConsultation({ ...lead, _honey: "http://spam.example" }, { RESEND_API_KEY: "re_x", MIRAI_LEAD_EMAIL: "a@b.c" }, async () => { throw new Error("must not send"); });
  assert.equal(result.status, 200);
  assert.equal(result.body.spam, true);
  const clean = await handleConsultation({ ...lead, _honey: "" }, { MIRAI_WHATSAPP: "201000000000" }, async () => { throw new Error("no email configured"); });
  assert.equal(clean.body.spam, undefined);
});

test("consultation without email configuration never claims an email was sent, but still offers WhatsApp", async () => {
  const result = await handleConsultation(lead, { MIRAI_WHATSAPP: "201000000000" }, async () => { throw new Error("fetch should not run"); });
  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
  assert.equal(result.body.emailConfigured, false);
  assert.equal(result.body.emailSent, false);
  assert.match(result.body.whatsappHref, /^https:\/\/wa\.me\/201000000000\?text=/);
});

test("consultation with Resend configured sends to MIRAI_LEAD_EMAIL and reports success; failures degrade to WhatsApp", async () => {
  const calls = [];
  const okFetch = async (url, init) => { calls.push({ url, init }); return { ok: true, text: async () => "" }; };
  const result = await handleConsultation({ ...lead, locale: "ar" }, { RESEND_API_KEY: "re_test", MIRAI_LEAD_EMAIL: "hello@miraisolutions.net", MIRAI_FROM_EMAIL: "Mirai <hello@miraisolutions.net>", MIRAI_WHATSAPP: "201000000000" }, okFetch);
  assert.equal(result.status, 200);
  assert.equal(result.body.emailSent, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  const payload = JSON.parse(calls[0].init.body);
  assert.deepEqual(payload.to, ["hello@miraisolutions.net"]);
  assert.equal(payload.reply_to, "mona@example.com");
  assert.match(payload.subject, /consultation request/);
  assert.equal(calls[0].init.headers.authorization, "Bearer re_test");

  const badFetch = async () => ({ ok: false, status: 500, text: async () => "boom" });
  const failed = await handleConsultation(lead, { RESEND_API_KEY: "re_test", MIRAI_LEAD_EMAIL: "hello@miraisolutions.net", MIRAI_WHATSAPP: "201000000000" }, badFetch);
  assert.equal(failed.status, 502);
  assert.equal(failed.body.ok, false);
  assert.equal(failed.body.error, "email_failed");
  assert.match(failed.body.whatsappHref, /wa\.me/);
});
