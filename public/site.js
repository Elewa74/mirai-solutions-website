import { nextTheme, resolveTheme } from "/theme.mjs";

const root = document.documentElement;
const locale = document.body.dataset.locale || "en";
// Static export (GitHub Pages): there is no API, so the consultation request continues on WhatsApp.
const STATIC = document.body.dataset.static === "1";
const BASE = document.body.dataset.base || "";
const WHATSAPP = (document.body.dataset.whatsapp || "").replace(/\D/g, "");
// Optional email relay for the static site (FormSubmit-style AJAX endpoint baked in at export time)
const FORM_ENDPOINT = document.body.dataset.formEndpoint || "";
const FORM_CC = document.body.dataset.formCc || "";
// Optional owner notification URL with a {text} placeholder (e.g. CallMeBot WhatsApp); best-effort, fire-and-forget
const NOTIFY_URL = document.body.dataset.notifyUrl || "";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isRTL = root.dir === "rtl";

/* ============================================================
   Theme + navigation
   ============================================================ */
function currentTheme() {
  let stored = null;
  try { stored = localStorage.getItem("mirai-theme"); } catch {}
  return resolveTheme(stored, window.matchMedia("(prefers-color-scheme: dark)").matches, document.body.dataset.themeMode);
}

function applyTheme(theme, persist = false) {
  root.dataset.theme = theme;
  if (persist) { try { localStorage.setItem("mirai-theme", theme); } catch {} }
  const icon = document.querySelector("[data-theme-icon]");
  if (icon) icon.textContent = theme === "dark" ? "☀" : "◐";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#06111a" : "#f6f8fa");
}

applyTheme(currentTheme());
document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => applyTheme(nextTheme(root.dataset.theme || "light"), true));

const menuButton = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
function setMenu(open) {
  menuButton?.setAttribute("aria-expanded", String(open));
  if (mobileNav) mobileNav.hidden = !open;
}
menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));

/* ============================================================
   Consultation modal — the one conversion flow
   ============================================================ */
const modal = document.querySelector("[data-consult-modal]");
const dialog = modal?.querySelector("[data-consult-dialog]");
const form = modal?.querySelector("[data-consult-form]");
// Localized copy is server-rendered into data-copy on <form> so the client has no duplicate dictionary.
const T = (() => {
  try { return JSON.parse(form?.dataset.copy || "{}"); } catch { return {}; }
})();
function errorText(field, code) {
  if (code === "required") return T.errors?.required?.[field] || (locale === "ar" ? "هذا الحقل مطلوب." : "This field is required.");
  return T.errors?.[code] || T.errors?.generic || code;
}

let lastTrigger = null;
let openState = false;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusables() {
  return [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => !el.hidden && el.offsetParent !== null && !el.closest("[hidden]"));
}

function openConsult(trigger, interestKey) {
  if (!modal || openState) return;
  lastTrigger = trigger || document.activeElement;
  setMenu(false);
  if (interestKey) preselectInterest(interestKey);
  modal.hidden = false;
  openState = true;
  document.body.classList.add("consult-open");
  requestAnimationFrame(() => {
    modal.classList.add("is-open");
    const first = form?.querySelector("input, select, textarea");
    (first || dialog).focus({ preventScroll: true });
  });
  document.addEventListener("keydown", onKeydown);
}

function closeConsult() {
  if (!modal || !openState) return;
  openState = false;
  modal.classList.remove("is-open");
  document.body.classList.remove("consult-open");
  document.removeEventListener("keydown", onKeydown);
  const finish = () => { modal.hidden = true; };
  if (reduceMotion) finish(); else setTimeout(finish, 220);
  if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus({ preventScroll: true });
  lastTrigger = null;
}

function onKeydown(ev) {
  if (ev.key === "Escape") { ev.preventDefault(); closeConsult(); return; }
  if (ev.key !== "Tab") return;
  const items = focusables();
  if (!items.length) { ev.preventDefault(); dialog.focus(); return; }
  const first = items[0], last = items[items.length - 1];
  if (ev.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { ev.preventDefault(); last.focus(); }
  else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  else if (!dialog.contains(document.activeElement)) { ev.preventDefault(); first.focus(); }
}

// "Interested in" preselect: solution keys map to option order (websites, brand, content, workflows)
const INTEREST_INDEX = { websites: 0, brand: 1, content: 2, workflows: 3 };
function preselectInterest(key) {
  const select = form?.querySelector('select[name="interest"]');
  if (!select) return;
  const idx = INTEREST_INDEX[key];
  if (idx == null) return;
  const option = select.options[idx + 1]; // +1: placeholder first
  if (option) select.value = option.value;
}

document.addEventListener("click", (ev) => {
  const trigger = ev.target.closest("[data-consult]");
  if (trigger) { ev.preventDefault(); openConsult(trigger, trigger.dataset.interest || ""); return; }
  if (ev.target.closest("[data-consult-close]")) { ev.preventDefault(); closeConsult(); }
});

// /?consult=1 (legacy /audit URLs redirect here) opens the modal on load
if (modal && new URLSearchParams(location.search).get("consult") === "1") {
  const params = new URLSearchParams(location.search);
  const interest = params.get("interest") || "";
  setTimeout(() => openConsult(null, interest), 250);
}

/* ---- form: validation, server mode (POST /api/consultation) or static WhatsApp hand-off ---- */
function validateClient(data) {
  const errors = {};
  for (const key of ["name", "company", "email", "whatsapp", "businessType", "interest", "message"]) if (!String(data[key] || "").trim()) errors[key] = "required";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "email";
  if (data.whatsapp && !/^\+?[0-9\s()-]{8,25}$/.test(data.whatsapp.trim())) errors.whatsapp = "whatsapp";
  if (data.website && data.website.trim()) {
    const raw = data.website.trim();
    const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try { const u = new URL(candidate); if (!u.hostname.includes(".")) errors.website = "url"; } catch { errors.website = "url"; }
  }
  return errors;
}

function showErrors(errors) {
  let firstBad = null;
  form.querySelectorAll("[data-error-for]").forEach((node) => {
    const field = node.dataset.errorFor;
    const input = form.querySelector(`[name="${field}"]`);
    if (errors[field]) {
      node.textContent = errorText(field, errors[field]);
      input?.setAttribute("aria-invalid", "true");
      if (!firstBad) firstBad = input;
    } else {
      node.textContent = "";
      input?.removeAttribute("aria-invalid");
    }
  });
  if (firstBad) firstBad.focus({ preventScroll: false });
  return !!firstBad;
}

function buildMessage(data) {
  const w = T.whatsappMessage || { greeting: "Hello Mirai, I'd like a free consultation.", labels: {} };
  const L = (k, fallback) => w.labels?.[k] || fallback;
  const line = (label, value) => (value ? `${label}: ${value}` : null);
  return [
    w.greeting,
    "",
    line(L("name", "Name"), data.name),
    line(L("company", "Company"), data.company),
    line(L("businessType", "Business type"), data.businessType),
    line(L("interest", "Interested in"), data.interest),
    line(L("website", "Website"), data.website),
    line(L("email", "Email"), data.email),
    line(L("whatsapp", "WhatsApp"), data.whatsapp),
    "",
    line(L("message", "What I need"), data.message)
  ].filter((l) => l !== null).join("\n");
}

async function relayEmail(data) {
  const payload = {
    "Name": data.name, "Company / Organization": data.company, "Email": data.email, "WhatsApp": data.whatsapp,
    "Business type": data.businessType, "Interested in": data.interest, "Website": data.website || "-", "Message": data.message,
    "Language": locale === "ar" ? "Arabic" : "English", "Page": location.href,
    _subject: `New consultation request — ${data.name} / ${data.company}`, _template: "table", _captcha: "false", _replyto: data.email
  };
  if (FORM_CC) payload._cc = FORM_CC;
  const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(payload) });
  const json = await res.json().catch(() => ({}));
  return res.ok && (json.success === true || json.success === "true");
}

function notifyOwner(text) {
  if (!NOTIFY_URL) return;
  try { fetch(NOTIFY_URL.replace("{text}", encodeURIComponent(text)), { mode: "no-cors", keepalive: true }).catch(() => {}); } catch {}
}

function showResult(kind, { whatsappHref, message } = {}) {
  const result = form.querySelector("[data-consult-result]");
  const title = result.querySelector("[data-result-title]");
  const body = result.querySelector("[data-result-body]");
  const wa = result.querySelector("[data-whatsapp-link]");
  const copy = result.querySelector("[data-copy-message]");
  const preview = result.querySelector("[data-message-preview]");
  const note = result.querySelector("[data-channel-note]");
  const state = T.states?.[kind] || {};
  title.textContent = state.title || "";
  body.textContent = (state.body || "") + (kind === "success" && whatsappHref && state.whatsapp ? ` ${state.whatsapp}` : "");
  if (whatsappHref) { wa.href = whatsappHref; wa.hidden = false; } else wa.hidden = true;
  // the copy-message fallback is only for states where nothing was delivered yet
  const showCopy = kind !== "success" && !whatsappHref && !!message;
  copy.hidden = !showCopy;
  preview.hidden = !showCopy;
  if (showCopy) preview.textContent = message;
  note.hidden = !(kind === "static" || kind === "noEmail") || !whatsappHref;
  form.querySelector(".field-grid").hidden = true;
  form.querySelector(".form-privacy").hidden = true;
  form.querySelector(".submit-button").hidden = true;
  result.hidden = false;
  result.focus({ preventScroll: true });
  copy.onclick = async () => {
    try { await navigator.clipboard.writeText(message); copy.textContent = T.copied || "Copied"; } catch { preview.hidden = false; }
  };
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector(".submit-button");
    const label = submit.querySelector("[data-submit-label]");
    const message = form.querySelector("[data-form-message]");
    const data = Object.fromEntries(new FormData(form).entries());
    message.textContent = "";
    const errors = validateClient(data);
    if (showErrors(errors)) { message.textContent = T.errors?.generic || ""; return; }

    const text = buildMessage(data);
    const localWa = WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}` : null;

    if (STATIC) {
      // No server on GitHub Pages. If an email relay is configured, send through it and show success only when it
      // confirms; otherwise (or on failure) hand off to WhatsApp with the details pre-filled — never a fake "sent".
      if (FORM_ENDPOINT) {
        submit.disabled = true;
        const original = label.textContent;
        label.textContent = T.sending || original;
        try {
          const sent = await relayEmail(data);
          if (sent) { notifyOwner(text); showResult("success", { whatsappHref: localWa, message: text }); return; }
        } catch {}
        finally { submit.disabled = false; label.textContent = original; }
      }
      showResult(localWa ? "static" : "noChannel", { whatsappHref: localWa, message: text });
      return;
    }

    submit.disabled = true;
    const original = label.textContent;
    label.textContent = T.sending || original;
    try {
      const response = await fetch(`${BASE}/api/consultation`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...data, locale }) });
      const result = await response.json().catch(() => ({ ok: false }));
      if (response.status === 400 && result.errors) { showErrors(result.errors); message.textContent = T.errors?.generic || ""; return; }
      if (!response.ok || !result.ok) {
        // email failed on the server — offer WhatsApp instead of a fake success
        const wa = result.whatsappHref || localWa;
        if (wa) showResult("noEmail", { whatsappHref: wa, message: text });
        else message.textContent = T.errors?.network || "";
        return;
      }
      const wa = result.whatsappHref || localWa;
      if (result.emailSent) { notifyOwner(text); showResult("success", { whatsappHref: wa, message: text }); }
      else showResult(wa ? "noEmail" : "noChannel", { whatsappHref: wa, message: text });
    } catch {
      if (localWa) showResult("noEmail", { whatsappHref: localWa, message: text });
      else message.textContent = T.errors?.network || "";
    } finally {
      submit.disabled = false;
      label.textContent = original;
    }
  });
}

/* ============================================================
   Motion & interactions (all disabled under prefers-reduced-motion)
   ============================================================ */
// Sticky header state
const header = document.querySelector("[data-header]");
const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Scroll reveal
const revealTargets = document.querySelectorAll(".reveal, .section-heading, .audience-row, .sol-featured, .sol-row, .sol-detail, .org, .why-list article, details, .final-cta-inner, .stage-row, .principle-grid article, .about-story, .trust-grid, .today-list li, .mix-frame, .no-sector");
revealTargets.forEach((el) => el.setAttribute("data-reveal", ""));
const revealAll = document.querySelectorAll("[data-reveal]");
if (!reduceMotion) {
  const pending = new Set(revealAll);
  const check = () => {
    const vh = window.innerHeight;
    for (const el of pending) {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) { el.classList.add("is-visible"); pending.delete(el); }
    }
    if (!pending.size) { window.removeEventListener("scroll", check); window.removeEventListener("resize", check); }
  };
  check();
  window.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", check, { passive: true });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); pending.delete(entry.target); io.unobserve(entry.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    pending.forEach((el) => io.observe(el));
  }
  setTimeout(() => revealAll.forEach((el) => el.classList.add("is-visible")), 6000); // safety net
} else {
  revealAll.forEach((el) => el.classList.add("is-visible"));
}

// Magnetic CTA
document.querySelectorAll("[data-magnetic]").forEach((el) => {
  if (reduceMotion || !matchMedia("(pointer: fine)").matches) return;
  el.addEventListener("pointermove", (ev) => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(ev.clientX - r.left - r.width / 2) * 0.18}px, ${(ev.clientY - r.top - r.height / 2) * 0.28}px)`;
  });
  el.addEventListener("pointerleave", () => { el.style.transform = ""; });
});

// Hero ring: the four solution nodes light up in turn
const ringNodes = [...document.querySelectorAll("[data-ring-node]")];
if (ringNodes.length > 1 && !reduceMotion) {
  let i = 0;
  setInterval(() => { i = (i + 1) % ringNodes.length; ringNodes.forEach((n, k) => n.toggleAttribute("data-active", k === i)); }, 2600);
}

// "Different businesses" mix tabs (tablist semantics + arrow keys + gentle auto-cycle)
const mixFrame = document.querySelector("[data-mix-frame]");
if (mixFrame) {
  const tabs = [...document.querySelectorAll("[data-mix-tab]")];
  const panels = [...mixFrame.querySelectorAll("[data-mix-panel]")];
  let idx = 0, cycle = null;
  const activate = (n, focus = false) => {
    idx = (n + tabs.length) % tabs.length;
    const key = tabs[idx].dataset.mixTab;
    tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === idx)); t.tabIndex = k === idx ? 0 : -1; });
    panels.forEach((p) => { const on = p.dataset.mixPanel === key; p.toggleAttribute("data-active", on); p.hidden = !on; });
    if (focus) tabs[idx].focus();
  };
  const schedule = () => { clearInterval(cycle); if (!reduceMotion) cycle = setInterval(() => activate(idx + 1), 5200); };
  tabs.forEach((t, n) => {
    t.addEventListener("click", () => { activate(n); schedule(); });
    t.addEventListener("keydown", (ev) => {
      const next = { ArrowRight: isRTL ? -1 : 1, ArrowLeft: isRTL ? 1 : -1, ArrowDown: 1, ArrowUp: -1 }[ev.key];
      if (next == null && ev.key !== "Home" && ev.key !== "End") return;
      ev.preventDefault(); clearInterval(cycle);
      activate(ev.key === "Home" ? 0 : ev.key === "End" ? tabs.length - 1 : idx + next, true);
    });
    t.addEventListener("focus", () => clearInterval(cycle));
  });
  const section = mixFrame.closest(".mix-section");
  section?.addEventListener("pointerenter", () => clearInterval(cycle));
  section?.addEventListener("pointerleave", schedule);
  activate(0); schedule();
}

// Scroll progress bar
const progress = document.querySelector("[data-progress]");
if (progress) {
  const upd = () => { const h = document.documentElement; const max = h.scrollHeight - h.clientHeight; progress.style.transform = `scaleX(${max > 0 ? Math.min(1, h.scrollTop / max) : 0})`; };
  window.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd); upd();
}

// Staggered reveal for list-type elements
{
  const extra = document.querySelectorAll(".check-list li, .timeline-step, .dtab, .timeline, .chips li, .group-needs li");
  if (!reduceMotion) {
    const pend = new Set(extra);
    const chk = () => {
      const vh = window.innerHeight;
      for (const el of pend) { const r = el.getBoundingClientRect(); if (r.top < vh * 0.94 && r.bottom > 0) { el.classList.add("is-visible"); pend.delete(el); } }
      if (!pend.size) window.removeEventListener("scroll", chk);
    };
    chk(); window.addEventListener("scroll", chk, { passive: true }); window.addEventListener("resize", chk, { passive: true });
    setTimeout(() => extra.forEach((el) => el.classList.add("is-visible")), 6000);
  } else {
    extra.forEach((el) => el.classList.add("is-visible"));
  }
}

// Animated counters (facts)
if (!reduceMotion) {
  const nums = [...document.querySelectorAll(".trust-facts b")].filter((el) => /^\+?\d+\+?$/.test(el.textContent.trim()));
  const seen = new WeakSet();
  const run = () => {
    for (const el of nums) {
      if (seen.has(el)) continue;
      const r = el.getBoundingClientRect(); if (r.top > window.innerHeight * 0.95 || r.bottom < 0) continue;
      seen.add(el);
      const raw = el.textContent.trim(); const target = parseInt(raw.replace(/\D/g, ""), 10); const prefix = raw.startsWith("+") ? "+" : ""; const suffix = raw.endsWith("+") ? "+" : "";
      const t0 = performance.now(); el.classList.add("counting");
      const step = (now) => { const p = Math.min(1, (now - t0) / 1200); el.textContent = `${prefix}${Math.round(target * (1 - Math.pow(1 - p, 3)))}${suffix}`; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
  };
  run(); window.addEventListener("scroll", run, { passive: true });
}

// Mobile sticky CTA: appears after the hero, hides near the final CTA / footer and while the modal is open
const mobileCta = document.querySelector("[data-mobile-cta]");
if (mobileCta) {
  const control = mobileCta.querySelector("button, a");
  const finalCta = document.querySelector(".final-cta, .site-footer");
  const update = () => {
    const pastHero = window.scrollY > Math.max(520, window.innerHeight * 0.85);
    const nearEnd = finalCta ? finalCta.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
    const show = pastHero && !nearEnd && !openState && matchMedia("(max-width: 640px)").matches;
    mobileCta.classList.toggle("is-visible", show);
    mobileCta.setAttribute("aria-hidden", show ? "false" : "true");
    if (control) control.tabIndex = show ? 0 : -1;
  };
  update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update, { passive: true });
  document.addEventListener("click", () => setTimeout(update, 260));
}

// Cursor glow on dark bands + 3D tilt on photo cards (pointer devices only)
if (matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".dark-section").forEach((band) => {
    band.addEventListener("pointermove", (ev) => { const r = band.getBoundingClientRect(); band.style.setProperty("--mx", `${ev.clientX - r.left}px`); band.style.setProperty("--my", `${ev.clientY - r.top}px`); });
  });
  document.querySelectorAll(".trust-photo, .about-photo, .sol-featured-photo, .mix-frame").forEach((card) => {
    if (reduceMotion) return;
    card.setAttribute("data-tilt-card", "");
    card.addEventListener("pointermove", (ev) => { const r = card.getBoundingClientRect(); const px = (ev.clientX - r.left) / r.width - .5; const py = (ev.clientY - r.top) / r.height - .5; card.style.transform = `perspective(1000px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg) translateY(-3px)`; });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

// Inner-page header: the outlined "ghost" page name drifts slightly with the scroll
const ghost = document.querySelector("[data-inner-hero] [data-ghost]");
if (ghost && !reduceMotion) {
  let ticking = false;
  const drift = () => { ghost.style.transform = `translateY(${Math.min(window.scrollY, 900) * 0.16}px)`; ticking = false; };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(drift); } }, { passive: true });
}

// Hero dot grid: light, cursor-reactive
const dotsCanvas = document.querySelector("[data-dots]");
if (dotsCanvas && !reduceMotion) {
  const ctx = dotsCanvas.getContext("2d");
  const host = dotsCanvas.parentElement;
  let w = 0, h = 0, dpr = 1, pts = [], mouse = { x: -1e4, y: -1e4 }, running = true;
  const isDark = () => root.dataset.theme === "dark";
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5); w = host.clientWidth; h = host.clientHeight;
    dotsCanvas.width = w * dpr; dotsCanvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gap = w < 700 ? 34 : 28; pts = [];
    for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) pts.push({ x, y, s: 0 });
  };
  const draw = () => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    const base = isDark() || host.hasAttribute("data-dark") ? "255,255,255" : "14,26,36";
    for (const p of pts) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      const target = d < 160 ? (1 - d / 160) : 0;
      p.s += (target - p.s) * 0.12;
      const r = 1 + p.s * 2.6, a = 0.08 + p.s * 0.55;
      ctx.beginPath();
      ctx.fillStyle = p.s > 0.05 ? `rgba(57,220,200,${a.toFixed(3)})` : `rgba(${base},0.10)`;
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  host.addEventListener("pointermove", (ev) => { const r = dotsCanvas.getBoundingClientRect(); mouse = { x: ev.clientX - r.left, y: ev.clientY - r.top }; });
  host.addEventListener("pointerleave", () => { mouse = { x: -1e4, y: -1e4 }; });
  new IntersectionObserver((en) => { const v = en.some((x) => x.isIntersecting); if (v && !running) { running = true; draw(); } if (!v) running = false; }).observe(host);
  window.addEventListener("resize", resize, { passive: true });
  resize(); draw();
}
