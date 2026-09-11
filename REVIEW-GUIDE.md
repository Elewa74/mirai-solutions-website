# Mirai Solutions Website — Review Guide / دليل المراجعة (v1.6)

**رابط المعاينة الأونلاين / Live preview:** https://elewa74.github.io/mirai-solutions-website/ (Arabic: `/ar/`) — نسخة ثابتة: الفحص الفوري وإرسال الفورم يعملان فقط في النسخة المستضافة على سيرفر Node.
**الكود / Code:** https://github.com/Elewa74/mirai-solutions-website

## تشغيل النسخة محليًا (دقيقة واحدة)
يحتاج Node.js 20 أو أحدث فقط — بلا تثبيت حزم ولا build.

```bash
node --test "tests/*.test.mjs"     # 28 اختبارًا
node scripts/preflight.mjs         # 253 فحصًا (SEO، رؤوس الأمان، الأصول، الصور، API) → _reports/preflight.md
node server.mjs                    # http://localhost:3000  (العربية: http://localhost:3000/ar)
```

وضع الإنتاج (رؤوس HSTS/الكاش): `NODE_ENV=production node server.mjs` — على PowerShell: `$env:NODE_ENV="production"; node server.mjs`.

## ما الذي نطلب مراجعته
1. **الشكل والهوية** — هل يعكس الموقع شركة قوية في بناء المواقع؟ (الهيرو، الصور، الألوان، التايبوغرافي، الحركة).
2. **المحتوى** — وضوح الرسالة لكل فئة (المصانع / سلاسل المتاجر / المنظمات)، وجودة العربية (ترجمة معنى لا ترجمة حرفية).
3. **التجربة على الموبايل** — كل الصفحات بالعربية والإنجليزية عند 375px.
4. **رحلة العميل** — من الرئيسية → فحص Mirai Lens → طلب المراجعة المجانية (`/audit`).
5. **الأداء والتقنية** — تقرير `_reports/preflight.md` بعد التشغيل، وLighthouse إن أمكن.

## خريطة الصفحات
`/` `/solutions` `/who-we-help` `/manufacturing` `/retail` `/ngo` `/work` `/about` `/audit` — ونفسها تحت `/ar/...`

## أين الأشياء
| ماذا | أين |
|---|---|
| النصوص (EN + AR) | `content/site-content.mjs`, `content/segments.mjs` |
| بناء الصفحات + SEO + الصور | `lib/render.mjs` |
| التصميم (توكنز الألوان والخطوط في الأعلى) | `public/site.css` |
| الحركة والتفاعل | `public/site.js` |
| الفحص الفوري Mirai Lens | `lib/scan.mjs` → `POST /api/scan` |
| فورم المراجعة (Resend + WhatsApp) | `lib/audit.mjs`, `lib/http.mjs` → `POST /api/audit` |
| الخادم والرؤوس الأمنية | `server.mjs` |
| الصور (WebP + JPG) | `public/images/` |
| الرفع | `deploy/` + `PRE-LAUNCH.md` |

## ملاحظات للمراجع
- الصور الحالية مولَّدة بالذكاء الاصطناعي كعناصر نائبة بجودة إطلاق؛ ستُستبدل بصور حقيقية عند توفرها.
- الثيم الفاتح هو الأساسي؛ زر الثيم في الهيدر يبدّل للداكن. `MIRAI_THEME=system` يجعل الموقع يتبع إعداد الجهاز.
- إرسال البريد وواتساب معطّلان محليًا حتى تُضبط متغيرات `.env` (انظر `deploy/env.production.example.txt`)؛ الفورم يتحقق ويعيد نجاحًا بدون إرسال.
- دراسة الحالة في `/work` بلا اسم عميل أو لقطات حقيقية عن قصد حتى تُعتمد للنشر.

---

## Quick start (English)
Node.js 20+ only — no dependencies, no build step.

```bash
node --test "tests/*.test.mjs"   # 28 tests
node scripts/preflight.mjs       # 253 pre-launch checks → _reports/preflight.md
node server.mjs                  # http://localhost:3000  (Arabic: /ar)
```

Please review: visual identity and craft (hero, photography, palette, typography, motion); message clarity per segment (manufacturers / retail chains / NGOs) and the quality of the Arabic (meaning-based, not literal); the mobile experience at 375px in both languages; the lead journey (home → Mirai Lens scan → `/audit`); and performance/technical health via `_reports/preflight.md` and Lighthouse if available.

Photos are AI-generated launch-quality placeholders to be replaced by real photography. Light theme is the default (`MIRAI_THEME=system` follows the device). Email/WhatsApp sending is disabled locally until `.env` is configured. The `/work` case study intentionally omits the client name and screenshots until approved for publication.
