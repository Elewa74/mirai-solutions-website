import { siteContent } from "../content/site-content.mjs";
import { organizations } from "../content/organizations.mjs";
import { localizePath } from "./i18n.mjs";

const ASSET_VERSION = process.env.NODE_ENV === "production" ? "2026-09-12a" : String(Date.now());
// Theme policy: "light" (default — the light look for everyone until they toggle) or "system" (follow the device).
// Override at deploy time with MIRAI_THEME=system.
const THEME_MODE = process.env.MIRAI_THEME === "system" ? "system" : "light";

/* ---------- photography (AI-generated placeholders, optimised in /public/images) ---------- */
const imageMeta = {
  team: { w: 1600, h: 893 },
  manufacturing: { w: 1600, h: 1073 },
  retail: { w: 1600, h: 1073 },
  ngo: { w: 1600, h: 1073 },
  about: { w: 1600, h: 1195 },
  consult: { w: 1600, h: 1073 }
};
const imageAlt = {
  en: {
    team: "The Mirai team reviewing a project plan around a table, with the Nile and Cairo skyline in the window behind them.",
    manufacturing: "A production engineer checking machined parts on a tablet inside a CNC workshop.",
    retail: "A barista handing a coffee to a customer at the counter of a bright neighbourhood café.",
    ngo: "A facilitator leading a community workshop in front of a whiteboard while participants listen.",
    about: "Two colleagues discussing a layout displayed on a large wall screen in a sunlit office.",
    consult: "A person reviewing a website on a laptop and phone beside a hand-written checklist."
  },
  ar: {
    team: "فريق Mirai يراجع خطة مشروع حول طاولة عمل، وخلفهم نافذة تطل على النيل والقاهرة.",
    manufacturing: "مهندسة إنتاج تراجع قطعًا مصنّعة على جهاز لوحي داخل ورشة تشغيل آلي.",
    retail: "باريستا يسلّم كوب قهوة لعميلة عند طاولة مقهى مضيء في أحد الأحياء.",
    ngo: "مدرّبة تقود ورشة عمل مجتمعية أمام لوح أبيض بينما يستمع المشاركون.",
    about: "زميلان يناقشان تصميمًا معروضًا على شاشة حائطية كبيرة في مكتب مضيء.",
    consult: "شخص يراجع موقعًا على حاسوب محمول وهاتف بجانب قائمة تحقق مكتوبة بخط اليد."
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

/** The one conversion action: a button that opens the consultation modal (optionally preselecting a solution). */
function consultButton(locale, { label, cls = "button", interest = "", magnetic = false, arrowIcon = true } = {}) {
  const c = siteContent[locale];
  return `<button class="${e(cls)}" type="button" data-consult${interest ? ` data-interest="${e(interest)}"` : ""}${magnetic ? " data-magnetic" : ""}>${e(label || c.global.consultLabel)}${arrowIcon ? ` <span aria-hidden="true">${arrow(locale)}</span>` : ""}</button>`;
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
        <a class="locale-pill" href="${href(["/not-found", "/redirect"].includes(logicalPath(path)) ? "/" : logicalPath(path), other)}" aria-label="${locale === "en" ? "Switch to Arabic" : "Switch to English"}">${e(c.nav.language)}</a>
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="${e(c.nav.theme)}"><span aria-hidden="true" data-theme-icon>◐</span></button>
        ${consultButton(locale, { label: c.nav.cta, cls: "button button-small header-cta" })}
        <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-label="${e(c.nav.menu)}">☰</button>
      </div>
    </div>
    <div class="mobile-nav" data-mobile-nav hidden>
      <div class="shell mobile-nav-inner">
        ${c.nav.items.map((item) => `<a href="${href(item.href, locale)}">${e(item.label)}</a>`).join("")}
        ${consultButton(locale, { label: c.nav.cta })}
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
        ${c.nav.items.filter((item) => item.href !== "/").map((item) => `<a href="${href(item.href, locale)}">${e(item.label)}</a>`).join("")}
        ${consultButton(locale, { label: c.global.consultLabel, cls: "text-button footer-cta" })}
      </nav>
      <div class="footer-meta"><p>${e(c.global.philosophy)}</p><p>© ${new Date().getFullYear()} Mirai Solutions</p></div>
    </div>
  </footer>`;
}

function sectionHeading(kicker, title, body = "") {
  return `<div class="section-heading"><p class="kicker">${e(kicker)}</p><h2>${e(title)}</h2>${body ? `<p class="section-lead">${e(body)}</p>` : ""}</div>`;
}

/* ---------- hero ---------- */
function highlightHero(title, locale) {
  const phrase = locale === "ar" ? "ما يحتاجه عملك" : "what your business needs";
  const idx = title.indexOf(phrase);
  const words = (str, offset, cls = "") => str ? str.split(/\s+/).map((w, i) => `<span class="w ${cls}" style="--i:${offset + i}">${e(w)}</span>`).join(" ") : "";
  if (idx < 0) return words(title, 0);
  const before = title.slice(0, idx).trim();
  const after = title.slice(idx + phrase.length).trim();
  const base = before ? before.split(/\s+/).length : 0;
  return [words(before, 0), `<span class="w gradient-text" style="--i:${base}">${e(phrase)}</span>`, words(after, base + 1)].filter(Boolean).join(" ");
}

function ringVisual(h) {
  const nodes = h.ring.nodes;
  // four solution nodes at 12 / 3 / 6 / 9 o'clock
  const pos = [[50, 6], [94, 50], [50, 92], [6, 50]];
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
  return `<section class="hero-v4" data-hero>
    <canvas class="dots" data-dots aria-hidden="true"></canvas>
    <div class="shell hero-v4-grid">
      <div class="hero-v4-copy">
        <p class="kicker">${e(h.kicker)}</p>
        <h1 class="hero-v4-title" aria-label="${e(h.title)}">${highlightHero(h.title, locale)}</h1>
        <p class="hero-v4-lead">${e(h.body)}</p>
        <div class="cta-row hero-v4-ctas">
          ${consultButton(locale, { label: h.primary, magnetic: true })}
          <a class="text-button" href="${href("/solutions", locale)}">${e(h.secondary)} <span aria-hidden="true">${arrow(locale)}</span></a>
        </div>
      </div>
      ${ringVisual(h)}
    </div>
  </section>`;
}

/* ---------- home sections ---------- */
function solutionsOverview(locale) {
  const c = siteContent[locale];
  const s = c.home.solutionsOverview;
  const [flagship, ...rest] = c.solutions;
  return `<section class="section-pad solutions-overview" id="solutions">
    <div class="shell section-topline">
      ${sectionHeading(s.kicker, s.title, s.body)}
      <a class="text-button compact" href="${href("/solutions", locale)}">${e(c.global.exploreLabel)} <span aria-hidden="true">${arrow(locale)}</span></a>
    </div>
    <div class="shell sol-grid">
      <article class="sol-featured" data-solution="${e(flagship.key)}">
        <div class="sol-featured-copy">
          <p class="sol-flag"><span class="sol-no">01</span>${e(c.global.flagship)}</p>
          <h3>${e(flagship.name)}</h3>
          <p class="sol-positioning">${e(flagship.positioning)}</p>
          <p class="sol-needs-label">${e(s.needsLabel)}</p>
          <ul class="chips">${flagship.needs.map((n) => `<li>${e(n)}</li>`).join("")}</ul>
          ${consultButton(locale, { label: c.global.discussLabel, interest: flagship.key })}
        </div>
        <figure class="sol-featured-photo">${picture("consult", locale, { cls: "sol-img", sizes: "(max-width: 1040px) 100vw, 44vw" })}</figure>
      </article>
      <div class="sol-rows">
        ${rest.map((sol, i) => `<article class="sol-row" data-solution="${e(sol.key)}">
          <span class="sol-no">0${i + 2}</span>
          <div class="sol-row-main"><h3>${e(sol.name)}</h3><p>${e(sol.positioning)}</p></div>
          <div class="sol-row-side"><ul class="chips small">${sol.needs.slice(0, 4).map((n) => `<li>${e(n)}</li>`).join("")}</ul>${consultButton(locale, { label: c.global.discussLabel, cls: "text-button", interest: sol.key })}</div>
        </article>`).join("")}
      </div>
    </div>
  </section>`;
}

function audiencesSection(locale) {
  const c = siteContent[locale];
  const a = c.home.audiences;
  return `<section class="section-pad audiences-section" id="who-we-help">
    <div class="shell section-topline">
      ${sectionHeading(a.kicker, a.title, a.body)}
      <a class="text-button compact" href="${href("/who-we-help", locale)}">${e(a.link)} <span aria-hidden="true">${arrow(locale)}</span></a>
    </div>
    <div class="shell audience-stack">
      ${a.items.map((item, i) => `<article class="audience-row has-thumb static-row">
        <span class="audience-no">0${i + 1}</span>
        <span class="audience-thumb">${thumb(audienceThumbs[i] || "team", locale)}</span>
        <div class="audience-main"><h3>${e(item.title)}</h3><p>${e(item.subtitle)}</p></div>
        <p class="audience-detail">${e(item.detail)}</p>
      </article>`).join("")}
    </div>
    <div class="shell no-sector"><h3>${e(a.closeTitle)}</h3><p>${e(a.closeBody)}</p></div>
  </section>`;
}

function mixSection(locale) {
  const c = siteContent[locale];
  const m = c.home.mix;
  const pillarName = (key) => c.solutions.find((s) => s.key === key)?.short || key;
  return `<section class="section-pad mix-section">
    <div class="shell mix-grid">
      <div class="mix-copy">
        ${sectionHeading(m.kicker, m.title, m.body)}
        <div class="mix-tabs" role="tablist" aria-label="${e(m.title)}">
          ${m.sectors.map((sec, i) => `<button class="dtab" role="tab" type="button" id="mix-tab-${e(sec.key)}" aria-controls="mix-panel-${e(sec.key)}" data-mix-tab="${e(sec.key)}" aria-selected="${i === 0 ? "true" : "false"}" tabindex="${i === 0 ? "0" : "-1"}"><b>${e(sec.tab)}</b></button>`).join("")}
        </div>
        <p class="mix-hint">${e(m.hint)}</p>
      </div>
      <div class="mix-frame" data-mix-frame>
        ${m.sectors.map((sec, i) => `<div class="mix-panel" role="tabpanel" id="mix-panel-${e(sec.key)}" aria-labelledby="mix-tab-${e(sec.key)}" data-mix-panel="${e(sec.key)}" ${i === 0 ? 'data-active="true"' : "hidden"}>
          <p class="kicker">${e(m.panelLabel)} · ${e(sec.tab)}</p>
          <h3>${e(sec.title)}</h3>
          <ul class="mix-list">${sec.items.map((it) => `<li><span class="mix-pillar" data-pillar="${e(it.pillar)}">${e(pillarName(it.pillar))}</span><b>${e(it.label)}</b></li>`).join("")}</ul>
        </div>`).join("")}
      </div>
    </div>
  </section>`;
}

function organizationsSection(locale) {
  if (!organizations.length) return "";
  const c = siteContent[locale];
  const o = c.home.organizations;
  const item = (org) => {
    const name = locale === "ar" && org.nameAr ? org.nameAr : org.name;
    const alt = org.alt || `${org.name} logo`;
    const inner = org.logo
      ? `<img src="${e(org.logo)}?v=${ASSET_VERSION}" alt="${e(alt)}" loading="lazy" decoding="async">`
      : `<span class="org-name">${e(name)}</span>`;
    return org.websiteUrl
      ? `<a class="org" href="${e(org.websiteUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${e(`${name} — ${o.visit}`)}">${inner}</a>`
      : `<div class="org" aria-label="${e(name)}">${inner}</div>`;
  };
  return `<section class="section-pad orgs-section" id="clients">
    <div class="shell">
      ${sectionHeading(o.kicker, o.title, o.body)}
      <div class="org-grid">${organizations.map(item).join("")}</div>
    </div>
  </section>`;
}

function processSection(locale) {
  const c = siteContent[locale];
  const p = c.home.process;
  return `<section class="section-pad process-section" id="how-we-work">
    <div class="shell">
      ${sectionHeading(p.kicker, p.title, p.body)}
      <ol class="timeline four">
        ${p.steps.map((step) => `<li class="timeline-step reveal"><span class="timeline-no">${e(step.no)}</span><div><h3>${e(step.title)}</h3><p>${e(step.body)}</p></div></li>`).join("")}
      </ol>
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
        <figure class="trust-photo">${picture("team", locale, { cls: "trust-img", sizes: "(max-width: 820px) 100vw, 46vw" })}<figcaption>${e(h.trust.caption)}</figcaption></figure>
        <div class="trust-text">
          <p class="kicker">${e(h.trust.eyebrow)}</p>
          <h2>${e(h.trust.title)}</h2>
          <p>${e(h.trust.body)}</p>
          <ul class="trust-facts">${h.trust.facts.map((st) => `<li><b>${e(st.value)}</b><span>${e(st.label)}</span></li>`).join("")}</ul>
        </div>
      </div>
    </section>

    ${solutionsOverview(locale)}
    ${audiencesSection(locale)}
    ${mixSection(locale)}
    ${organizationsSection(locale)}
    ${processSection(locale)}

    <section class="dark-section section-pad" id="why-mirai">
      <div class="dark-glow"></div>
      <div class="shell why-grid">
        <div>${sectionHeading(h.why.kicker, h.why.title, h.why.body)}<p class="dark-close">${e(h.why.close)}</p></div>
        <div class="why-list">
          ${h.why.items.map((item, i) => `<article><span class="why-no">0${i + 1}</span><h3>${e(item.title)}</h3><p>${e(item.body)}</p></article>`).join("")}
        </div>
      </div>
    </section>

    <section class="section-pad faq-section" id="faq">
      <div class="shell faq-grid">
        ${sectionHeading(h.faq.kicker, h.faq.title)}
        <div class="faq-list">${h.faq.items.map((item) => `<details><summary>${e(item.q)}<span aria-hidden="true">+</span></summary><p>${e(item.a)}</p></details>`).join("")}</div>
      </div>
    </section>

    ${finalCta(locale, h.final.title, h.final.body)}
  </main>`;
}

function finalCta(locale, title, body = "") {
  const c = siteContent[locale];
  return `<section class="final-cta section-pad">
    <div class="shell final-cta-inner"><div><h2>${e(title)}</h2>${body ? `<p>${e(body)}</p>` : ""}</div><div class="cta-row">${consultButton(locale)}<button class="text-button" type="button" data-consult>${e(c.global.talkLabel)} <span aria-hidden="true">${arrow(locale)}</span></button></div></div>
  </section>`;
}

function pageHero(kicker, title, intro) {
  return `<section class="inner-hero section-pad"><div class="shell inner-hero-grid"><div><p class="kicker">${e(kicker)}</p><h1>${e(title)}</h1></div><p class="inner-lead">${e(intro)}</p></div></section>`;
}

/* ---------- inner pages ---------- */
function renderSolutions(locale) {
  const c = siteContent[locale];
  const p = c.solutionsPage;
  const L = p.labels;
  return `<main>${pageHero(p.kicker, p.title, p.intro)}
    <section class="section-pad"><div class="shell sol-detail-list">
      ${c.solutions.map((sol, i) => `<article class="sol-detail" id="${e(sol.key)}" data-solution="${e(sol.key)}">
        <header class="sol-detail-head"><span class="sol-no">0${i + 1}</span><div><h2>${e(sol.name)}</h2>${sol.flagship ? `<span class="sol-flag-pill">${e(c.global.flagship)}</span>` : ""}<p class="sol-positioning">${e(sol.positioning)}</p></div></header>
        <div class="sol-detail-grid">
          <div class="sol-block"><p class="kicker">${e(L.problem)}</p><p>${e(sol.problem)}</p></div>
          <div class="sol-block"><p class="kicker">${e(L.helps)}</p><p>${e(sol.helps)}</p></div>
          <div class="sol-block"><p class="kicker">${e(L.outputs)}</p><ul class="check-list compact">${sol.outputs.map((o) => `<li>${e(o)}</li>`).join("")}</ul></div>
          <div class="sol-block"><p class="kicker">${e(L.useful)}</p><p>${e(sol.useful)}</p>${consultButton(locale, { label: c.global.discussLabel, interest: sol.key })}</div>
        </div>
      </article>`).join("")}
    </div></section>
    <section class="section-pad soft-section"><div class="shell">
      ${sectionHeading(p.process.kicker, p.process.title)}
      <div class="stage-list">${p.process.steps.map((s) => `<article class="stage-row"><span>${e(s.no)}</span><h3>${e(s.title)}</h3><p>${e(s.body)}</p></article>`).join("")}</div>
      <p class="statement-line"><span>${e(p.principle)}</span></p>
    </div></section>
    ${finalCta(locale, c.home.final.title, c.home.final.body)}
  </main>`;
}

function renderWho(locale) {
  const c = siteContent[locale];
  const w = c.whoWeHelp;
  return `<main>${pageHero(w.kicker, w.title, w.intro)}
    <section class="section-pad"><div class="shell audience-stack large">${w.groups.map((g, i) => `<article class="audience-row has-thumb static-row group-row"><span class="audience-no">0${i + 1}</span><span class="audience-thumb">${thumb(audienceThumbs[i] || "team", locale)}</span><div class="audience-main"><h2>${e(g.title)}</h2><p>${e(w.needsLabel)}</p></div><ul class="chips group-needs">${g.needs.map((n) => `<li>${e(n)}</li>`).join("")}</ul></article>`).join("")}</div></section>
    <section class="section-pad soft-section"><div class="shell big-message"><h2>${e(w.closingTitle)}</h2><p>${e(w.closingBody)}</p>${consultButton(locale)}</div></section>
  </main>`;
}

function renderAbout(locale) {
  const c = siteContent[locale];
  const a = c.about;
  return `<main>${pageHero(a.kicker, a.title, a.intro)}
    <section class="section-pad about-story-section"><div class="shell about-story has-photo">
      <figure class="about-photo">${picture("about", locale, { cls: "about-img", sizes: "(max-width: 1040px) 100vw, 44vw" })}</figure>
      <div class="about-story-text"><h2>${e(a.storyTitle)}</h2><p>${e(a.story)}</p><ul class="chips">${a.experience.map((x) => `<li>${e(x)}</li>`).join("")}</ul><p class="about-philosophy">${e(c.global.philosophy)}</p></div>
    </div></section>
    <section class="section-pad soft-section"><div class="shell today-grid">
      ${sectionHeading(a.todayTitle, a.todayBody)}
      <ol class="today-list">${c.solutions.map((s, i) => `<li><a href="${href("/solutions", locale)}#${e(s.key)}"><span class="sol-no">0${i + 1}</span><b>${e(s.name)}</b><span class="today-arrow" aria-hidden="true">${arrow(locale)}</span></a></li>`).join("")}</ol>
    </div></section>
    <section class="dark-section section-pad"><div class="dark-glow"></div><div class="shell"><p class="kicker">${e(a.principlesTitle)}</p><div class="principle-grid five">${a.principles.map((p, i) => `<article><span class="why-no">0${i + 1}</span><h2>${e(p.title)}</h2><p>${e(p.body)}</p></article>`).join("")}</div></div></section>
    <section class="section-pad"><div class="shell big-message"><h2>${e(a.closingTitle)}</h2>${consultButton(locale)}</div></section>
  </main>`;
}

function renderNotFound(locale) {
  const c = siteContent[locale];
  return `<main><section class="inner-hero section-pad"><div class="shell"><p class="kicker">404</p><h1>${e(c.notFound.title)}</h1><p class="inner-lead">${e(c.notFound.body)}</p><a class="button" href="${href("/", locale)}">${e(c.notFound.cta)}</a></div></section></main>`;
}

function renderRedirect(locale, to) {
  const c = siteContent[locale];
  return `<main><section class="inner-hero section-pad"><div class="shell"><p class="kicker">301</p><h1>${e(c.redirect.title)}</h1><p class="inner-lead">${e(c.redirect.body)}</p><a class="button" href="${e(to)}">${e(c.redirect.cta)} <span aria-hidden="true">${arrow(locale)}</span></a></div></section></main>`;
}

/* ---------- consultation modal (global) ---------- */
function field(id, name, label, type, required, { autocomplete = "off", inputmode = "" } = {}) {
  return `<div class="field"><label for="${id}">${e(label)}</label><input id="${id}" name="${e(name)}" type="${e(type)}" ${required ? 'required aria-required="true"' : ""} autocomplete="${autocomplete}"${inputmode ? ` inputmode="${inputmode}"` : ""} aria-describedby="${id}-error"><small class="field-error" id="${id}-error" data-error-for="${e(name)}"></small></div>`;
}
function selectField(id, name, label, options, placeholder) {
  return `<div class="field"><label for="${id}">${e(label)}</label><select id="${id}" name="${e(name)}" required aria-required="true" aria-describedby="${id}-error"><option value="">${e(placeholder)}</option>${options.map((o) => `<option value="${e(o)}">${e(o)}</option>`).join("")}</select><small class="field-error" id="${id}-error" data-error-for="${e(name)}"></small></div>`;
}
function textareaField(id, name, label) {
  return `<div class="field field-wide"><label for="${id}">${e(label)}</label><textarea id="${id}" name="${e(name)}" rows="4" required aria-required="true" aria-describedby="${id}-error"></textarea><small class="field-error" id="${id}-error" data-error-for="${e(name)}"></small></div>`;
}

function consultationModal(locale) {
  const c = siteContent[locale];
  const k = c.consult;
  return `<div class="consult" data-consult-modal hidden>
    <div class="consult-backdrop" data-consult-close></div>
    <div class="consult-dialog" role="dialog" aria-modal="true" aria-labelledby="consult-title" aria-describedby="consult-intro" tabindex="-1" data-consult-dialog>
      <button class="consult-close" type="button" data-consult-close aria-label="${e(k.close)}"><span aria-hidden="true">×</span></button>
      <aside class="consult-side">
        <p class="kicker">${e(c.global.consultShort)}</p>
        <h2 id="consult-title">${e(k.title)}</h2>
        <p id="consult-intro">${e(k.intro)}</p>
        <ul class="consult-pillars">${c.solutions.map((s) => `<li>${e(s.name)}</li>`).join("")}</ul>
        <figure class="consult-photo">${picture("about", locale, { cls: "consult-img", sizes: "(max-width: 820px) 100vw, 30vw" })}</figure>
      </aside>
      <form class="consult-form" data-consult-form method="post" action="/api/consultation" novalidate data-copy="${e(JSON.stringify({ errors: k.errors, states: k.states, whatsappMessage: k.whatsappMessage, sending: k.sending, copied: k.copied }))}">
        <div class="field-grid">
          ${field("c-name", "name", k.fields.name, "text", true, { autocomplete: "name" })}
          ${field("c-company", "company", k.fields.company, "text", true, { autocomplete: "organization" })}
          ${field("c-email", "email", k.fields.email, "email", true, { autocomplete: "email" })}
          ${field("c-whatsapp", "whatsapp", k.fields.whatsapp, "tel", true, { autocomplete: "tel", inputmode: "tel" })}
          ${selectField("c-business", "businessType", k.fields.businessType, k.businessTypes, k.fields.choose)}
          ${selectField("c-interest", "interest", k.fields.interest, k.interests, k.fields.choose)}
          <div class="field field-wide"><label for="c-website">${e(k.fields.website)}</label><input id="c-website" name="website" type="url" inputmode="url" autocomplete="url" placeholder="https://" aria-describedby="c-website-error"><small class="field-error" id="c-website-error" data-error-for="website"></small></div>
          ${textareaField("c-message", "message", k.fields.message)}
        </div>
        <p class="form-privacy">${e(k.privacy)}</p>
        <button class="button submit-button" type="submit"><span data-submit-label>${e(k.submit)}</span><span aria-hidden="true">${arrow(locale)}</span></button>
        <p class="form-message" data-form-message role="alert" aria-live="assertive"></p>
        <div class="consult-result" data-consult-result hidden tabindex="-1">
          <h3 data-result-title></h3>
          <p data-result-body></p>
          <div class="cta-row">
            <a class="button" data-whatsapp-link href="#" target="_blank" rel="noopener noreferrer" hidden>${e(k.whatsappCta)} <span aria-hidden="true">${arrow(locale)}</span></a>
            <button class="text-button" type="button" data-copy-message hidden>${e(k.copyCta)}</button>
          </div>
          <pre class="message-preview" data-message-preview hidden></pre>
          <p class="channel-note" data-channel-note hidden>${e(k.channelNote)}</p>
        </div>
      </form>
    </div>
  </div>`;
}

/* ---------- document ---------- */
function renderBody(logical, locale, opts) {
  if (logical === "/redirect") return renderRedirect(locale, opts.redirectTo || localizePath("/", locale));
  if (logical === "/") return renderHome(locale);
  if (logical === "/solutions") return renderSolutions(locale);
  if (logical === "/who-we-help") return renderWho(locale);
  if (logical === "/about") return renderAbout(locale);
  return renderNotFound(locale);
}

function jsonLd(logical, locale, siteUrl) {
  const c = siteContent[locale];
  const org = {
    "@type": "Organization", "@id": `${siteUrl}/#org`, name: "Mirai Solutions", url: siteUrl,
    logo: `${siteUrl}/brand/mirai-logo-light.png`, slogan: c.global.brandLine,
    description: c.meta["/"].description,
    areaServed: ["EG", "SA", "AE", "QA", "OM"], knowsLanguage: ["ar", "en"]
  };
  const site = { "@type": "WebSite", "@id": `${siteUrl}/#site`, url: siteUrl, name: "Mirai Solutions", inLanguage: [locale === "ar" ? "ar" : "en"], publisher: { "@id": `${siteUrl}/#org` } };
  const graph = [org, site];
  if (logical === "/") graph.push({ "@type": "FAQPage", mainEntity: c.home.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  if (logical === "/" || logical === "/solutions") {
    graph.push(...c.solutions.map((s) => ({ "@type": "Service", name: s.name, description: s.positioning, provider: { "@id": `${siteUrl}/#org` }, serviceType: s.name, url: `${siteUrl}${localizePath("/solutions", locale)}#${s.key}` })));
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c");
}

/**
 * renderPage(path, locale, opts)
 *   path   — request path ("/", "/ar/about", …) or the pseudo paths "/not-found" and "/redirect"
 *   opts   — { redirectTo } for redirect pages
 */
export function renderPage(path, locale, opts = {}) {
  const c = siteContent[locale];
  const logical = logicalPath(path);
  const special = logical === "/not-found" || logical === "/redirect";
  const meta = c.meta[logical] || null;
  const title = meta ? meta.title : logical === "/redirect" ? `${c.redirect.title} — Mirai Solutions` : `${c.notFound.title} — Mirai Solutions`;
  const description = meta ? meta.description : c.meta["/"].description;
  const lang = locale === "ar" ? "ar" : "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  const siteUrl = (process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || "https://miraisolutions.net").replace(/\/$/, "");
  const canonicalLogical = special ? "/" : logical;
  const canonicalUrl = logical === "/redirect" && opts.redirectTo ? siteUrl + opts.redirectTo.replace(/[?#].*$/, "") : siteUrl + localizePath(canonicalLogical, locale);
  const whatsapp = String(process.env.MIRAI_WHATSAPP || "").replace(/\D/g, "");
  // Optional static-site email relay (GitHub Pages has no server): a FormSubmit-style AJAX endpoint + extra recipients
  const formEndpoint = /^https:\/\//.test(process.env.MIRAI_FORM_ENDPOINT || "") ? process.env.MIRAI_FORM_ENDPOINT.trim() : "";
  const formCc = String(process.env.MIRAI_FORM_CC || "").trim();
  // Optional owner notification (e.g. a CallMeBot WhatsApp URL) with a {text} placeholder — fired after a successful send
  const notifyUrl = /^https:\/\/\S+\{text\}/.test(process.env.MIRAI_NOTIFY_URL || "") ? process.env.MIRAI_NOTIFY_URL.trim() : "";
  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#f6f8fa">
  <meta name="color-scheme" content="only light">
  <title>${e(title)}</title>
  <meta name="description" content="${e(description)}">
  ${special ? '<meta name="robots" content="noindex, nofollow">' : ""}
  ${logical === "/redirect" && opts.redirectTo ? `<meta http-equiv="refresh" content="0;url=${e(opts.redirectTo)}">` : ""}
  <meta property="og:title" content="${e(title)}">
  <meta property="og:description" content="${e(description)}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${e(siteUrl)}/images/team-1200.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="670">
  <meta property="og:image:alt" content="${e(imageAlt[locale].team)}">
  <meta name="twitter:card" content="summary_large_image">
  <script>(function(){var d='light';try{var t=localStorage.getItem('mirai-theme');if(t==='dark'||t==='light'){d=t}else if(${THEME_MODE === "system"}&&matchMedia('(prefers-color-scheme: dark)').matches){d='dark'}}catch(e){}document.documentElement.dataset.theme=d})()</script>
  ${logical === "/redirect" && opts.redirectTo ? `<script>location.replace(${JSON.stringify(opts.redirectTo)})</script>` : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600&family=Readex+Pro:wght@500;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="canonical" href="${e(canonicalUrl)}">
  ${special ? "" : `<link rel="alternate" hreflang="en" href="${e(siteUrl + localizePath(logical, "en"))}">
  <link rel="alternate" hreflang="ar" href="${e(siteUrl + localizePath(logical, "ar"))}">
  <link rel="alternate" hreflang="x-default" href="${e(siteUrl + localizePath(logical, "en"))}">`}
  <meta property="og:locale" content="${locale === "ar" ? "ar_EG" : "en_US"}">
  <meta property="og:url" content="${e(canonicalUrl)}">
  <script type="application/ld+json">${jsonLd(logical, locale, siteUrl)}</script>
  <link rel="stylesheet" href="/site.css?v=${ASSET_VERSION}">
</head>
<body data-locale="${lang}" data-page="${e(logical)}" data-theme-mode="${THEME_MODE}"${whatsapp ? ` data-whatsapp="${whatsapp}"` : ""}${formEndpoint ? ` data-form-endpoint="${e(formEndpoint)}"` : ""}${formEndpoint && formCc ? ` data-form-cc="${e(formCc)}"` : ""}${notifyUrl ? ` data-notify-url="${e(notifyUrl)}"` : ""}>
  <div class="scroll-progress" data-progress aria-hidden="true"></div>
  <a class="skip-link" href="#main-content">${locale === "ar" ? "انتقل للمحتوى" : "Skip to content"}</a>
  ${header(locale, path)}
  <div id="main-content">${renderBody(logical, locale, opts)}</div>
  ${footer(locale)}
  ${special ? "" : `<div class="mobile-cta" data-mobile-cta aria-hidden="true">${consultButton(locale, { label: c.nav.cta })}</div>`}
  ${consultationModal(locale)}
  <script type="module" src="/site.js?v=${ASSET_VERSION}"></script>
</body>
</html>`;
}
