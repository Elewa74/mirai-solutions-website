import { siteContent } from "../content/site-content.mjs";

const MAX = 600;
const MAX_MESSAGE = 2000;

function clean(value, max = MAX) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

export const CONSULTATION_FIELDS = ["name", "company", "email", "whatsapp", "businessType", "interest", "website", "message"];
const REQUIRED = ["name", "company", "email", "whatsapp", "businessType", "interest", "message"];

/**
 * Validates a consultation request. Returns { ok: true, data } or { ok: false, errors: { field: code } }.
 * Error codes: "required" | "email" | "url" | "whatsapp" — the client maps them to localized copy.
 */
export function validateConsultation(input) {
  const source = input && typeof input === "object" ? input : {};
  const data = {
    name: clean(source.name),
    company: clean(source.company),
    email: clean(source.email),
    whatsapp: clean(source.whatsapp),
    businessType: clean(source.businessType),
    interest: clean(source.interest),
    website: clean(source.website),
    message: typeof source.message === "string" ? source.message.trim().slice(0, MAX_MESSAGE) : ""
  };
  const errors = {};
  for (const key of REQUIRED) if (!data[key]) errors[key] = "required";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "email";
  if (data.whatsapp && !/^\+?[0-9\s()-]{8,25}$/.test(data.whatsapp)) errors.whatsapp = "whatsapp";
  if (data.website) {
    const candidate = /^https?:\/\//i.test(data.website) ? data.website : `https://${data.website}`;
    try {
      const url = new URL(candidate);
      if (!/^https?:$/.test(url.protocol) || !url.hostname.includes(".")) errors.website = "url";
      else data.website = url.href;
    } catch {
      errors.website = "url";
    }
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

/** Professional pre-filled WhatsApp message with the submitted details (used by the static site and as a follow-up on the server). */
export function buildWhatsAppMessage(lead, locale = "en") {
  const c = siteContent[locale === "ar" ? "ar" : "en"].consult.whatsappMessage;
  const line = (key, value) => (value ? `${c.labels[key]}: ${value}` : null);
  return [
    c.greeting,
    "",
    line("name", lead.name),
    line("company", lead.company),
    line("businessType", lead.businessType),
    line("interest", lead.interest),
    line("website", lead.website),
    line("email", lead.email),
    line("whatsapp", lead.whatsapp),
    "",
    line("message", lead.message)
  ].filter((l) => l !== null).join("\n");
}

export function normalizeWhatsAppNumber(raw = "") {
  return String(raw || "").replace(/\D/g, "");
}

export function whatsappHref(lead, locale, number) {
  const phone = normalizeWhatsAppNumber(number);
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsAppMessage(lead, locale))}`;
}
