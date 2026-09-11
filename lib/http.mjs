import { localeFromPath } from "./i18n.mjs";
import { renderPage } from "./render.mjs";
import { buildWhatsAppMessage, validateAuditLead } from "./audit.mjs";
import { buildLeadEmail } from "./audit-email.mjs";

const validLogicalRoutes = new Set(["/", "/solutions", "/who-we-help", "/manufacturing", "/retail", "/ngo", "/work", "/about", "/audit"]);

function logicalPath(pathname) {
  if (pathname === "/ar") return "/";
  return pathname.replace(/^\/ar(?=\/)/, "") || "/";
}

export function renderRequest(pathname) {
  const locale = localeFromPath(pathname);
  const logical = logicalPath(pathname);
  const status = validLogicalRoutes.has(logical) ? 200 : 404;
  return { status, body: renderPage(pathname, locale), contentType: "text/html; charset=utf-8" };
}

function whatsappHref(lead, locale, env) {
  const raw = env.MIRAI_WHATSAPP || env.NEXT_PUBLIC_MIRAI_WHATSAPP || "";
  const phone = raw.replace(/\D/g, "");
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsAppMessage(lead, locale))}`;
}

async function sendWithResend(lead, env, fetchFn) {
  if (!env.RESEND_API_KEY || !env.MIRAI_LEAD_EMAIL) return { configured: false, sent: false };
  const email = buildLeadEmail(lead);
  const response = await fetchFn("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: env.MIRAI_FROM_EMAIL || "Mirai Website <onboarding@resend.dev>",
      to: [env.MIRAI_LEAD_EMAIL],
      reply_to: lead.email,
      subject: email.subject,
      text: email.text,
      html: email.html
    })
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend request failed (${response.status}) ${detail.slice(0, 160)}`);
  }
  return { configured: true, sent: true };
}

export async function handleAuditSubmission(input, env = process.env, fetchFn = fetch) {
  const locale = input?.locale === "ar" ? "ar" : "en";
  const validation = validateAuditLead(input);
  if (!validation.ok) return { status: 400, body: { ok: false, errors: validation.errors } };

  const lead = validation.data;
  try {
    const email = await sendWithResend(lead, env, fetchFn);
    return {
      status: 200,
      body: {
        ok: true,
        emailSent: email.sent,
        emailConfigured: email.configured,
        whatsappHref: whatsappHref(lead, locale, env)
      }
    };
  } catch (error) {
    console.error("Audit email dispatch failed:", error instanceof Error ? error.message : "unknown error");
    return {
      status: 502,
      body: {
        ok: false,
        message: locale === "ar" ? "تم استلام البيانات لكن تعذر إرسال البريد الآن. حاول مرة أخرى." : "We received the form but couldn't send the email right now. Please try again.",
        whatsappHref: whatsappHref(lead, locale, env)
      }
    };
  }
}
