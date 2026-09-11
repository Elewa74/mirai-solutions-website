/**
 * Mirai Lens — instant digital presence scan.
 * Pure Node: fetches a public URL and runs 10 business-first checks.
 * No external services. Every check returns { key, score(0..10), status, label, detail, advice } in AR + EN.
 */

const FETCH_TIMEOUT_MS = 9000;
const MAX_BYTES = 1_500_000;
const UA = "Mozilla/5.0 (compatible; MiraiLens/1.0; +https://miraisolutions.net/#lens)";

export function normalizeUrl(input) {
  let raw = String(input || "").trim();
  if (!raw) return null;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  let url;
  try { url = new URL(raw); } catch { return null; }
  if (!/^https?:$/.test(url.protocol)) return null;
  const host = url.hostname.toLowerCase();
  if (!host.includes(".") || host === "localhost" || /^(\d{1,3}\.){3}\d{1,3}$/.test(host) || host.endsWith(".local")) return null;
  url.hash = "";
  return url;
}

async function fetchHtml(url, fetchFn) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const started = Date.now();
  try {
    const res = await fetchFn(url, { redirect: "follow", signal: controller.signal, headers: { "user-agent": UA, accept: "text/html,*/*;q=0.8", "accept-language": "ar,en;q=0.8" } });
    const ttfb = Date.now() - started;
    const reader = res.body?.getReader?.();
    let html = "";
    let bytes = 0;
    if (reader) {
      const decoder = new TextDecoder("utf-8", { fatal: false });
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        html += decoder.decode(value, { stream: true });
        if (bytes > MAX_BYTES) { try { await reader.cancel(); } catch {} break; }
      }
    } else {
      html = await res.text();
      bytes = Buffer.byteLength(html);
    }
    return { ok: res.ok, status: res.status, finalUrl: res.url || url.href, html, bytes, ttfb, totalMs: Date.now() - started, contentType: res.headers.get("content-type") || "" };
  } finally {
    clearTimeout(timer);
  }
}

const rx = {
  title: /<title[^>]*>([\s\S]*?)<\/title>/i,
  metaDesc: /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i,
  metaDesc2: /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i,
  viewport: /<meta[^>]+name=["']viewport["']/i,
  lang: /<html[^>]*\slang=["']([a-zA-Z-]+)["']/i,
  dir: /<html[^>]*\sdir=["']rtl["']/i,
  hreflang: /<link[^>]+hreflang=["']([^"']+)["']/gi,
  h1: /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi,
  img: /<img\b[^>]*>/gi,
  alt: /\salt=["'][^"']*["']/i,
  jsonld: /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  og: /<meta[^>]+property=["']og:(title|description|image)["']/gi,
  favicon: /<link[^>]+rel=["'][^"']*icon[^"']*["']/i,
  whatsapp: /(wa\.me\/|api\.whatsapp\.com|whatsapp:\/\/)/i,
  tel: /href=["']tel:/i,
  mailto: /href=["']mailto:/i,
  form: /<form\b/i,
  ctaWords: /(contact|get a quote|request a quote|rfq|quotation|book|order|buy now|donate|partner|get started|talk to|اتصل|تواصل|اطلب|عرض سعر|احجز|اشتري|تبرع|شراكة|ابدأ)/i,
  scripts: /<script\b/gi,
  arabic: /[؀-ۿ]/g,
  text: /<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g,
  canonical: /<link[^>]+rel=["']canonical["']/i,
  generator: /<meta[^>]+name=["']generator["'][^>]*content=["']([^"']*)["']/i,
  wpbakery: /(elementor|wp-content|wpbakery|divi)/i
};

function strip(s = "") { return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); }

const t = (ar, en) => ({ ar, en });

export function analyzeHtml(page, url) {
  const html = page.html || "";
  const text = html.replace(rx.text, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  const arabicChars = (text.match(rx.arabic) || []).length;
  const arabicRatio = text.length ? arabicChars / text.length : 0;
  const title = strip((html.match(rx.title) || [])[1] || "");
  const desc = strip(((html.match(rx.metaDesc) || html.match(rx.metaDesc2) || [])[1]) || "");
  const h1s = [...html.matchAll(rx.h1)].map((m) => strip(m[1])).filter(Boolean);
  const imgs = html.match(rx.img) || [];
  const imgsNoAlt = imgs.filter((i) => !rx.alt.test(i)).length;
  const hreflangs = [...html.matchAll(rx.hreflang)].map((m) => m[1].toLowerCase());
  const lang = ((html.match(rx.lang) || [])[1] || "").toLowerCase();
  const rtl = rx.dir.test(html);
  const hasJsonLd = rx.jsonld.test(html); rx.jsonld.lastIndex = 0;
  const ogCount = new Set([...html.matchAll(rx.og)].map((m) => m[1].toLowerCase())).size;
  const https = /^https:/.test(page.finalUrl || url.href);
  const scripts = (html.match(rx.scripts) || []).length;
  const generator = ((html.match(rx.generator) || [])[1] || "");
  const builder = generator || (rx.wpbakery.test(html) ? "WordPress" : "");
  const hasWhatsApp = rx.whatsapp.test(html);
  const hasTel = rx.tel.test(html);
  const hasMail = rx.mailto.test(html);
  const hasForm = rx.form.test(html);
  const ctaHits = (html.match(new RegExp(rx.ctaWords.source, "gi")) || []).length;

  const checks = [];
  const add = (key, score, label, detail, advice) => checks.push({ key, score: Math.max(0, Math.min(10, Math.round(score))), status: score >= 8 ? "good" : score >= 5 ? "warn" : "bad", label, detail, advice });

  // 1. Clarity: title + h1 + description
  {
    let s = 0;
    const genericTitle = /^(home|homepage|welcome|index|untitled)\b/i.test(title) || title.split(/\s+/).length < 3;
    if (title && !genericTitle && title.length >= 20 && title.length <= 75) s += 4; else if (title) s += 1;
    if (h1s.length === 1) s += 3; else if (h1s.length > 1) s += 1;
    if (desc && desc.length >= 60 && desc.length <= 170) s += 3; else if (desc) s += 1;
    add("clarity", s, t("وضوح الرسالة", "Message clarity"),
      t(`العنوان: ${title ? `«${title.slice(0, 80)}»` : "غير موجود"} · H1: ${h1s.length} · الوصف: ${desc ? `${desc.length} حرف` : "غير موجود"}`,
        `Title: ${title ? `“${title.slice(0, 80)}”` : "missing"} · H1 count: ${h1s.length} · Meta description: ${desc ? `${desc.length} chars` : "missing"}`),
      t("عنوان واحد واضح يقول ماذا تقدّم ولمن، وH1 واحد، ووصف 120–160 حرفًا يشرح القيمة.", "One clear title that says what you do and for whom, a single H1, and a 120–160 character description of the value."));
  }
  // 2. Call to action
  {
    let s = 0;
    if (ctaHits >= 3) s += 5; else if (ctaHits >= 1) s += 3;
    if (hasForm) s += 2;
    if (hasWhatsApp || hasTel) s += 3; else if (hasMail) s += 1;
    add("cta", s, t("دعوة التحرّك (الخطوة التالية)", "Next step (calls to action)"),
      t(`إشارات دعوة التحرّك: ${ctaHits} · نموذج: ${hasForm ? "نعم" : "لا"} · واتساب: ${hasWhatsApp ? "نعم" : "لا"} · هاتف: ${hasTel ? "نعم" : "لا"}`,
        `CTA signals: ${ctaHits} · Form: ${hasForm ? "yes" : "no"} · WhatsApp: ${hasWhatsApp ? "yes" : "no"} · Phone link: ${hasTel ? "yes" : "no"}`),
      t("زرّ أساسي واحد فوق الطية يطابق ما يريده الزائر فعليًا (عرض سعر، طلب، شراكة) وقناة تواصل بضغطة واحدة.", "One primary button above the fold matching what the visitor actually wants (quote, order, partnership) plus a one-tap contact channel."));
  }
  // 3. Mobile readiness
  {
    const vp = rx.viewport.test(html);
    let s = vp ? 7 : 1;
    if (vp && page.bytes < 600_000) s += 3; else if (vp && page.bytes < 1_200_000) s += 1;
    add("mobile", s, t("جاهزية الموبايل", "Mobile readiness"),
      t(`viewport: ${vp ? "موجود" : "غير موجود"} · حجم HTML: ${(page.bytes / 1024).toFixed(0)} KB`, `viewport meta: ${vp ? "present" : "missing"} · HTML size: ${(page.bytes / 1024).toFixed(0)} KB`),
      t("أغلب زوار الشركات المصرية من الموبايل؛ تأكد من viewport وصفحة خفيفة تُفتح بسرعة على شبكة متوسطة.", "Most visitors arrive on mobile; ensure a viewport meta and a light page that opens fast on an average network."));
  }
  // 4. Speed
  {
    let s = 10;
    if (page.ttfb > 800) s -= 3; else if (page.ttfb > 400) s -= 1;
    if (page.totalMs > 3000) s -= 3; else if (page.totalMs > 1500) s -= 1;
    if (scripts > 25) s -= 3; else if (scripts > 12) s -= 1;
    add("speed", s, t("السرعة", "Speed"),
      t(`أول استجابة: ${page.ttfb} ms · تحميل HTML: ${page.totalMs} ms · سكربتات: ${scripts}`, `First byte: ${page.ttfb} ms · HTML load: ${page.totalMs} ms · Scripts: ${scripts}`),
      t("كل ثانية تأخير تفقدك جزءًا من الزوار قبل أن يقرؤوا رسالتك؛ قلّل السكربتات واضغط الصور.", "Every second of delay loses visitors before they read your message; trim scripts and compress images."));
  }
  // 5. Security
  add("security", https ? 10 : 2, t("الأمان (HTTPS)", "Security (HTTPS)"),
    t(https ? "الموقع يعمل عبر HTTPS." : "الموقع لا يفرض HTTPS.", https ? "Served over HTTPS." : "Not served over HTTPS."),
    t("القفل في المتصفح جزء من الثقة؛ HTTPS إلزامي لأي عمل جاد.", "The browser padlock is part of trust; HTTPS is mandatory for any serious business."));
  // 6. Bilingual / Arabic
  {
    const hasAr = arabicRatio > 0.15 || lang.startsWith("ar") || hreflangs.some((h) => h.startsWith("ar"));
    const hasEn = arabicRatio < 0.85 || hreflangs.some((h) => h.startsWith("en"));
    const alt = hreflangs.length >= 2;
    let s = 0;
    if (hasAr && hasEn) s += 6; else if (hasAr || hasEn) s += 3;
    if (alt) s += 3;
    if (lang) s += 1;
    add("language", s, t("العربية والإنجليزية", "Arabic & English"),
      t(`نسبة العربية: ${(arabicRatio * 100).toFixed(0)}% · lang: ${lang || "غير محدد"} · hreflang: ${hreflangs.length ? hreflangs.join(", ") : "لا"} · RTL: ${rtl ? "نعم" : "لا"}`,
        `Arabic ratio: ${(arabicRatio * 100).toFixed(0)}% · lang: ${lang || "unset"} · hreflang: ${hreflangs.length ? hreflangs.join(", ") : "none"} · RTL: ${rtl ? "yes" : "no"}`),
      t("جمهورك المحلي يقرأ بالعربية والمشترون الدوليون بالإنجليزية؛ نسختان مصممتان (لا ترجمة حرفية) مع hreflang.", "Local audiences read Arabic and international buyers read English; two designed versions (not literal translation) linked with hreflang."));
  }
  // 7. Search & AI visibility
  {
    let s = 0;
    if (hasJsonLd) s += 4;
    if (ogCount >= 2) s += 3; else if (ogCount) s += 1;
    if (rx.canonical.test(html)) s += 2;
    if (desc) s += 1;
    add("search", s, t("الظهور في البحث والـ AI", "Search & AI visibility"),
      t(`بيانات مهيكلة (schema): ${hasJsonLd ? "نعم" : "لا"} · Open Graph: ${ogCount}/3 · canonical: ${rx.canonical.test(html) ? "نعم" : "لا"}`,
        `Structured data (schema): ${hasJsonLd ? "yes" : "no"} · Open Graph: ${ogCount}/3 · canonical: ${rx.canonical.test(html) ? "yes" : "no"}`),
      t("محركات البحث ومساعدو الـ AI يقرؤون البيانات المهيكلة أولًا؛ Organization + Service + FAQ schema تجعل شركتك قابلة للاقتباس.", "Search engines and AI assistants read structured data first; Organization + Service + FAQ schema make your business quotable."));
  }
  // 8. Content depth
  {
    let s = 0;
    if (words >= 600) s = 9; else if (words >= 300) s = 7; else if (words >= 120) s = 4; else s = 1;
    add("content", s, t("عمق المحتوى", "Content depth"),
      t(`${words} كلمة على الصفحة الرئيسية.`, `${words} words on the home page.`),
      t("الزائر يحتاج أن يفهم ما تقدّمه، لمن، وكيف يبدأ — قبل أن يتصل. 300–700 كلمة مُهيكلة تكفي عادةً.", "Visitors need to understand what you offer, for whom, and how to start — before they call. 300–700 structured words usually suffice."));
  }
  // 9. Visual trust
  {
    let s = 5;
    if (imgs.length >= 3) s += 2;
    if (imgs.length && imgsNoAlt / imgs.length < 0.3) s += 2; else if (imgs.length) s -= 1;
    if (rx.favicon.test(html)) s += 1;
    add("visual", s, t("الثقة البصرية", "Visual trust"),
      t(`صور: ${imgs.length} · بدون alt: ${imgsNoAlt} · favicon: ${rx.favicon.test(html) ? "نعم" : "لا"}${builder ? ` · مبني بـ ${builder.split(" ")[0]}` : ""}`,
        `Images: ${imgs.length} · missing alt: ${imgsNoAlt} · favicon: ${rx.favicon.test(html) ? "yes" : "no"}${builder ? ` · built with ${builder.split(" ")[0]}` : ""}`),
      t("صور حقيقية لمنشأتك وفريقك ومنتجاتك تبني ثقة أكثر من أي صورة ستوك، مع نص بديل يخدم الوصول والبحث.", "Real photos of your facility, team and products build more trust than stock imagery; alt text serves accessibility and search."));
  }
  // 10. Business fit (heuristic: segment-specific words)
  {
    const fit = /(certif|iso|capacity|export|catalog|rfq|branch|فرع|فروع|delivery|توصيل|menu|program|برامج|impact|أثر|report|تقرير|partner|شريك|donat|تبرع|شهاد|تصدير|كتالوج)/gi;
    const hits = (html.match(fit) || []).length;
    const s = hits >= 6 ? 9 : hits >= 3 ? 6 : hits >= 1 ? 4 : 2;
    add("fit", s, t("ملاءمة نموذج العمل", "Business-model fit"),
      t(`إشارات خاصة بنموذج العمل (شهادات، فروع، برامج، تصدير…): ${hits}`, `Business-model signals (certifications, branches, programs, export…): ${hits}`),
      t("المصنع يحتاج شهادات وقدرات وطلب عرض سعر؛ السلسلة تحتاج فروعًا وطلبًا؛ المنظمة تحتاج برامجًا وأثرًا وشراكة. الموقع يجب أن يعكس نموذجك لا قالبًا عامًا.", "A factory needs certifications, capabilities and RFQ; a chain needs branches and ordering; an NGO needs programs, impact and partnership. The site should reflect your model, not a generic template."));
  }

  const total = Math.round(checks.reduce((a, c) => a + c.score, 0) / checks.length * 10);
  const grade = total >= 85 ? t("قوي", "Strong") : total >= 60 ? t("جيد مع فرص واضحة", "Good, with clear gaps") : total >= 40 ? t("أضعف مما يجب", "Weaker than it should be") : t("يحتاج إعادة بناء", "Needs a rebuild");
  const weakest = [...checks].sort((a, b) => a.score - b.score).slice(0, 3).map((c) => c.key);
  return {
    url: page.finalUrl || url.href, host: url.hostname, title, total, grade, weakest, checks,
    meta: { words, arabicRatio: Number(arabicRatio.toFixed(2)), bytes: page.bytes, ttfb: page.ttfb, totalMs: page.totalMs, builder: builder.split(" ")[0] || null, status: page.status }
  };
}

const recent = new Map();
export function rateLimited(ip, limit = 12, windowMs = 60_000) {
  const now = Date.now();
  const list = (recent.get(ip) || []).filter((ts) => now - ts < windowMs);
  list.push(now);
  recent.set(ip, list);
  return list.length > limit;
}

export async function scanUrl(input, fetchFn = fetch) {
  const url = normalizeUrl(input);
  if (!url) return { ok: false, error: "invalid_url" };
  try {
    const page = await fetchHtml(url, fetchFn);
    if (!page.contentType.includes("html") && !/<html/i.test(page.html)) return { ok: false, error: "not_html" };
    if (!page.ok && !page.html) return { ok: false, error: "unreachable", status: page.status };
    return { ok: true, report: analyzeHtml(page, url) };
  } catch (error) {
    return { ok: false, error: error?.name === "AbortError" ? "timeout" : "unreachable" };
  }
}
