import { siteContent } from "../content/site-content.mjs";
import { localizePath } from "./i18n.mjs";
import { segmentBySlug, segments } from "../content/segments.mjs";

const ASSET_VERSION = process.env.NODE_ENV === "production" ? "2026-09-11d" : String(Date.now());
// Theme policy: "light" (default — the light look for everyone until they toggle) or "system" (follow the device).
// Override at deploy time with MIRAI_THEME=system.
const THEME_MODE = process.env.MIRAI_THEME === "system" ? "system" : "light";

/* ---------- photography (AI-generated, optimised in /public/images) ---------- */
const imageMeta = {
  team: { w: 1600, h: 893 },
  manufacturing: { w: 1600, h: 1073 },
  retail: { w: 1600, h: 1073 },
  ngo: { w: 1600, h: 1073 },
  about: { w: 1600, h: 1195 },
  work: { w: 1600, h: 893 },
  audit: { w: 1600, h: 1073 },
  glass: { w: 1600, h: 679 }
};
const imageAlt = {
  en: {
    team: "The Mirai team reviewing website wireframes around a table, with the Nile and Cairo skyline in the window behind them.",
    manufacturing: "A production engineer checking machined parts on a tablet inside a CNC workshop.",
    retail: "A barista handing a coffee to a customer at the counter of a bright neighbourhood café.",
    ngo: "A facilitator leading a community workshop in front of a whiteboard while participants listen.",
    about: "Two colleagues discussing a website layout displayed on a large wall screen in a sunlit office.",
    work: "A laptop showing analytics dashboards next to printed brand booklets and a notebook.",
    audit: "A person reviewing a website on a laptop and phone beside a hand-written checklist.",
    glass: ""
  },
  ar: {
    team: "فريق Mirai يراجع مخططات موقع حول طاولة عمل، وخلفهم نافذة تطل على النيل والقاهرة.",
    manufacturing: "مهندسة إنتاج تراجع قطعًا مصنّعة على جهاز لوحي داخل ورشة تشغيل آلي.",
    retail: "باريستا يسلّم كوب قهوة لعميلة عند طاولة مقهى مضيء في أحد الأحياء.",
    ngo: "مدرّبة تقود ورشة عمل مجتمعية أمام لوح أبيض بينما يستمع المشاركون.",
    about: "زميلان يناقشان تصميم موقع معروضًا على شاشة حائطية كبيرة في مكتب مضيء.",
    work: "حاسوب محمول يعرض لوحات تحليل بجوار كتيّبات هوية مطبوعة ودفتر ملاحظات.",
    audit: "شخص يراجع موقعًا على حاسوب محمول وهاتف بجانب قائمة تحقق مكتوبة بخط اليد.",
    glass: ""
  }
};
function picture(name, locale, { cls = "", sizes = "(max-width: 820px) 100vw, 50vw", eager = false, decorative = false } = {}) {
  const m = imageMeta[name];
  const alt = decorative ? "" : imageAlt[locale]?.[name] ?? imageAlt.en[name] ?? "";
  const v = `?v=${ASSET_VERSION}`;
  return `<picture class="photo ${cls}">
    <source type="image/webp" srcset="/images/${name}-800.webp${v} 800w, /images/${name}-1600.webp${v} 1600w" sizes="${e(sizes)}">
    <img src="/images/${name}-1200.jpg${v}" alt="${e(alt)}" width="${m.w}" height="${m.h}" loading="${eager ? "eager" : "lazy"}" decoding="async"${eager ? ' fetchpriority="high"' : ""}${decorative ? ' aria-hidden="true"' : ""}>
  </picture>`;
}
function thumb(name, locale) {
  return `<img class="thumb" src="/images/${name}-thumb.webp?v=${ASSET_VERSION}" alt="${e(imageAlt[locale]?.[name] ?? "")}" width="400" height="300" loading="lazy" decoding="async">`;
}
const audienceThumbs = ["team", "manufacturing", "retail", "ngo"];

const pageTitles = {
  "/": { en: "Mirai Solutions — Business-first websites & digital presence", ar: "Mirai Solutions — مواقع وحضور رقمي يُبنى حول أهداف عملك" },
  "/solutions": { en: "Solutions — Mirai Solutions", ar: "الحلول — Mirai Solutions" },
  "/who-we-help": { en: "Who We Help — Mirai Solutions", ar: "من نخدم — Mirai Solutions" },
  "/work": { en: "Work — Mirai Solutions", ar: "أعمالنا — Mirai Solutions" },
  "/about": { en: "About — Mirai Solutions", ar: "عن Mirai — Mirai Solutions" },
  "/audit": { en: "Free Digital Presence Audit — Mirai Solutions", ar: "مراجعة مجانية لحضورك الرقمي — Mirai Solutions" },
  "/manufacturing": { en: "Websites for Manufacturers & Industrial Firms — Mirai Solutions", ar: "مواقع للمصانع والشركات الصناعية — Mirai Solutions" },
  "/retail": { en: "Websites for Retail Brands & Local Chains — Mirai Solutions", ar: "مواقع لبراندات التجزئة والسلاسل المحلية — Mirai Solutions" },
  "/ngo": { en: "Websites for NGOs & Organizations — Mirai Solutions", ar: "مواقع للمنظمات والمؤسسات — Mirai Solutions" }
};
const segmentForAudience = ["/who-we-help", "/manufacturing", "/retail", "/ngo"];

const pageDescriptions = {
  "/": {
    en: "Business-first websites for manufacturers, retail chains and organizations — strategy, content, design and development by one team, in Arabic and English.",
    ar: "تبني Mirai Solutions مواقع تنطلق من هدف العمل للمصانع وسلاسل المتاجر والمنظمات — استراتيجية ومحتوى وتصميم وتطوير بفريق واحد، بالعربية والإنجليزية."
  },
  "/solutions": {
    en: "One connected process from business goal to finished website: understand, structure, create and launch — with content, bilingual copy and handover included.",
    ar: "مسار واحد مترابط من هدف العمل إلى موقع جاهز: نفهم، نهيكل، نبني، ونُطلق — مع المحتوى والنصوص ثنائية اللغة والتسليم الكامل."
  },
  "/who-we-help": {
    en: "Websites for SMEs, manufacturers, retail chains and NGOs — each built around how that business actually wins customers, buyers or partners.",
    ar: "مواقع للشركات الصغيرة والمتوسطة والمصانع وسلاسل المتاجر والمنظمات — كل موقع يُبنى حول الطريقة التي يكسب بها هذا العمل عملاءه أو مشتريه أو شركاءه."
  },
  "/manufacturing": {
    en: "B2B websites for factories and industrial companies: capabilities, certifications, catalogs and RFQ forms structured around how procurement teams buy.",
    ar: "مواقع للمصانع والشركات الصناعية: القدرات والشهادات والكتالوجات ونماذج طلب عروض الأسعار مرتّبة حول طريقة شراء فرق المشتريات."
  },
  "/retail": {
    en: "Mobile-first websites for stores, showrooms, cafés and local chains: branches with maps, products, offers and one-tap WhatsApp ordering.",
    ar: "مواقع تبدأ من الهاتف للمتاجر والمعارض والمقاهي والسلاسل المحلية: الفروع بالخرائط، المنتجات، العروض، والطلب عبر واتساب بضغطة واحدة."
  },
  "/ngo": {
    en: "Websites for NGOs, foundations and organizations that turn programs, reports and impact into one clear bilingual experience partners trust.",
    ar: "مواقع للمنظمات والمؤسسات تحوّل البرامج والتقارير والأثر إلى تجربة واحدة واضحة ثنائية اللغة يثق بها الشركاء."
  },
  "/work": {
    en: "Selected Mirai work explained through the business problem, the role we played and the transformation — not just screenshots.",
    ar: "أعمال مختارة من Mirai مشروحة من خلال مشكلة العمل ودورنا والتحوّل الذي حدث — لا لقطات شاشة فقط."
  },
  "/about": {
    en: "Mirai Solutions: 12+ years of business, product and digital experience turned into a faster, clearer way to build websites that work for the business.",
    ar: "Mirai Solutions: أكثر من اثني عشر عامًا من الخبرة في الأعمال والمنتجات الرقمية تحوّلت إلى طريقة أسرع وأوضح لبناء مواقع تعمل لصالح العمل."
  },
  "/audit": {
    en: "Request a free digital presence audit: a practical review of clarity, trust, content, mobile experience and calls to action — with a recommended next step.",
    ar: "اطلب مراجعة مجانية لحضورك الرقمي: مراجعة عملية للوضوح والثقة والمحتوى وتجربة الهاتف ودعوات التحرّك — مع الخطوة التالية التي نوصي بها."
  }
};

function e(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function logicalPath(pathname) {
  if (pathname === "/ar") return "/";
  return pathname.replace(/^\/ar(?=\/)/, "") || "/";
}

function href(path, locale) {
  return e(localizePath(path, locale));
}

function arrow(locale) {
  return locale === "ar" ? "←" : "→";
}

function logo(locale = "en") {
  const homeHref = locale === "ar" ? "/ar" : "/";
  return `<a class="brand" href="${homeHref}" aria-label="Mirai Solutions home">
    <picture class="brand-logo-light"><source srcset="/brand/mirai-logo-light.webp?v=${ASSET_VERSION}" type="image/webp"><img class="brand-logo" src="/brand/mirai-logo-light.png?v=${ASSET_VERSION}" alt="Mirai Solutions" width="640" height="245" decoding="async"></picture>
    <picture class="brand-logo-dark"><source srcset="/brand/mirai-logo-dark.webp?v=${ASSET_VERSION}" type="image/webp"><img class="brand-logo" src="/brand/mirai-logo-dark.png?v=${ASSET_VERSION}" alt="Mirai Solutions" width="640" height="245" decoding="async"></picture>
  </a>`;
}

function header(locale, path) {
  const c = siteContent[locale];
  const other = locale === "en" ? "ar" : "en";
  return `<header class="site-header" data-header>
    <div class="shell header-inner">
      ${logo(locale)}
      <nav class="desktop-nav" aria-label="Primary navigation">
        ${c.nav.items.map((item) => `<a ${logicalPath(path) === item.href ? 'aria-current="page"' : ""} href="${href(item.href, locale)}">${e(item.label)}</a>`).join("")}
      </nav>
      <div class="header-actions">
        <a class="locale-pill" href="${href(logicalPath(path), other)}" aria-label="${locale === "en" ? "Switch to Arabic" : "Switch to English"}">${e(c.nav.language)}</a>
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="${e(c.nav.theme)}"><span aria-hidden="true" data-theme-icon>◐</span></button>
        <a class="button button-small" href="${href(c.nav.audit.href, locale)}">${e(c.nav.audit.label)} <span aria-hidden="true">${arrow(locale)}</span></a>
        <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-label="${e(c.nav.menu)}">☰</button>
      </div>
    </div>
    <div class="mobile-nav" data-mobile-nav hidden>
      <div class="shell mobile-nav-inner">
        ${c.nav.items.map((item) => `<a href="${href(item.href, locale)}">${e(item.label)}</a>`).join("")}
        <a class="button" href="${href(c.nav.audit.href, locale)}">${e(c.nav.audit.label)}</a>
      </div>
    </div>
  </header>`;
}

function footer(locale) {
  const c = siteContent[locale];
  return `<footer class="site-footer">
    <div class="shell footer-grid">
      <div class="footer-brand">${logo(locale)}<p>${e(c.global.brandLine)}</p></div>
      <nav class="footer-nav" aria-label="Footer navigation">
        ${c.nav.items.map((item) => `<a href="${href(item.href, locale)}">${e(item.label)}</a>`).join("")}
        ${Object.values(segments[locale].items).map((sg) => `<a href="${href(sg.slug, locale)}">${e(sg.nav)}</a>`).join("")}
      </nav>
      <div class="footer-meta"><p>${e(c.global.philosophy)}</p><p>© ${new Date().getFullYear()} Mirai Solutions</p></div>
    </div>
  </footer>`;
}

function sectionHeading(kicker, title, body = "") {
  return `<div class="section-heading"><p class="kicker">${e(kicker)}</p><h2>${e(title)}</h2>${body ? `<p class="section-lead">${e(body)}</p>` : ""}</div>`;
}

function heroWords(title) {
  return title.split(/\s+/).map((word, i) => `<span class="w" style="--i:${i}">${e(word)}</span>`).join(" ");
}

function ringVisual(locale, h) {
  const nodes = h.ring.nodes;
  // three orbit nodes at 120° apart
  const pos = [[50, 6], [90, 74], [10, 74]];
  return `<div class="ring-stage" data-ring-stage aria-hidden="true">
    <div class="ring-panel">
      <svg class="ring-svg" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="mirai-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe98c"/><stop offset=".5" stop-color="#39dcc8"/><stop offset="1" stop-color="#35a8ff"/></linearGradient>
          <radialGradient id="mirai-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#39dcc8" stop-opacity=".35"/><stop offset="1" stop-color="#39dcc8" stop-opacity="0"/></radialGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill="url(#mirai-glow)"/>
        <circle class="orbit" cx="200" cy="200" r="150" fill="none" stroke="currentColor" stroke-opacity=".14" stroke-dasharray="3 9"/>
        <circle class="ring-a" cx="200" cy="200" r="96" fill="none" stroke="url(#mirai-g)" stroke-width="34" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
        <circle class="ring-dot" cx="318" cy="82" r="18" fill="url(#mirai-g)"/>
      </svg>
      ${nodes.map((n, i) => `<span class="ring-node" data-ring-node style="--x:${pos[i][0]}%;--y:${pos[i][1]}%" ${i === 0 ? 'data-active="true"' : ""}>${e(n)}</span>`).join("")}
      <span class="ring-label">${e(h.ring.label)}</span>
    </div>
  </div>`;
}

function heroSection(locale) {
  const c = siteContent[locale];
  const h = c.home.hero;
  const r = h.rotate;
  return `<section class="hero-v4" data-hero>
    <canvas class="dots" data-dots aria-hidden="true"></canvas>
    <div class="shell hero-v4-grid">
      <div class="hero-v4-copy">
        <p class="kicker">${e(h.kicker)}</p>
        <h1 class="hero-v4-title" aria-label="${e(h.title)}">
          <span class="line">${e(r.before)}</span>
          <span class="line rotate-line"><span class="rotator" data-rotator>${r.words.map((w, i) => `<span class="rw gradient-text" ${i === 0 ? 'data-active="true"' : ""}>${e(w)}</span>`).join("")}</span></span>
          <span class="line">${e(r.after)}</span>
        </h1>
        <p class="hero-v4-lead">${e(h.segments)}</p>
        <div class="cta-row hero-v4-ctas">
          <a class="button" href="${href("/audit", locale)}" data-magnetic>${e(c.global.auditLabel)} <span aria-hidden="true">${arrow(locale)}</span></a>
          <a class="text-button" href="#lens">${e(h.scan.button)} <span aria-hidden="true">${arrow(locale)}</span></a>
        </div>
      </div>
      ${ringVisual(locale, h)}
    </div>
  </section>

  <section class="lens-band" id="lens">
    ${picture("glass", locale, { cls: "lens-bg", sizes: "100vw", decorative: true })}
    <div class="shell lens-grid">
      <div class="lens-copy">
        <p class="kicker">Mirai Lens</p>
        <h2>${e(h.scan.label)}</h2>
        <p>${e(h.scan.hint)}</p>
      </div>
      <form class="scan-form" data-scan-form novalidate method="get" action="${href("/audit", locale)}">
        <label class="scan-label sr-only" for="scan-url">${e(h.scan.label)}</label>
        <div class="scan-row">
          <span class="scan-prefix" aria-hidden="true">https://</span>
          <input id="scan-url" name="site" type="text" inputmode="url" autocomplete="url" spellcheck="false" placeholder="${e(h.scan.placeholder)}" required>
          <button class="button button-glow scan-button" type="submit"><span data-scan-label>${e(h.scan.button)}</span> <span aria-hidden="true">${arrow(locale)}</span></button>
        </div>
        <p class="scan-error" data-scan-error role="alert"></p>
      </form>
    </div>
    <div class="shell scan-result" data-scan-result hidden></div>
  </section>`;
}

function demoSection(locale) {
  const c = siteContent[locale];
  const h = c.home.hero;
  const sectors = h.demo.sectors;
  return `<section class="section-pad demo-section">
    <div class="shell demo-grid">
      <div class="demo-copy">
        ${sectionHeading(h.demo.eyebrow, c.home.difference.title, c.home.difference.body)}
        <div class="demo-tabs-v4" role="tablist" aria-label="${e(h.demo.eyebrow)}">
          ${sectors.map((sec, i) => `<button class="dtab" role="tab" type="button" data-demo-tab="${e(sec.key)}" aria-selected="${i === 0 ? "true" : "false"}"><b>${e(sec.tab)}</b><span>${e(sec.metric)}: ${e(sec.metricValue)}</span></button>`).join("")}
        </div>
      </div>
      <div class="demo-frame" data-demo-frame>
        ${sectors.map((sec, i) => `<div class="site site-after site-${e(sec.key)}" data-demo-panel="${e(sec.key)}" ${i === 0 ? 'data-active="true"' : ""}>
          <div class="site-bar"><span></span><span></span><span></span><i>${e(sec.key)}-co.com</i></div>
          <div class="site-nav"><b></b>${sec.nav.map((n) => `<span>${e(n)}</span>`).join("")}<em>${e(sec.cta)}</em></div>
          <div class="site-hero"><small>${e(sec.tab)}</small><strong>${e(sec.title)}</strong><span class="site-cta">${e(sec.cta)} ${arrow(locale)}</span></div>
          <div class="site-blocks">${sec.blocks.map((b) => `<div><i></i><span>${e(b)}</span></div>`).join("")}</div>
        </div>`).join("")}
      </div>
    </div>
  </section>`;
}

function renderHome(locale) {
  const c = siteContent[locale];
  const h = c.home;
  return `<main>
    ${heroSection(locale)}

    <section class="trust-band" id="trust">
      <div class="shell trust-grid">
        <figure class="trust-photo">${picture("team", locale, { cls: "trust-img", sizes: "(max-width: 820px) 100vw, 46vw" })}<figcaption>${locale === "ar" ? "استراتيجية · محتوى · تصميم · تطوير" : "Strategy · Content · Design · Development"}</figcaption></figure>
        <div class="trust-text">
          <p class="kicker">${e(h.trust.eyebrow)}</p>
          <h2>${e(h.trust.title)}</h2>
          <p>${e(h.trust.body)}</p>
          <ul class="trust-facts">${h.hero.stats.map((st) => `<li><b>${e(st.value)}</b><span>${e(st.label)}</span></li>`).join("")}</ul>
        </div>
      </div>
    </section>

    <section class="section-pad problem-section">
      <div class="shell split-head">
        ${sectionHeading(h.problem.kicker, h.problem.title, h.problem.body)}
        <div class="problem-list">
          ${h.problem.items.map((item, i) => `<article class="problem-item"><span class="mini-index">0${i + 1}</span><div><h3>${e(item.title)}</h3><p>${e(item.body)}</p></div></article>`).join("")}
        </div>
      </div>
      <div class="shell statement-line"><span>${e(h.problem.close)}</span></div>
    </section>

    <section class="section-pad audiences-section">
      <div class="shell section-topline">
        ${sectionHeading(h.audiences.kicker, h.audiences.title, h.audiences.body)}
        <a class="text-button compact" href="${href("/who-we-help", locale)}">${locale === "ar" ? "اعرف أكثر" : "See who we help"} ${arrow(locale)}</a>
      </div>
      <div class="shell audience-stack">
        ${h.audiences.items.map((item, i) => `<a class="audience-row has-thumb" href="${href(segmentForAudience[i] || "/who-we-help", locale)}">
          <span class="audience-no">0${i + 1}</span>
          <span class="audience-thumb">${thumb(audienceThumbs[i] || "team", locale)}</span>
          <div class="audience-main"><h3>${e(item.title)}</h3><p>${e(item.subtitle)}</p></div>
          <p class="audience-detail">${e(item.detail)}</p>
          <span class="audience-arrow" aria-hidden="true">${arrow(locale)}</span>
        </a>`).join("")}
      </div>
      <div class="shell no-sector"><h3>${e(h.audiences.closeTitle)}</h3><p>${e(h.audiences.closeBody)}</p></div>
    </section>

    ${demoSection(locale)}

    <section class="marquee" aria-hidden="true">
      <div class="marquee-track">${[...Array(2)].map(() => h.audiences.items.map((item) => `<span>${e(item.title)}</span><i>✦</i>`).join("")).join("")}</div>
    </section>

    <section class="section-pad process-section">
      <div class="shell">
        ${sectionHeading(h.process.kicker, h.process.title, h.process.body)}
        <ol class="timeline">
          ${h.process.steps.map((step) => `<li class="timeline-step reveal"><span class="timeline-no">${e(step.no)}</span><div><h3>${e(step.title)}</h3><p>${e(step.body)}</p><p class="timeline-outcome"><b>${locale === "ar" ? "النتيجة" : "Outcome"}</b> ${e(step.outcome)}</p></div></li>`).join("")}
        </ol>
        <div class="process-close"><h3>${e(h.process.closeTitle)}</h3><p>${e(h.process.closeBody)}</p></div>
      </div>
    </section>

    <section class="section-pad work-section">
      <div class="shell work-frame">
        <div class="work-copy">
          <p class="kicker">${e(h.work.kicker)}</p>
          <h2>${e(h.work.title)}</h2>
          <p class="work-client">${e(h.work.client)} <span>${e(h.work.sector)}</span></p>
          <p>${e(h.work.challenge)}</p>
          <p class="work-role">${e(h.work.role)}</p>
          <blockquote>${e(h.work.transformation)}</blockquote>
          <a class="text-button" href="${href("/work", locale)}">${e(h.work.cta)} ${arrow(locale)}</a>
        </div>
        <div class="case-visual has-photo">
          ${picture("work", locale, { cls: "case-photo", sizes: "(max-width: 1040px) 100vw, 60vw" })}
          <div class="case-window" aria-hidden="true"><div class="case-nav"></div><div class="case-hero"><span>MIRAI / CASE STUDY</span><strong>${locale === "ar" ? "رسالة أوضح. حضور أقوى." : "Clearer mission. Stronger digital presence."}</strong></div><div class="case-cards"><i></i><i></i><i></i></div></div>
        </div>
      </div>
    </section>

    <section class="dark-section section-pad">
      <div class="dark-glow"></div>
      <div class="shell why-grid">
        <div>${sectionHeading(h.why.kicker, h.why.title, h.why.body)}<p class="dark-close">${e(h.why.close)}</p></div>
        <div class="why-list">
          ${h.why.items.map((item, i) => `<article><span class="why-no">0${i + 1}</span><h3>${e(item.title)}</h3><p>${e(item.body)}</p></article>`).join("")}
        </div>
      </div>
    </section>

    <section class="section-pad audit-promo">
      <div class="shell audit-promo-grid">
        ${sectionHeading(h.audit.kicker, h.audit.title, h.audit.body)}
        <div class="audit-card">
          <div class="audit-points">${h.audit.points.map((p) => `<span>${e(p)}</span>`).join("")}</div>
          <p>${e(h.audit.close)}</p>
          <a class="button" href="${href("/audit", locale)}">${e(c.global.auditLabel)} ${arrow(locale)}</a>
        </div>
      </div>
    </section>

    <section class="section-pad faq-section">
      <div class="shell faq-grid">
        ${sectionHeading(h.faq.kicker, h.faq.title)}
        <div class="faq-list">${h.faq.items.map((item) => `<details><summary>${e(item.q)}<span aria-hidden="true">+</span></summary><p>${e(item.a)}</p></details>`).join("")}</div>
      </div>
    </section>

    <section class="final-cta section-pad">
      <div class="shell final-cta-inner"><div><h2>${e(h.final.title)}</h2><p>${e(h.final.body)}</p></div><div class="cta-row"><a class="button" href="${href("/audit", locale)}">${e(c.global.auditLabel)} ${arrow(locale)}</a><a class="text-button" href="${href("/audit", locale)}">${e(c.global.talkLabel)} ${arrow(locale)}</a></div></div>
    </section>
  </main>`;
}

function highlightHero(title, locale) {
  const phrase = locale === "ar" ? "ما يحتاج عملك" : "what your business needs";
  const idx = title.indexOf(phrase);
  if (idx < 0) return heroWords(title);
  const before = title.slice(0, idx).trim();
  const after = title.slice(idx + phrase.length).trim();
  const base = before ? before.split(/\s+/).length : 0;
  const words = (str, offset, cls = "") => str ? str.split(/\s+/).map((w, i) => `<span class="w ${cls}" style="--i:${offset + i}">${e(w)}</span>`).join(" ") : "";
  return [words(before, 0), `<span class="w gradient-text" style="--i:${base}">${e(phrase)}</span>`, words(after, base + 1)].filter(Boolean).join(" ");
}

function pageHero(kicker, title, intro) {
  return `<section class="inner-hero section-pad"><div class="shell inner-hero-grid"><div><p class="kicker">${e(kicker)}</p><h1>${e(title)}</h1></div><p class="inner-lead">${e(intro)}</p></div></section>`;
}

function renderSolutions(locale) {
  const c = siteContent[locale];
  return `<main>${pageHero(c.solutions.kicker, c.solutions.title, c.solutions.intro)}
    <section class="section-pad"><div class="shell stage-list">${c.solutions.stages.map((s) => `<article class="stage-row"><span>${e(s.no)}</span><h2>${e(s.title)}</h2><p>${e(s.body)}</p></article>`).join("")}</div></section>
    <section class="section-pad soft-section"><div class="shell big-message"><h2>${e(c.solutions.closingTitle)}</h2><p>${e(c.solutions.closingBody)}</p><a class="button" href="${href("/audit", locale)}">${e(c.global.auditLabel)} ${arrow(locale)}</a></div></section>
  </main>`;
}

function renderWho(locale) {
  const c = siteContent[locale];
  return `<main>${pageHero(c.whoWeHelp.kicker, c.whoWeHelp.title, c.whoWeHelp.intro)}
    <section class="section-pad"><div class="shell audience-stack large">${c.whoWeHelp.groups.map((g, i) => `<a class="audience-row has-thumb" href="${href(segmentForAudience[i] || "/who-we-help", locale)}"><span class="audience-no">0${i + 1}</span><span class="audience-thumb">${thumb(audienceThumbs[i] || "team", locale)}</span><div class="audience-main"><h2>${e(g.title)}</h2><p>${e(g.goal)}</p></div><p class="audience-detail">${e(g.body)}${i > 0 ? ` <span class="row-link">${locale === "ar" ? "اقرأ الدليل" : "Read the playbook"} ${arrow(locale)}</span>` : ""}</p><span class="audience-arrow" aria-hidden="true">${arrow(locale)}</span></a>`).join("")}</div></section>
    <section class="section-pad soft-section"><div class="shell big-message"><h2>${e(c.whoWeHelp.closingTitle)}</h2><p>${e(c.whoWeHelp.closingBody)}</p><a class="button" href="${href("/audit", locale)}">${e(c.global.auditLabel)} ${arrow(locale)}</a></div></section>
  </main>`;
}

function renderWork(locale) {
  const c = siteContent[locale];
  const cs = c.work.caseStudy;
  return `<main>${pageHero(c.work.kicker, c.work.title, c.work.intro)}
    <section class="section-pad"><div class="shell case-detail"><div class="case-detail-head"><div><p class="kicker">${e(cs.sector)}</p><h2>${e(cs.client)}</h2></div><p class="case-note">${e(cs.note)}</p></div>
      <div class="case-big-visual has-photo">${picture("work", locale, { cls: "case-photo", sizes: "(max-width: 1200px) 100vw, 1180px" })}<div class="case-window" aria-hidden="true"><div class="case-nav"></div><div class="case-hero"><span>MIRAI / CASE STUDY</span><strong>${locale === "ar" ? "من معلومات متفرقة إلى تجربة رقمية أوضح." : "From fragmented information to one clearer digital experience."}</strong></div><div class="case-cards"><i></i><i></i><i></i></div></div></div>
      <div class="case-columns"><article><p class="kicker">${e(cs.challengeTitle)}</p><p>${e(cs.challenge)}</p></article><article><p class="kicker">${e(cs.approachTitle)}</p><p>${e(cs.approach)}</p></article><article><p class="kicker">${e(cs.transformationTitle)}</p><p>${e(cs.transformation)}</p></article></div>
    </div></section>
  </main>`;
}

function renderAbout(locale) {
  const c = siteContent[locale];
  return `<main>${pageHero(c.about.kicker, c.about.title, c.about.intro)}
    <section class="section-pad about-story-section"><div class="shell about-story has-photo">
      <figure class="about-photo">${picture("about", locale, { cls: "about-img", sizes: "(max-width: 1040px) 100vw, 44vw" })}</figure>
      <div class="about-story-text"><h2>${e(c.about.storyTitle)}</h2><p>${e(c.about.story)}</p><p class="about-philosophy">${e(c.global.philosophy)}</p></div>
    </div></section>
    <section class="dark-section section-pad"><div class="shell principle-grid">${c.about.principles.map((p, i) => `<article><span class="why-no">0${i + 1}</span><h2>${e(p.title)}</h2><p>${e(p.body)}</p></article>`).join("")}</div></section>
    <section class="section-pad"><div class="shell big-message"><h2>${locale === "ar" ? "نبني للمستقبل بخطوات عملية اليوم." : "Build for the future. Execute practically today."}</h2><a class="button" href="${href("/audit", locale)}">${e(c.global.auditLabel)} ${arrow(locale)}</a></div></section>
  </main>`;
}

function renderAudit(locale) {
  const c = siteContent[locale];
  const a = c.audit;
  return `<main>${pageHero(a.kicker, a.title, a.intro)}
    <section class="section-pad audit-page"><div class="shell audit-layout">
      <div class="audit-side"><p class="kicker">${locale === "ar" ? "ماذا نراجع" : "WHAT WE REVIEW"}</p><h2>${locale === "ar" ? "مراجعة عملية حقيقية، لا مكالمة بيع متنكّرة." : "A practical review, not a sales call in disguise."}</h2><p>${siteContent[locale].home.audit.close}</p><div class="audit-mini-grid">${siteContent[locale].home.audit.points.map((p) => `<span>${e(p)}</span>`).join("")}</div>
        <figure class="audit-photo">${picture("audit", locale, { cls: "audit-img", sizes: "(max-width: 1040px) 100vw, 34vw" })}<figcaption>${locale === "ar" ? "مراجعة عملية على الحاسوب والهاتف — مع الخطوة التالية" : "A hands-on review on desktop and phone — with the next step"}</figcaption></figure></div>
      <form class="audit-form" data-audit-form novalidate>
        <div class="field-grid">
          ${field("name", a.fields.name, "text", true)}
          ${field("company", a.fields.company, "text", true)}
          ${field("website", a.fields.website, "url", false)}
          ${selectField("businessType", a.fields.businessType, a.options)}
          ${textareaField("improvementGoal", a.fields.improvementGoal)}
          ${field("email", a.fields.email, "email", true)}
          ${field("whatsapp", a.fields.whatsapp, "tel", true)}
          ${selectField("budget", a.fields.budget, a.budgets, false)}
          ${selectField("timeline", a.fields.timeline, a.timelines, false)}
          <input type="hidden" name="scanScore" data-scan-score>
        </div>
        <p class="form-privacy">${e(a.privacy)}</p>
        <button class="button submit-button" type="submit"><span data-submit-label>${e(a.fields.submit)}</span><span aria-hidden="true">${arrow(locale)}</span></button>
        <div class="form-message" data-form-message role="status" aria-live="polite"></div>
        <div class="success-panel" data-success-panel hidden><h2>${e(a.successTitle)}</h2><p>${e(a.successBody)}</p><a class="button" data-whatsapp-link href="#" target="_blank" rel="noopener">${e(a.whatsappCta)} ${arrow(locale)}</a></div>
      </form>
    </div></section>
  </main>`;
}

function field(name, label, type, required) {
  return `<label class="field"><span>${e(label)}</span><input name="${e(name)}" type="${e(type)}" ${required ? "required" : ""} autocomplete="${name === "email" ? "email" : name === "whatsapp" ? "tel" : "off"}"><small class="field-error" data-error-for="${e(name)}"></small></label>`;
}
function selectField(name, label, options, required = true) {
  return `<label class="field"><span>${e(label)}</span><select name="${e(name)}" ${required ? "required" : ""}><option value=""></option>${options.map((o) => `<option>${e(o)}</option>`).join("")}</select><small class="field-error" data-error-for="${e(name)}"></small></label>`;
}
function textareaField(name, label) {
  return `<label class="field field-wide"><span>${e(label)}</span><textarea name="${e(name)}" rows="5" required></textarea><small class="field-error" data-error-for="${e(name)}"></small></label>`;
}

function renderSegment(locale, seg) {
  const c = siteContent[locale];
  const all = Object.values(segments[locale].items);
  return `<main class="segment-page">
    <section class="seg-hero section-pad">
      <div class="shell seg-hero-grid">
        <div>
          <p class="kicker">${e(seg.kicker)}</p>
          <h1>${e(seg.title)}</h1>
          <p class="inner-lead">${e(seg.intro)}</p>
          <div class="cta-row"><a class="button" href="${href("/audit", locale)}">${e(c.global.auditLabel)} ${arrow(locale)}</a></div>
        </div>
        <div class="seg-visual">
          ${picture(seg.slug.slice(1), locale, { cls: "seg-photo", sizes: "(max-width: 1040px) 100vw, 48vw", eager: true })}
          <div class="seg-device" aria-hidden="true">
          <div class="device static"><div class="device-chrome"><span></span><span></span><span></span><i class="device-url">${e(seg.slug.slice(1))}-client.example</i></div>
            <div class="screen screen-${e(seg.slug.slice(1))}" data-active="true"><div class="screen-nav"><b></b>${seg.demo.nav.map((n) => `<span>${e(n)}</span>`).join("")}<em>${e(seg.demo.cta)}</em></div>
            <div class="screen-hero"><small>${e(seg.nav)}</small><strong>${e(seg.demo.hero)}</strong><span class="screen-cta">${e(seg.demo.cta)} ${arrow(locale)}</span></div>
            <div class="screen-blocks">${seg.demo.blocks.map((b) => `<div><i></i><span>${e(b)}</span></div>`).join("")}</div></div>
          </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad seg-icp">
      <div class="shell split-head">
        ${sectionHeading(locale === "ar" ? "لمن هذه الصفحة" : "WHO THIS IS FOR", seg.icpTitle)}
        <ul class="check-list">${seg.icp.map((x) => `<li>${e(x)}</li>`).join("")}</ul>
      </div>
    </section>

    <section class="section-pad soft-section">
      <div class="shell">
        ${sectionHeading(locale === "ar" ? "رحلة المشتري" : "THE BUYER JOURNEY", seg.needsTitle)}
        <div class="needs-grid">${seg.needs.map((n, i) => `<article class="need"><span class="need-no">${i + 1}</span><h3>${e(n.title)}</h3><p>${e(n.body)}</p></article>`).join("")}</div>
      </div>
    </section>

    <section class="section-pad">
      <div class="shell blueprint-grid">
        <div>${sectionHeading(locale === "ar" ? "الهيكل" : "STRUCTURE", seg.blueprintTitle)}<ol class="blueprint">${seg.blueprint.map((b) => `<li>${e(b)}</li>`).join("")}</ol></div>
        <div>${sectionHeading(locale === "ar" ? "الإجراءات" : "ACTIONS", seg.actionsTitle)}<ul class="action-chips">${seg.actions.map((a) => `<li>${e(a)}</li>`).join("")}</ul>
          <h3 class="mistakes-title">${e(seg.mistakesTitle)}</h3><ul class="mistakes">${seg.mistakes.map((m) => `<li>${e(m)}</li>`).join("")}</ul></div>
      </div>
    </section>

    <section class="dark-section section-pad">
      <div class="dark-glow"></div>
      <div class="shell why-grid">
        <div>${sectionHeading(locale === "ar" ? "ما تقدّمه MIRAI" : "WHAT MIRAI INCLUDES", seg.includesTitle)}</div>
        <ul class="includes">${seg.includes.map((x) => `<li>${e(x)}</li>`).join("")}</ul>
      </div>
    </section>

    <section class="section-pad audit-promo">
      <div class="shell audit-promo-grid">
        ${sectionHeading(c.home.audit.kicker, seg.auditTitle, seg.auditBody)}
        <div class="audit-card"><div class="audit-points">${c.home.audit.points.map((p) => `<span>${e(p)}</span>`).join("")}</div><a class="button" href="${href("/audit", locale)}">${e(c.global.auditLabel)} ${arrow(locale)}</a></div>
      </div>
    </section>

    <section class="section-pad soft-section">
      <div class="shell">
        <p class="kicker">${e(segments[locale].intro.kicker)}</p>
        <div class="other-segments">${all.filter((x) => x.slug !== seg.slug).map((x) => `<a class="other-seg" href="${href(x.slug, locale)}"><span class="kicker">${e(x.nav)}</span><h3>${e(x.title)}</h3><span class="text-button">${locale === "ar" ? "اقرأ الدليل" : "Read the playbook"} ${arrow(locale)}</span></a>`).join("")}</div>
      </div>
    </section>
  </main>`;
}

function renderBody(path, locale) {
  const logical = logicalPath(path);
  const seg = segmentBySlug(logical, locale);
  if (seg) return renderSegment(locale, seg);
  if (logical === "/") return renderHome(locale);
  if (logical === "/solutions") return renderSolutions(locale);
  if (logical === "/who-we-help") return renderWho(locale);
  if (logical === "/work") return renderWork(locale);
  if (logical === "/about") return renderAbout(locale);
  if (logical === "/audit") return renderAudit(locale);
  return `<main><section class="inner-hero section-pad"><div class="shell"><p class="kicker">404</p><h1>${locale === "ar" ? "الصفحة غير موجودة" : "Page not found"}</h1><a class="button" href="${href("/", locale)}">${locale === "ar" ? "الرئيسية" : "Back home"}</a></div></section></main>`;
}

function jsonLd(logical, locale, siteUrl) {
  const c = siteContent[locale];
  const org = {
    "@type": "Organization", "@id": `${siteUrl}/#org`, name: "Mirai Solutions", url: siteUrl,
    logo: `${siteUrl}/brand/mirai-logo-light.png`, slogan: c.global.brandLine,
    description: locale === "ar" ? "تبني Mirai Solutions مواقع وحضورًا رقميًا احترافيًا يُبنى حول أهداف العمل الحقيقية للمصانع وسلاسل المتاجر والمنظمات." : "Mirai Solutions builds business-first websites and digital presence for manufacturers, retail chains and organizations.",
    areaServed: ["EG", "SA", "AE", "QA", "OM"], knowsLanguage: ["ar", "en"]
  };
  const site = { "@type": "WebSite", "@id": `${siteUrl}/#site`, url: siteUrl, name: "Mirai Solutions", inLanguage: [locale === "ar" ? "ar" : "en"], publisher: { "@id": `${siteUrl}/#org` } };
  const graph = [org, site];
  if (logical === "/") {
    graph.push({ "@type": "FAQPage", mainEntity: c.home.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
    graph.push(...c.solutions.stages.map((st) => ({ "@type": "Service", name: st.title, description: st.body, provider: { "@id": `${siteUrl}/#org` }, serviceType: "Website strategy, content, design and development" })));
  }
  const seg = segmentBySlug(logical, locale);
  if (seg) graph.push({ "@type": "Service", name: seg.kicker, description: seg.intro, provider: { "@id": `${siteUrl}/#org` }, audience: { "@type": "BusinessAudience", name: seg.nav } });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c");
}

export function renderPage(path, locale) {
  const logical = logicalPath(path);
  const title = pageTitles[logical]?.[locale] || "Mirai Solutions";
  const description = pageDescriptions[logical]?.[locale] || pageDescriptions["/"][locale];
  const lang = locale === "ar" ? "ar" : "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  const siteUrl = (process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || "https://miraisolutions.net").replace(/\/$/, "");
  const heroImage = segmentBySlug(logical, locale) ? logical.slice(1) : null;
  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#f6f8fa">
  <meta name="color-scheme" content="only light">
  <title>${e(title)}</title>
  <meta name="description" content="${e(description)}">
  <meta property="og:title" content="${e(title)}">
  <meta property="og:description" content="${e(description)}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${e(siteUrl)}/images/${heroImage || "team"}-1200.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="${heroImage ? 805 : 670}">
  <meta property="og:image:alt" content="${e(imageAlt[locale][heroImage || "team"])}">
  <meta name="twitter:card" content="summary_large_image">
  <script>(function(){var d='light';try{var t=localStorage.getItem('mirai-theme');if(t==='dark'||t==='light'){d=t}else if(${THEME_MODE === "system"}&&matchMedia('(prefers-color-scheme: dark)').matches){d='dark'}}catch(e){}document.documentElement.dataset.theme=d})()</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600&family=Readex+Pro:wght@500;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap">
  ${heroImage ? `<link rel="preload" as="image" imagesrcset="/images/${heroImage}-800.webp?v=${ASSET_VERSION} 800w, /images/${heroImage}-1600.webp?v=${ASSET_VERSION} 1600w" imagesizes="(max-width: 1040px) 100vw, 48vw" type="image/webp">` : ""}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="canonical" href="${e(siteUrl + localizePath(logical, locale))}">
  <link rel="alternate" hreflang="en" href="${e(siteUrl + localizePath(logical, "en"))}">
  <link rel="alternate" hreflang="ar" href="${e(siteUrl + localizePath(logical, "ar"))}">
  <link rel="alternate" hreflang="x-default" href="${e(siteUrl + localizePath(logical, "en"))}">
  <meta property="og:locale" content="${locale === "ar" ? "ar_EG" : "en_US"}">
  <meta property="og:url" content="${e(siteUrl + localizePath(logical, locale))}">
  <script type="application/ld+json">${jsonLd(logical, locale, siteUrl)}</script>
  <link rel="stylesheet" href="/site.css?v=${ASSET_VERSION}">
</head>
<body data-locale="${lang}" data-page="${e(logical)}" data-theme-mode="${THEME_MODE}">
  <div class="scroll-progress" data-progress aria-hidden="true"></div>
  <a class="skip-link" href="#main-content">${locale === "ar" ? "انتقل للمحتوى" : "Skip to content"}</a>
  ${header(locale, path)}
  <div id="main-content">${renderBody(path, locale)}</div>
  ${footer(locale)}
  ${logical === "/audit" ? "" : `<div class="mobile-cta" data-mobile-cta aria-hidden="true"><a class="button" href="${href("/audit", locale)}" tabindex="-1">${e(siteContent[locale].nav.audit.label)} <span aria-hidden="true">${arrow(locale)}</span></a></div>`}
  <script type="module" src="/site.js?v=${ASSET_VERSION}"></script>
</body>
</html>`;
}
