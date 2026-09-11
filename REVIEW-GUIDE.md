# Mirai Solutions Website — Review Guide / دليل المراجعة (v2.0)

**الرابط الأونلاين / Live site:** https://miraisolutions.net/ (Arabic: https://miraisolutions.net/ar/) — GitHub Pages، نسخة ثابتة: نافذة الاستشارة ترسل بالبريد عبر FormSubmit (مع تنبيه واتساب لصاحب الموقع عند ضبطه)؛ لا يظهر رقم واتساب للزائر.
**الكود / Code:** https://github.com/Elewa74/mirai-solutions-website

## ما الذي يمثله الموقع
Mirai Solutions شركة حلول رقمية تقودها التقنية — ليست شركة مواقع فقط ولا «وكالة ذكاء اصطناعي». أربعة مجالات محددة: المواقع والحضور الرقمي (الأساسي)، أساسيات الهوية والمواد التعريفية، رقمنة المحتوى، والاستشارات الرقمية وتحسين سير العمل. الجمهور الأوسع الشركات الصغيرة والمتوسطة، مع تركيز أعمق على المصانع وسلاسل التجزئة والمنظمات. الخطوة التالية دائمًا: استشارة مجانية.

## تشغيل النسخة محليًا (دقيقة واحدة)
يحتاج Node.js 20 أو أحدث فقط — بلا تثبيت حزم ولا build.

```bash
npm test                 # 60 اختبارًا (اختبار المتصفح يعمل عند توفر Playwright)
npm run check            # الاختبارات + 164 فحصًا (المسارات، التحويلات، SEO، الرؤوس، الأصول، API) → _reports/preflight.md
node server.mjs          # http://localhost:3000  (العربية: http://localhost:3000/ar)
```

## ما الذي نطلب مراجعته
1. **التموضع** — هل يفهم الزائر الجديد أن Mirai تقدّم أربعة مجالات حلول (والمواقع في المقدمة) وليست شركة تصميم مواقع فقط؟ وهل واضح أن الذكاء الاصطناعي جزء من طريقة العمل لا خدمة؟
2. **المحتوى** — وضوح كل حل (المشكلة → كيف نساعد → المخرجات → لمن يناسب)، ووضوح الفئات (من نخدم)، وجودة العربية (عربية معاصرة طبيعية لا ترجمة حرفية).
3. **رحلة التحويل** — نافذة «اطلب استشارة مجانية» من الهيدر والهيرو وكل حل والنهاية: سهولة التعبئة، وضوح رسالة «تم إرسال طلبك» ورسالة واتساب المجهّزة، الوصول بلوحة المفاتيح (Tab/Esc)، والتجربة على الموبايل.
4. **الشكل والهوية** — الحفاظ على الاتجاه البصري (التايبوغرافي التحريري، الفراغات، التدرج اللوني، البند الداكن الواحد، الحركة الهادئة) في الفاتح والداكن.
5. **الموبايل** — كل الصفحات بالعربية والإنجليزية عند 375px.
6. **الأداء والتقنية** — تقرير `_reports/preflight.md` بعد التشغيل، وLighthouse إن أمكن.

## خريطة الصفحات
`/` `/solutions` `/who-we-help` `/about` — ونفسها تحت `/ar/...`
الروابط القديمة (`/work` `/audit` `/manufacturing` `/retail` `/ngo`) تحوّل تلقائيًا إلى وجهاتها الجديدة.

## أين الأشياء
| ماذا | أين |
|---|---|
| النصوص (EN + AR) + بيانات الحلول والفورم | `content/site-content.mjs` |
| الجهات التي عملنا معها (حقيقية فقط) | `content/organizations.mjs` |
| بناء الصفحات + نافذة الاستشارة + SEO | `lib/render.mjs` |
| التحقق من الطلب + رسالة واتساب + البريد | `lib/consultation.mjs`, `lib/consultation-email.mjs`, `lib/http.mjs` → `POST /api/consultation` |
| التصميم (التوكنز في الأعلى) | `public/site.css` |
| الحركة + سلوك النافذة (سيرفر/ثابت) | `public/site.js` |
| الخادم والرؤوس الأمنية والتحويلات | `server.mjs` |
| التصدير الثابت لـ GitHub Pages | `scripts/export-static.mjs` |
| الصور (WebP + JPG) | `public/images/` |
| الرفع | `deploy/` + `PRE-LAUNCH.md` |

## ملاحظات للمراجع
- الصور الحالية مولَّدة بالذكاء الاصطناعي كعناصر نائبة بجودة إطلاق؛ ستُستبدل بصور حقيقية.
- الثيم الفاتح هو الأساسي؛ زر الثيم في الهيدر يبدّل للداكن.
- قسم «جهات عملنا معها» يظهر فقط بعد إضافة جهات حقيقية في `content/organizations.mjs` — لا أسماء ولا شعارات مخترعة، ولا دراسات حالة أو شهادات أو أرقام غير موثقة.
- «+12 عامًا» تشير إلى الخبرة التي تقف خلف Mirai، لا إلى عمر الشركة.

---

## Quick start (English)
Node.js 20+ only — no dependencies, no build step.

```bash
npm test          # 60 tests (the browser test runs when Playwright is available)
npm run check     # tests + 164 preflight checks → _reports/preflight.md
node server.mjs   # http://localhost:3000  (Arabic: /ar)
```

Please review: positioning (four solution areas with websites as the flagship, AI as a way of working rather than a service); message clarity per solution and per audience and the quality of the Arabic; the consultation flow (modal from header/hero/solutions/final CTA, keyboard access, the pre-filled WhatsApp message, mobile experience); visual consistency in light and dark; the mobile experience at 375px in both languages; and technical health via `_reports/preflight.md` and Lighthouse if available.

Photos are AI-generated placeholders. Light theme is the default. The "Organizations we've worked with" section appears only once real organizations are added to `content/organizations.mjs` — no invented clients, case studies, testimonials or metrics. "12+ years" refers to the experience behind Mirai, not the company's age. Legacy URLs (`/work`, `/audit`, sector pages) redirect to their new homes.
