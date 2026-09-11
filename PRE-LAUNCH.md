# Mirai Solutions — قائمة ما قبل الرفع (v1.5)

آخر فحص: 11 سبتمبر 2026 (v1.6) · `npm run check` → 28/28 اختبار · preflight 253 فحصًا · 0 FAIL

## ما تم التحقق منه آليًا (`npm run preflight`)
- الخادم يعمل في وضع الإنتاج ويجيب على `/health`.
- 18 مسارًا (9 إنجليزي + 9 عربي) ترجع 200، والمسار غير المعروف يرجع 404، والشرطة المائلة الزائدة تُحوَّل 301.
- SEO لكل صفحة: عنوان 20–70 حرفًا، وصف مخصص 80–170 حرفًا، H1 واحد، canonical، hreflang (en/ar/x-default)، Open Graph، JSON-LD صالح، كل الصور لها alt، lang/dir صحيحان، viewport، favicon، العنوان العربي يختلف عن الإنجليزي.
- الرؤوس الأمنية: CSP، nosniff، Referrer-Policy، X-Frame-Options، Permissions-Policy، HSTS (إنتاج فقط) — وضغط gzip/brotli.
- الأصول: CSS/JS/الشعار (WebP + PNG)/favicon/robots/sitemap (يشمل الـ 18 مسارًا مع hreflang).
- الصور: 28 ملفًا في `public/images` (WebP بمقاسين + JPG احتياطي) كلها تُقدَّم بنجاح، أكبر صورة ≤ 140 KB، كل صورة لها نص بديل بالعربية والإنجليزية وأبعاد ثابتة (بدون اهتزاز في التخطيط)، وصورة `og:image` لكل صفحة.
- الأداء: متوسط HTML 12 KB، عرض الخادم < 35 ms لكل صفحة.
- الـ API: الفحص الفوري يرفض localhost وعناوين IP الخام (حماية SSRF)، والفورم يتحقق من البريد.
- في المتصفح (وضع الإنتاج): لا أخطاء كونسول، الخطوط تُحمَّل تحت CSP، الفحص الفوري يعمل ويسلّم النتيجة لصفحة المراجعة، الفورم يُرسَل بنجاح بالعربية.

## ما تحتاجه أنت قبل الرفع (بالترتيب)
1. **الدومين `miraisolutions.net` (مسجَّل على NameSilo)** — `SITE_URL=https://miraisolutions.net` مضبوط بالفعل في `render.yaml` و`.env.example`. لربط الدومين بـ Render:
   - في Render: الخدمة → Settings → **Custom Domains** → Add `miraisolutions.net` ثم `www.miraisolutions.net`. سيعرض لك Render السجلات المطلوبة بالضبط.
   - في NameSilo: Domain Manager → الدومين → **DNS Records**: احذف سجلات الـ Parking (A/CNAME الافتراضية)، ثم أضف: سجل **A** للجذر (Hostname فارغ) → عنوان IP الذي يعرضه Render، وسجل **CNAME** للـ `www` → عنوان الخدمة `xxxx.onrender.com`. اترك TTL على الأقل.
   - انتظر التحقق (دقائق إلى ساعة). Render يصدر شهادة HTTPS تلقائيًا ويحوّل `www` إلى الجذر.
   - بعد أن يعمل الدومين: في Render → Environment غيّر `MIRAI_REDIRECT_TO_SITE_URL` إلى `1` حتى يتحوّل رابط `onrender.com` القديم تلقائيًا إلى `miraisolutions.net` (لا يوجد محتوى مكرر في محركات البحث).
2. **Resend** — أنشئ حسابًا على resend.com، أضف الدومين `miraisolutions.net` وتحقق منه (Resend يعرض سجلات TXT/MX للـ SPF وDKIM تضيفها في NameSilo بنفس شاشة DNS Records)، أنشئ API Key، ثم:
   - `RESEND_API_KEY=re_...`
   - `MIRAI_LEAD_EMAIL=` البريد الذي تصل إليه الطلبات
   - `MIRAI_FROM_EMAIL=Mirai Website <hello@miraisolutions.net>` (لا بد أن يكون على الدومين المتحقق منه)
3. **واتساب** — `MIRAI_WHATSAPP=2010XXXXXXXX` (أرقام فقط بالصيغة الدولية).
4. انسخ `deploy/env.production.example.txt` إلى `.env` على الخادم وعبّئ القيم. **لا ترفع `.env` إلى Git.**
5. شغّل `npm run check` مرة أخيرة بعد ضبط `.env` — يجب أن يختفي التحذير الوحيد المتبقي (env).

## معاينة عامة على GitHub Pages (بدون سيرفر)
الرابط الحالي: **https://elewa74.github.io/mirai-solutions-website/** (الريبو: github.com/Elewa74/mirai-solutions-website). كل push إلى `main` ينشر نسخة ثابتة تلقائيًا (`.github/workflows/pages.yml`). تُظهر كل الصفحات والتصميم، لكن الفحص الفوري وإرسال الفورم يحتاجان السيرفر (Render/VPS). لتحويلها إلى الدومين: Settings → Pages → Custom domain = `miraisolutions.net`، وفي NameSilo: أربعة سجلات A للجذر (185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153) وسجل CNAME للـ `www` → `elewa74.github.io`، ثم فعّل Enforce HTTPS.

## خيارات الرفع الكاملة (كلها بلا build step — Node 20+ فقط)
| الخيار | الملف | الخطوات |
|---|---|---|
| **Render** (الأسهل) | `render.yaml` في جذر المشروع | ادفع المشروع إلى GitHub → Render → New + → Blueprint → اختر الريبو → Apply. خطة Free كافية للمراجعة (تنام بعد 15 دقيقة خمول؛ ارفعها إلى Starter للإنتاج). `SITE_URL` غير مطلوب على Render حتى يكون لديك دومين (يستخدم `RENDER_EXTERNAL_URL` تلقائيًا). أضف الأسرار لاحقًا من تبويب Environment. HTTPS تلقائي. |
| **VPS** (Ubuntu) | `deploy/mirai.service` + `deploy/Caddyfile` | `apt install nodejs caddy` → انسخ المشروع إلى `/var/www/mirai` → `.env` → `systemctl enable --now mirai` → عدّل الدومين في Caddyfile → `systemctl reload caddy`. Caddy يصدر شهادة HTTPS تلقائيًا. |
| **Docker** | `deploy/Dockerfile` | `docker build -t mirai . && docker run -d -p 3000:3000 --env-file .env mirai` خلف أي reverse proxy. |

> ملاحظة: انسخ `deploy/Dockerfile` و `deploy/.dockerignore` إلى جذر المشروع قبل `docker build`.

## بعد الرفع (10 دقائق)
- افتح `https://domain/health` و `https://domain/sitemap.xml` و `/ar`.
- أرسل طلب مراجعة حقيقيًا وتأكد من وصول الإيميل ورابط واتساب.
- Google Search Console: أضف الدومين وأرسل `sitemap.xml`.
- Rich Results Test على الرئيسية (FAQPage + Organization).
- Lighthouse (اختياري): `npm run lighthouse` — يحتاج تحميل الحزمة مرة واحدة عبر npx.
- الصور الحالية مولَّدة بالذكاء الاصطناعي بطابع مصري/إقليمي — استبدلها بصور حقيقية للفريق والعملاء عند توفرها (نفس الأسماء في `public/images` مع تحديث `ASSET_VERSION` في `lib/render.mjs`)، وأضف دراسة الحالة المعتمدة.
- الثيم: الوضع الفاتح هو الأساسي لكل الزوار (`MIRAI_THEME=light`). لو أردت اتباع إعداد الجهاز (فاتح/داكن) ضع `MIRAI_THEME=system` في `.env`.

## أوامر مفيدة
```
npm test              # الاختبارات
npm run preflight     # فحص ما قبل الرفع (يشغّل نسخة مؤقتة على :3999)
npm run preflight:live   # فحص نسخة تعمل على :3000
npm run start:prod    # تشغيل بالإنتاج مع .env
```
