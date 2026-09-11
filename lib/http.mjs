import { localeFromPath, localizePath } from "./i18n.mjs";
import { renderPage } from "./render.mjs";
import { validateConsultation, whatsappHref } from "./consultation.mjs";
import { buildConsultationEmail } from "./consultation-email.mjs";

/** The public information architecture: four pages per locale. */
export const PUBLIC_ROUTES = ["/", "/solutions", "/who-we-help", "/about"];
const validLogicalRoutes = new Set(PUBLIC_ROUTES);

/**
 * Legacy URLs kept alive as redirects (nothing links to them any more).
 *   /work → home #clients · /audit → home with the consultation modal open · sector pages → who-we-help
 */
export const LEGACY_REDIRECTS = {
  "/work": { to: "/", hash: "#clients" },
  "/audit": { to: "/", query: "?consult=1" },
  "/manufacturing": { to: "/who-we-help" },
  "/retail": { to: "/who-we-help" },
  "/ngo": { to: "/who-we-help" }
};

export function logicalPath(pathname) {
  if (pathname === "/ar") return "/";
  return pathname.replace(/^\/ar(?=\/)/, "") || "/";
}

/** Resolves a legacy logical path to its localized destination, or null. */
export function legacyRedirect(pathname) {
  const locale = localeFromPath(pathname);
  const rule = LEGACY_REDIRECTS[logicalPath(pathname)];
  if (!rule) return null;
  return `${localizePath(rule.to, locale)}${rule.query || ""}${rule.hash || ""}`;
}

export function renderRequest(pathname) {
  const locale = localeFromPath(pathname);
  const redirect = legacyRedirect(pathname);
  if (redirect) return { status: 301, location: redirect, body: renderPage("/redirect", locale, { redirectTo: redirect }), contentType: "text/html; charset=utf-8" };
  const logical = logicalPath(pathname);
  const status = validLogicalRoutes.has(logical) ? 200 : 404;
  return { status, body: renderPage(status === 200 ? pathname : "/not-found", locale), contentType: "text/html; charset=utf-8" };
}

async function sendWithResend(lead, locale, env, fetchFn) {
  if (!env.RESEND_API_KEY || !env.MIRAI_LEAD_EMAIL) return { configured: false, sent: false };
  const email = buildConsultationEmail(lead, locale);
  const response = await fetchFn("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
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

/**
 * POST /api/consultation — validates server-side, emails the request through Resend when configured,
 * and always returns a WhatsApp hand-off link when MIRAI_WHATSAPP is set. Never reports an email as sent when it wasn't.
 */
export async function handleConsultation(input, env = process.env, fetchFn = fetch) {
  const locale = input?.locale === "ar" ? "ar" : "en";
  // Honeypot filled → a bot; answer like a success but send nothing
  if (typeof input?._honey === "string" && input._honey.trim()) return { status: 200, body: { ok: true, emailSent: true, emailConfigured: true, spam: true } };
  const validation = validateConsultation(input);
  if (!validation.ok) return { status: 400, body: { ok: false, errors: validation.errors } };

  const lead = validation.data;
  const whatsapp = whatsappHref(lead, locale, env.MIRAI_WHATSAPP);
  try {
    const email = await sendWithResend(lead, locale, env, fetchFn);
    return { status: 200, body: { ok: true, emailSent: email.sent, emailConfigured: email.configured, whatsappHref: whatsapp } };
  } catch (error) {
    console.error("Consultation email dispatch failed:", error instanceof Error ? error.message : "unknown error");
    return { status: 502, body: { ok: false, error: "email_failed", whatsappHref: whatsapp } };
  }
}
