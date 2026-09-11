import { nextTheme, resolveTheme } from "/theme.mjs";

const root = document.documentElement;
const locale = document.body.dataset.locale || "en";
// Static export (GitHub Pages): no API — Lens falls back to the audit page, the audit form shows a preview notice.
const STATIC = document.body.dataset.static === "1";
const BASE = document.body.dataset.base || "";

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

document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
  applyTheme(nextTheme(root.dataset.theme || "light"), true);
});

const menuButton = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  if (mobileNav) mobileNav.hidden = open;
});

const FIELD_ERRORS = {
  ar: { Required: { name: "اكتب اسمك حتى نعرف مع من نتحدث.", company: "اكتب اسم الشركة أو المؤسسة.", businessType: "اختر نوع النشاط الأقرب لعملك.", improvementGoal: "أخبرنا بجملة واحدة ما الذي تريد تحسينه.", email: "نحتاج بريدًا إلكترونيًا لإرسال المراجعة.", whatsapp: "أدخل رقم واتساب للمتابعة." },
        "Invalid email": "البريد الإلكتروني غير صحيح — مثال: name@company.com", "Invalid URL": "أدخل رابطًا كاملًا يبدأ بـ https://", "Invalid WhatsApp number": "أدخل الرقم بالصيغة الدولية — مثال: +2010XXXXXXXX" },
  en: { Required: { name: "Tell us your name so we know who we're talking to.", company: "Add your company or organization name.", businessType: "Pick the closest business type.", improvementGoal: "One sentence on what you want to improve is enough.", email: "We need an email to send the audit to.", whatsapp: "Add a WhatsApp number for follow-up." },
        "Invalid email": "That email doesn't look right — e.g. name@company.com", "Invalid URL": "Enter a full address starting with https://", "Invalid WhatsApp number": "Use the international format — e.g. +2010XXXXXXXX" }
};
function fieldError(field, code) {
  const dict = FIELD_ERRORS[locale] || FIELD_ERRORS.en;
  if (code === "Required") return dict.Required[field] || (locale === "ar" ? "هذا الحقل مطلوب." : "This field is required.");
  return dict[code] || code;
}

const form = document.querySelector("[data-audit-form]");
if (form && STATIC) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.querySelector("[data-form-message]");
    if (message) message.textContent = locale === "ar"
      ? "هذه نسخة معاينة ثابتة — الطلب لا يُرسل من هنا. على الموقع الفعلي يصل الطلب إلى Mirai بالبريد ورابط واتساب فورًا."
      : "This is a static preview — the request isn't sent from here. On the live site it reaches Mirai by email with a WhatsApp link instantly.";
    message?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}
if (form && !STATIC) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button[type='submit']");
    const message = form.querySelector("[data-form-message]");
    const success = form.querySelector("[data-success-panel]");
    const whatsApp = form.querySelector("[data-whatsapp-link]");
    const data = Object.fromEntries(new FormData(form).entries());

    form.querySelectorAll("[data-error-for]").forEach((node) => { node.textContent = ""; });
    if (message) message.textContent = "";
    if (success) success.hidden = true;
    submit?.setAttribute("disabled", "");

    try {
      const response = await fetch(`${BASE}/api/audit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, locale })
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        if (result.errors) {
          for (const [field, error] of Object.entries(result.errors)) {
            const node = form.querySelector(`[data-error-for="${CSS.escape(field)}"]`);
            if (node) node.textContent = fieldError(field, error);
          }
        }
        if (message) message.textContent = result.message || (locale === "ar" ? "راجع البيانات وحاول مرة أخرى." : "Please review the form and try again.");
        return;
      }
      form.querySelector(".field-grid")?.setAttribute("hidden", "");
      form.querySelector(".form-privacy")?.setAttribute("hidden", "");
      submit?.setAttribute("hidden", "");
      if (result.whatsappHref && whatsApp) {
        whatsApp.href = result.whatsappHref;
      } else if (whatsApp) {
        whatsApp.hidden = true;
      }
      if (success) success.hidden = false;
    } catch {
      if (message) message.textContent = locale === "ar" ? "تعذر إرسال الطلب الآن. حاول مرة أخرى." : "We couldn't submit the request right now. Please try again.";
    } finally {
      submit?.removeAttribute("disabled");
    }
  });
}

/* ============================================================
   Immersive interactions
   ============================================================ */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isRTL = document.documentElement.dir === "rtl";

// Sticky header state
const header = document.querySelector("[data-header]");
const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Scroll reveal
const revealTargets = document.querySelectorAll(".reveal, .section-heading, .problem-item, .audience-row, .flow-step, .work-frame, .why-list article, .audit-card, details, .final-cta-inner, .stage-row, .principle-grid article, .case-columns article, .about-story, .trust-grid");
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
      let changed = false;
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); pending.delete(entry.target); io.unobserve(entry.target); changed = true; } });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    pending.forEach((el) => io.observe(el));
  }
  // safety net: never leave content hidden
  setTimeout(() => revealAll.forEach((el) => el.classList.add("is-visible")), 6000);
} else {
  revealAll.forEach((el) => el.classList.add("is-visible"));
}

// Hero: sector demo tabs (auto-cycle + click)
const stage = document.querySelector("[data-hero-stage]");
if (stage) {
  const tabs = [...stage.querySelectorAll("[data-demo-tab]")];
  const glider = stage.querySelector(".demo-tab-glider");
  let index = 0;
  let timer = null;

  const moveGlider = () => {
    const tab = tabs[index];
    if (!tab || !glider) return;
    const parentRect = tab.parentElement.getBoundingClientRect();
    const rect = tab.getBoundingClientRect();
    const start = isRTL ? parentRect.right - rect.right : rect.left - parentRect.left;
    glider.style.insetInlineStart = `${start}px`;
    glider.style.width = `${rect.width}px`;
  };

  const activate = (i) => {
    index = (i + tabs.length) % tabs.length;
    const key = tabs[index].dataset.demoTab;
    tabs.forEach((t, n) => t.setAttribute("aria-selected", String(n === index)));
    stage.querySelectorAll("[data-demo-panel]").forEach((p) => p.toggleAttribute("data-active", p.dataset.demoPanel === key));
    stage.querySelectorAll("[data-demo-metric]").forEach((m) => m.toggleAttribute("data-active", m.dataset.demoMetric === key));
    moveGlider();
  };

  const schedule = () => {
    clearInterval(timer);
    if (reduceMotion) return;
    timer = setInterval(() => activate(index + 1), 4200);
  };

  tabs.forEach((tab, i) => tab.addEventListener("click", () => { activate(i); schedule(); }));
  stage.addEventListener("mouseenter", () => clearInterval(timer));
  stage.addEventListener("mouseleave", schedule);
  window.addEventListener("resize", moveGlider);
  document.fonts?.ready.then(moveGlider);
  activate(0);
  schedule();

  // 3D tilt
  const device = stage.querySelector("[data-tilt]");
  if (device && !reduceMotion && matchMedia("(pointer: fine)").matches) {
    let raf = 0;
    let target = { x: 0, y: 0 };
    const render = () => {
      device.style.transform = `rotateX(${target.y}deg) rotateY(${target.x}deg)`;
      raf = 0;
    };
    stage.addEventListener("pointermove", (ev) => {
      const r = stage.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width - 0.5;
      const py = (ev.clientY - r.top) / r.height - 0.5;
      target = { x: px * 14, y: -py * 12 };
      if (!raf) raf = requestAnimationFrame(render);
    });
    stage.addEventListener("pointerleave", () => { target = { x: 0, y: 0 }; device.style.transition = "transform .7s cubic-bezier(.2,.8,.2,1)"; render(); setTimeout(() => { device.style.transition = ""; }, 700); });
  }
}

// Magnetic CTA
document.querySelectorAll("[data-magnetic]").forEach((el) => {
  if (reduceMotion || !matchMedia("(pointer: fine)").matches) return;
  el.addEventListener("pointermove", (ev) => {
    const r = el.getBoundingClientRect();
    const x = (ev.clientX - r.left - r.width / 2) * 0.18;
    const y = (ev.clientY - r.top - r.height / 2) * 0.28;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener("pointerleave", () => { el.style.transform = ""; });
});

// Hero canvas: flowing particle field in brand colors
const canvas = document.querySelector("[data-hero-canvas]");
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  const colors = ["142,233,140", "57,220,200", "53,168,255", "111,240,220"];
  let w = 0, h = 0, dpr = 1, particles = [], mouse = { x: -9999, y: -9999 }, t = 0, running = true;
  const aurora = document.createElement("canvas");
  const actx = aurora.getContext("2d");

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    aurora.width = Math.max(64, Math.round(w / 8)); aurora.height = Math.max(48, Math.round(h / 8));
    const count = Math.round(Math.min(160, (w * h) / 11000));
    particles = Array.from({ length: count }, () => spawn(true));
  };
  const spawn = (anywhere) => ({
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : h + 10,
    r: Math.random() * 1.6 + .4,
    s: Math.random() * .35 + .15,
    c: colors[Math.floor(Math.random() * colors.length)],
    a: Math.random() * .6 + .2,
    o: Math.random() * Math.PI * 2
  });
  const field = (x, y, time) => {
    const nx = x / w, ny = y / h;
    return Math.sin(nx * 4.2 + time * .35) * Math.cos(ny * 3.1 - time * .22) * 1.6;
  };
  const draw = () => {
    if (!running) return;
    t += 0.008;
    ctx.clearRect(0, 0, w, h);
    // aurora blobs: rendered on a small offscreen canvas then upscaled (cheap)
    const sw = aurora.width, sh = aurora.height, sc = sw / w;
    actx.clearRect(0, 0, sw, sh);
    const blobs = [
      [0.12 + Math.sin(t * .6) * .06, 0.1 + Math.cos(t * .5) * .08, .55, "53,168,255", .34],
      [0.88 + Math.cos(t * .45) * .05, 0.15 + Math.sin(t * .7) * .1, .42, "57,220,200", .3],
      [0.68 + Math.sin(t * .35) * .08, 1.02 + Math.cos(t * .4) * .06, .4, "142,233,140", .2]
    ];
    for (const [bx, by, br, col, al] of blobs) {
      const x = bx * sw, y = by * sh, r = Math.max(sw, sh) * br;
      const g = actx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${col},${al})`);
      g.addColorStop(.45, `rgba(${col},${(al * .35).toFixed(3)})`);
      g.addColorStop(1, `rgba(${col},0)`);
      actx.fillStyle = g;
      actx.fillRect(0, 0, sw, sh);
    }
    ctx.drawImage(aurora, 0, 0, w, h);
    // grid
    ctx.strokeStyle = "rgba(255,255,255,0.035)";
    ctx.lineWidth = 1;
    const gap = 72, off = (t * 14) % gap;
    ctx.beginPath();
    for (let x = -gap + off; x < w + gap; x += gap) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = -gap + off; y < h + gap; y += gap) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
    // particles
    for (const p of particles) {
      const ang = field(p.x, p.y, t) + p.o * .1;
      p.x += Math.cos(ang) * p.s * 1.6;
      p.y -= p.s * 1.1 + Math.sin(ang) * .3;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 22000) { const f = (1 - d2 / 22000) * 2.2; p.x += dx / Math.sqrt(d2 + 1) * f; p.y += dy / Math.sqrt(d2 + 1) * f; }
      if (p.y < -10 || p.x < -10 || p.x > w + 10) Object.assign(p, spawn(false));
      const tw = .55 + Math.sin(t * 3 + p.o) * .45;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.c},${(p.a * tw).toFixed(3)})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    // connections near cursor
    ctx.lineWidth = .6;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm > 180) continue;
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 110) {
          ctx.strokeStyle = `rgba(111,240,220,${(0.22 * (1 - d / 110) * (1 - dm / 180)).toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  hero.addEventListener("pointermove", (ev) => { const r = canvas.getBoundingClientRect(); mouse = { x: ev.clientX - r.left, y: ev.clientY - r.top }; });
  hero.addEventListener("pointerleave", () => { mouse = { x: -9999, y: -9999 }; });
  new IntersectionObserver((entries) => {
    const visible = entries.some((en) => en.isIntersecting);
    if (visible && !running) { running = true; draw(); }
    if (!visible) running = false;
  }).observe(hero);
  window.addEventListener("resize", resize, { passive: true });
  resize();
  draw();
}

/* ============================================================
   Mirai Lens — instant scan
   ============================================================ */
const scanForm = document.querySelector("[data-scan-form]");
const scanResult = document.querySelector("[data-scan-result]");
const SCAN_KEY = "mirai-last-scan";
const L = (obj) => (obj && typeof obj === "object" ? obj[locale] || obj.en : obj);

function scanCopy() {
  // copy lives in the DOM (server-rendered) so the client has no duplicate dictionary
  const btn = scanForm?.querySelector("[data-scan-label]");
  return {
    button: btn?.textContent || "Scan",
    scanning: locale === "ar" ? "نقرأ موقعك…" : "Reading your site…",
    resultTitle: locale === "ar" ? "درجة الحضور الرقمي" : "Digital presence score",
    checksTitle: locale === "ar" ? "عشرة فحوصات من منظور العمل" : "10 business-first checks",
    weakest: locale === "ar" ? "ابدأ من هنا" : "Start here",
    cta: locale === "ar" ? "اطلب المراجعة الكاملة المجانية لهذا الموقع" : "Get the full free audit for this site",
    again: locale === "ar" ? "افحص موقعًا آخر" : "Scan another site",
    why: locale === "ar" ? "ماذا يعني هذا؟" : "What does this mean?",
    outOf: locale === "ar" ? "من 100" : "out of 100",
    meta: (m) => locale === "ar"
      ? `${m.words} كلمة · ${(m.bytes / 1024).toFixed(0)} KB · استجابة ${m.ttfb} ms${m.builder ? ` · مبني بـ ${m.builder}` : ""}`
      : `${m.words} words · ${(m.bytes / 1024).toFixed(0)} KB · ${m.ttfb} ms to first byte${m.builder ? ` · built with ${m.builder}` : ""}`,
    disclaimer: locale === "ar"
      ? "فحص آلي للصفحة الرئيسية فقط، يقيس إشارات قابلة للقياس: الوضوح، ودعوات التحرّك، والموبايل، والسرعة، واللغة، والبحث. المراجعة الكاملة تضيف قراءة بشرية لطبيعة عملك ورحلة عميلك."
      : "Automated scan of the home page only, measuring observable signals (clarity, CTAs, mobile, speed, language, search…). The full audit adds a human review of your business model and customer journey.",
    errors: {
      invalid_url: locale === "ar" ? "هذا لا يبدو عنوان موقع عام." : "That doesn't look like a public website address.",
      unreachable: locale === "ar" ? "لم نستطع الوصول للموقع. تأكد من العنوان وحاول مرة أخرى." : "We couldn't reach that site. Check the address and try again.",
      timeout: locale === "ar" ? "الموقع تأخر كثيرًا في الاستجابة — وهذه وحدها ملاحظة." : "The site took too long to respond — that alone is a finding.",
      not_html: locale === "ar" ? "هذا العنوان لا يعيد صفحة ويب." : "That address doesn't return a web page.",
      rate_limited: locale === "ar" ? "محاولات كثيرة من هذا الاتصال. حاول بعد دقيقة." : "Too many scans from this connection. Try again in a minute.",
      invalid_request: locale === "ar" ? "حدث خطأ. حاول مرة أخرى." : "Something went wrong. Please try again."
    }
  };
}

function esc(s) { return String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch])); }

function renderScan(report) {
  const c = scanCopy();
  const auditHref = BASE + (document.body.dataset.locale === "ar" ? "/ar/audit" : "/audit") + `?site=${encodeURIComponent(report.url)}&score=${report.total}`;
  const weak = new Set(report.weakest);
  const ordered = [...report.checks].sort((a, b) => (weak.has(b.key) - weak.has(a.key)) || a.score - b.score);
  scanResult.innerHTML = `
    <div class="score-side">
      <div class="score-host">${esc(report.host)}</div>
      <div class="ring">
        <svg viewBox="0 0 190 190" aria-hidden="true"><defs><linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8ee98c"/><stop offset=".55" stop-color="#39dcc8"/><stop offset="1" stop-color="#35a8ff"/></linearGradient></defs><circle class="track" cx="95" cy="95" r="85"/><circle class="bar" data-ring cx="95" cy="95" r="85"/></svg>
        <div class="num"><b data-count-to="${report.total}">0</b><span>${esc(c.outOf)}</span></div>
      </div>
      <div class="score-grade">${esc(L(report.grade))}</div>
      <div class="score-meta">${esc(c.meta(report.meta))}</div>
      <a class="button" href="${auditHref}">${esc(c.cta)} <span aria-hidden="true">${isRTL ? "←" : "→"}</span></a>
      <button class="text-button" type="button" data-scan-again>${esc(c.again)}</button>
    </div>
    <div class="checks-side">
      <div class="checks-head"><h3>${esc(c.checksTitle)}</h3><span>${esc(c.resultTitle)}: ${report.total}/100</span></div>
      ${ordered.map((ch) => `<div class="check ${weak.has(ch.key) ? "is-weak" : ""}">
        <div class="check-score ${ch.status}">${ch.score}</div>
        <div><h4>${esc(L(ch.label))}${weak.has(ch.key) ? `<span class="weak-tag">${esc(c.weakest)}</span>` : ""}</h4><p>${esc(L(ch.detail))}</p><details><summary>${esc(c.why)}</summary><p class="advice">${esc(L(ch.advice))}</p></details></div>
      </div>`).join("")}
    </div>
    <p class="disclaimer">${esc(c.disclaimer)}</p>`;
  scanResult.hidden = false;
  requestAnimationFrame(() => {
    const ring = scanResult.querySelector("[data-ring]");
    if (ring) ring.style.strokeDashoffset = String(534 - (534 * report.total) / 100);
    const num = scanResult.querySelector("[data-count-to]");
    if (num) {
      const target = Number(num.dataset.countTo); const start = performance.now();
      const step = (now) => { const p = Math.min(1, (now - start) / 1300); num.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
    scanResult.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
  scanResult.querySelector("[data-scan-again]")?.addEventListener("click", () => {
    scanResult.hidden = true; scanResult.innerHTML = "";
    const input = scanForm.querySelector("input"); input.value = ""; input.focus();
    scanForm.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  });
}

if (scanForm && scanResult && !STATIC) {
  const input = scanForm.querySelector("input[name='site']");
  const label = scanForm.querySelector("[data-scan-label]");
  const errorEl = scanForm.querySelector("[data-scan-error]");
  const c = scanCopy();
  scanForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = input.value.trim().replace(/^https?:\/\//i, "");
    errorEl.textContent = "";
    if (!value) { input.focus(); return; }
    scanForm.classList.add("is-busy"); label.textContent = c.scanning;
    try {
      const res = await fetch(`${BASE}/api/scan`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: value }) });
      const data = await res.json();
      if (!data.ok) { errorEl.textContent = c.errors[data.error] || c.errors.invalid_request; return; }
      try { sessionStorage.setItem(SCAN_KEY, JSON.stringify({ url: data.report.url, total: data.report.total, weakest: data.report.weakest })); } catch {}
      renderScan(data.report);
    } catch {
      errorEl.textContent = c.errors.unreachable;
    } finally {
      scanForm.classList.remove("is-busy"); label.textContent = c.button;
    }
  });
}

// Audit page: prefill from scan hand-off
if (form) {
  const params = new URLSearchParams(location.search);
  const site = params.get("site");
  const score = params.get("score");
  const website = form.querySelector("input[name='website']");
  const scoreField = form.querySelector("[data-scan-score]");
  let last = null; try { last = JSON.parse(sessionStorage.getItem(SCAN_KEY) || "null"); } catch {}
  if (website && !website.value) website.value = site || last?.url || "";
  if (scoreField) scoreField.value = score || (last?.total != null ? String(last.total) : "");
  if ((site || last) && website?.value) {
    const note = document.createElement("p");
    note.className = "scan-handoff";
    const s = score || last?.total;
    note.textContent = s != null
      ? (locale === "ar" ? `تم ربط نتيجة الفحص الفوري (${s}/100) بهذا الطلب — سنبدأ من نقاط الضعف التي ظهرت.` : `Your instant scan result (${s}/100) is attached to this request — we'll start from the gaps it surfaced.`)
      : (locale === "ar" ? `سنبدأ المراجعة من موقعك الحالي: ${website.value}` : `We'll start the review from your current site: ${website.value}`);
    form.prepend(note);
  }
}

/* ============================================================
   Hero v3 — before/after compare
   ============================================================ */
const compare = document.querySelector("[data-compare]");
if (compare) {
  const frame = compare.querySelector("[data-compare-frame]");
  const handle = compare.querySelector("[data-compare-handle]");
  const tabs = [...compare.querySelectorAll("[data-compare-tab]")];
  let split = 55, dragging = false, raf = 0, sweepTimer = null;

  const setSplit = (v, announce = true) => {
    split = Math.max(4, Math.min(96, v));
    frame.style.setProperty("--split", `${split}%`);
    if (announce) handle.setAttribute("aria-valuenow", String(Math.round(split)));
  };
  const fromEvent = (ev) => {
    const r = frame.getBoundingClientRect();
    return ((ev.clientX - r.left) / r.width) * 100;
  };
  const stopSweep = () => { if (sweepTimer) { cancelAnimationFrame(sweepTimer); sweepTimer = null; } };

  handle.addEventListener("pointerdown", (ev) => { dragging = true; stopSweep(); handle.setPointerCapture(ev.pointerId); });
  frame.addEventListener("pointerdown", (ev) => { if (ev.target.closest("[data-compare-handle]")) return; stopSweep(); setSplit(fromEvent(ev)); });
  window.addEventListener("pointermove", (ev) => {
    if (!dragging) return;
    if (!raf) raf = requestAnimationFrame(() => { setSplit(fromEvent(ev)); raf = 0; });
  });
  window.addEventListener("pointerup", () => { dragging = false; });
  handle.addEventListener("keydown", (ev) => {
    const step = ev.shiftKey ? 10 : 3;
    if (ev.key === "ArrowLeft") { stopSweep(); setSplit(split - step); ev.preventDefault(); }
    if (ev.key === "ArrowRight") { stopSweep(); setSplit(split + step); ev.preventDefault(); }
    if (ev.key === "Home") { stopSweep(); setSplit(4); ev.preventDefault(); }
    if (ev.key === "End") { stopSweep(); setSplit(96); ev.preventDefault(); }
  });

  // intro sweep: reveal the "after" side, then settle
  if (!reduceMotion) {
    const start = performance.now(); const from = 92, to = 55, dur = 2200, delay = 900;
    setSplit(from, false);
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start - delay) / dur));
      const eased = 1 - Math.pow(1 - t, 3);
      setSplit(from + (to - from) * eased, false);
      if (t < 1) sweepTimer = requestAnimationFrame(tick); else { sweepTimer = null; handle.setAttribute("aria-valuenow", "55"); }
    };
    sweepTimer = requestAnimationFrame(tick);
  }

  // sector tabs (after side) with auto-cycle
  let idx = 0, cycle = null;
  const activate = (i) => {
    idx = (i + tabs.length) % tabs.length;
    const key = tabs[idx].dataset.compareTab;
    tabs.forEach((t, n) => t.setAttribute("aria-selected", String(n === idx)));
    compare.querySelectorAll("[data-compare-panel]").forEach((p) => p.toggleAttribute("data-active", p.dataset.comparePanel === key));
  };
  const schedule = () => { clearInterval(cycle); if (!reduceMotion) cycle = setInterval(() => activate(idx + 1), 5200); };
  tabs.forEach((t, i) => t.addEventListener("click", () => { activate(i); schedule(); }));
  compare.addEventListener("pointerenter", () => clearInterval(cycle));
  compare.addEventListener("pointerleave", schedule);
  activate(0); schedule();
}

/* ============================================================
   Hero v4 — rotating word + ring nodes; demo section tabs
   ============================================================ */
const rotator = document.querySelector("[data-rotator]");
if (rotator) {
  const words = [...rotator.querySelectorAll(".rw")];
  const nodes = [...document.querySelectorAll("[data-ring-node]")];
  let i = 0;
  const go = () => {
    const cur = words[i]; i = (i + 1) % words.length; const next = words[i];
    cur.classList.add("leaving"); cur.removeAttribute("data-active");
    setTimeout(() => cur.classList.remove("leaving"), 600);
    next.setAttribute("data-active", "");
    fit();
    // segment words light one node; the generic word ("business") lights all three
    nodes.forEach((n, k) => n.toggleAttribute("data-active", i >= nodes.length || k === i));
  };
  // the rotator's width follows the active word so the sentence never shows a gap (matters in Arabic, where the word sits mid-line)
  const fit = () => { const a = words.find((w) => w.hasAttribute("data-active")); if (a) rotator.style.width = `${Math.ceil(a.getBoundingClientRect().width) + 1}px`; };
  fit(); document.fonts?.ready.then(fit); window.addEventListener("resize", fit, { passive: true });
  if (!reduceMotion) setInterval(go, 2600);
}
const demoFrame = document.querySelector("[data-demo-frame]");
if (demoFrame) {
  const tabs = [...document.querySelectorAll("[data-demo-tab]")];
  let idx = 0, cycle = null;
  const activate = (n) => {
    idx = (n + tabs.length) % tabs.length; const key = tabs[idx].dataset.demoTab;
    tabs.forEach((t, k) => t.setAttribute("aria-selected", String(k === idx)));
    demoFrame.querySelectorAll("[data-demo-panel]").forEach((p) => p.toggleAttribute("data-active", p.dataset.demoPanel === key));
  };
  const schedule = () => { clearInterval(cycle); if (!reduceMotion) cycle = setInterval(() => activate(idx + 1), 4800); };
  tabs.forEach((t, n) => t.addEventListener("click", () => { activate(n); schedule(); }));
  demoFrame.closest(".demo-section")?.addEventListener("pointerenter", () => clearInterval(cycle));
  demoFrame.closest(".demo-section")?.addEventListener("pointerleave", schedule);
  activate(0); schedule();
}

/* ============================================================
   Motion layer v1.5
   ============================================================ */
// scroll progress bar
const progress = document.querySelector("[data-progress]");
if (progress) {
  const upd = () => { const h = document.documentElement; const max = h.scrollHeight - h.clientHeight; progress.style.transform = `scaleX(${max > 0 ? Math.min(1, h.scrollTop / max) : 0})`; };
  window.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd); upd();
}

// extend reveal to new element types (list items etc.) using the same visibility pass
if (!reduceMotion) {
  const extra = document.querySelectorAll(".need, .check-list li, .blueprint li, .includes li, .other-seg, .timeline-step, .dtab, .timeline");
  const pend = new Set(extra);
  const chk = () => {
    const vh = window.innerHeight;
    for (const el of pend) { const r = el.getBoundingClientRect(); if (r.top < vh * 0.94 && r.bottom > 0) { el.classList.add("is-visible"); pend.delete(el); } }
    if (!pend.size) { window.removeEventListener("scroll", chk); }
  };
  chk(); window.addEventListener("scroll", chk, { passive: true }); window.addEventListener("resize", chk, { passive: true });
  setTimeout(() => extra.forEach((el) => el.classList.add("is-visible")), 6000);
} else {
  document.querySelectorAll(".need, .check-list li, .blueprint li, .includes li, .other-seg, .timeline-step, .dtab, .timeline").forEach((el) => el.classList.add("is-visible"));
}

// animated counters (numbers in facts / stats)
if (!reduceMotion) {
  const nums = [...document.querySelectorAll(".hero-v3-facts b, .trust-facts b, .stat strong")].filter((el) => /^\+?\d+\+?$/.test(el.textContent.trim()));
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

// cursor glow on dark bands
if (matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".dark-section, .lens-band").forEach((band) => {
    band.addEventListener("pointermove", (ev) => { const r = band.getBoundingClientRect(); band.style.setProperty("--mx", `${ev.clientX - r.left}px`); band.style.setProperty("--my", `${ev.clientY - r.top}px`); });
  });
  // 3D tilt on cards
  document.querySelectorAll(".other-seg, .audit-card, .demo-frame, .trust-photo, .about-photo, .audit-photo").forEach((card) => {
    if (reduceMotion) return;
    card.setAttribute("data-tilt-card", "");
    card.addEventListener("pointermove", (ev) => { const r = card.getBoundingClientRect(); const px = (ev.clientX - r.left) / r.width - .5; const py = (ev.clientY - r.top) / r.height - .5; card.style.transform = `perspective(1000px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg) translateY(-3px)`; });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

// hero dot grid: light, cursor-reactive (adapted from the "interactive dot grid" pattern)
const dotsCanvas = document.querySelector("[data-dots]");
if (dotsCanvas && !reduceMotion) {
  const ctx = dotsCanvas.getContext("2d");
  const host = dotsCanvas.parentElement;
  let w = 0, h = 0, dpr = 1, pts = [], mouse = { x: -1e4, y: -1e4 }, running = true;
  const isDark = () => document.documentElement.dataset.theme === "dark";
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5); w = host.clientWidth; h = host.clientHeight;
    dotsCanvas.width = w * dpr; dotsCanvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gap = w < 700 ? 34 : 28; pts = [];
    for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) pts.push({ x, y, s: 0 });
  };
  const draw = () => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    const base = isDark() ? "255,255,255" : "14,26,36";
    for (const p of pts) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      const target = d < 160 ? (1 - d / 160) : 0;
      p.s += (target - p.s) * 0.12;
      const r = 1 + p.s * 2.6, a = 0.08 + p.s * 0.55;
      ctx.beginPath();
      ctx.fillStyle = p.s > 0.05 ? `rgba(57,220,200,${a.toFixed(3)})` : `rgba(${base},${(0.10).toFixed(2)})`;
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
