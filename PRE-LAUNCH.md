# Mirai Solutions — قائمة ما قبل الرفع (v2.0)

آخر فحص: 12 سبتمبر 2026 (v2.0 — إعادة التموضع) · `npm run check` → 60/60 اختبارًا (منها اختبار المتصفح) (+1 اختبار متصفح يعمل عند توفر Playwright) · preflight 164 فحصًا · 0 FAIL

## ما تغيّر في v2.0
- الموقع يقدّم Mirai كشركة حلول رقمية تقودها التقنية بأربعة مجالات (المواقع والحضور الرقمي — الأساسي، أساسيات الهوية والمواد التعريفية، رقمنة المحتوى، الاستشارات الرقمية وتحسين سير العمل). الذكاء الاصطناعي جزء من طريقة العمل لا خدمة.
- الصفحات العامة أربع فقط لكل لغة: `/` `/solutions` `/who-we-help` `/about` (+ `/ar/...`). صفحات `/work` و`/audit` والقطاعات أُزيلت وتحوّل تلقائيًا (301 على السيرفر، وصفحات تحويل `noindex` على GitHub Pages).
- **لا يوجد فاحص مواقع (Mirai Lens) ولا `/api/scan`** — أُزيل بالكامل من الواجهة والكود والاختبارات والتوثيق.
- التحويل الوحيد: نافذة «اطلب استشارة مجانية» على كل الصفحات (الهيدر، الهيرو، كل حل، النهاية، الفوتر، الشريط اللاصق على الموبايل). على السيرفر: `POST /api/consultation` → بريد عبر Resend + رابط واتساب. على GitHub Pages: تحقق في المتصفح ثم إرسال بالبريد عبر FormSubmit (متغيّر `MIRAI_FORM_ENDPOINT` + نسخة إلى `MIRAI_FORM_CC`) وتظهر رسالة «تم إرسال طلبك بنجاح» فقط عندما يؤكد الإرسال، مع بقاء زر واتساب بجانبها؛ وإن فشل الإرسال تظهر متابعة واتساب برسالة مجهّزة بكل البيانات — بلا رسالة «تم الإرسال» وهمية. بعد كل إرسال مؤكد يصل تنبيه واتساب لصاحب الموقع عبر `MIRAI_NOTIFY_URL` (CallMeBot).

## ما الذي تحقق منه preflight آليًا (`npm run preflight`)
- الخادم يعمل في وضع الإنتاج ويجيب على `/health`.
- 8 مسارات (4 إنجليزي + 4 عربي) ترجع 200، والمسار غير المعروف 404، والشرطة الزائدة 301، و10 روابط قديمة تحوّل 301 إلى وجهتها الصحيحة.
- SEO لكل صفحة: عنوان ووصف مخصصان، H1 واحد، canonical، hreflang (en/ar/x-default)، Open Graph، JSON-LD صالح (Organization + 4 Service + FAQPage)، كل الصور لها alt، lang/dir صحيحان، viewport، favicon، لا نص فاحص/مراجعة، لا روابط للصفحات المحذوفة، نافذة الاستشارة موجودة.
- الرؤوس الأمنية: CSP، nosniff، Referrer-Policy، X-Frame-Options، Permissions-Policy، HSTS (إنتاج فقط) — وضغط gzip/brotli.
- الأصول: CSS/JS/الشعار/الأيقونات/robots/sitemap (8 روابط فقط)، كل الصور تُقدَّم وأكبرها ≤ 140 KB.
- الـ API: `/api/scan` غير موجود (404)، `/api/consultation` يتحقق من البيانات ولا يدّعي إرسال بريد غير مُرسَل.

> ملاحظة: عنوانا `/who-we-help` و`/about` بطول 78 حرفًا (كما طُلب في المواصفة) فيظهران كتحذير WARN فقط.

## ما تحتاجه أنت قبل الإطلاق (بالترتيب)
1. **رقم واتساب** — هو قناة التواصل الحالية على النسخة الحية (GitHub Pages):
   - في GitHub: الريبو → Settings → Secrets and variables → Actions → **Variables** → New repository variable: `MIRAI_WHATSAPP` = الرقم بالصيغة الدولية أرقامًا فقط (مثال `2010XXXXXXXX`)، ثم أعد تشغيل الـ workflow (Actions → Deploy to GitHub Pages → Run workflow) أو ادفع أي commit.
   - بدون هذا المتغير تعرض النافذة الرسالة المجهّزة مع زر «انسخ الرسالة» بدل زر واتساب.
   - **البريد على النسخة الثابتة** — متغيّران آخران في المكان نفسه: `MIRAI_FORM_ENDPOINT` = `https://formsubmit.co/ajax/<بريدك>` و`MIRAI_FORM_CC` = بريد إضافي يستلم نسخة. عند أول طلب يصلك من FormSubmit بريد تفعيل بعنوان «Activate Form» — اضغط الرابط مرة واحدة، وبعدها تصل الطلبات تلقائيًا (تحقق من مجلد Junk أول مرة).
   - **تنبيه واتساب لك** — من رقم الواتساب أرسل رسالة `I allow callmebot to send me messages` إلى رقم CallMeBot (موجود في https://www.callmebot.com/blog/free-api-whatsapp-messages/) فيصلك apikey، ثم أضف المتغيّر `MIRAI_NOTIFY_URL` = `https://api.callmebot.com/whatsapp.php?phone=2010XXXXXXXX&apikey=<المفتاح>&text={text}` وأعد تشغيل الـ workflow. ملاحظة: المفتاح يظهر في كود الصفحة؛ يمكنك إبطاله في أي وقت بإعادة الاشتراك.
2. **الجهات التي عملنا معها** — أضف كل جهة حقيقية (بإذنها) في `content/organizations.mjs` بالاسم والرابط، وضع الشعار في `public/brand/orgs/` إن توفر (وإلا يظهر الاسم نصًا). القسم `#clients` لا يظهر على الرئيسية حتى تُضاف جهة واحدة على الأقل. لا تضف أسماء أو شعارات غير مؤكدة.
3. **البريد (عند رفع نسخة السيرفر على Render/VPS)** — Resend: أضف الدومين `miraisolutions.net` وتحقق منه (سجلات SPF/DKIM في NameSilo)، ثم في بيئة الخادم: `RESEND_API_KEY`، `MIRAI_LEAD_EMAIL`، `MIRAI_FROM_EMAIL=Mirai Website <hello@miraisolutions.net>`، و`MIRAI_WHATSAPP`. الفورم يبدأ الإرسال بالبريد تلقائيًا عبر `/api/consultation` من دون أي تغيير في الكود.
4. **الصور** — الصور الحالية مولَّدة بالذكاء الاصطناعي (فريق، مصنع، متجر، منظمة، مكتب، مراجعة). استبدلها بصور حقيقية بالأسماء نفسها في `public/images` (WebP 1600/800 + JPG 1200) مع تحديث `ASSET_VERSION` في `lib/render.mjs`.
5. شغّل `npm run check` بعد ضبط المتغيرات — يجب أن يختفي تحذير env.

## النسخة الحية على GitHub Pages
الموقع يعمل على **https://miraisolutions.net/** (الريبو: github.com/Elewa74/mirai-solutions-website؛ DNS في NameSilo: 4 سجلات A للجذر → GitHub + CNAME www → elewa74.github.io). كل push إلى `main` يشغّل الاختبارات ثم ينشر النسخة الثابتة (`.github/workflows/pages.yml`). النسخة الثابتة تعرض كل الصفحات والتصميم، ونافذة الاستشارة تعمل عبر واتساب؛ إرسال البريد يحتاج نسخة السيرفر.

## خيارات رفع نسخة السيرفر (بلا build step — Node 20+ فقط)
| الخيار | الملف | الخطوات |
|---|---|---|
| **Render** | `render.yaml` في جذر المشروع | New + → Blueprint → اختر الريبو → Apply. أضف الأسرار من تبويب Environment. HTTPS تلقائي. عند ربط الدومين: غيّر سجلات A في NameSilo إلى ما يعرضه Render، وأزل الدومين من إعدادات GitHub Pages، ثم `MIRAI_REDIRECT_TO_SITE_URL=1`. |
| **VPS** (Ubuntu) | `deploy/mirai.service` + `deploy/Caddyfile` | `apt install nodejs caddy` → انسخ المشروع إلى `/var/www/mirai` → `.env` → `systemctl enable --now mirai` → `systemctl reload caddy`. |
| **Docker** | `deploy/Dockerfile` | `docker build -t mirai . && docker run -d -p 3000:3000 --env-file .env mirai` خلف أي reverse proxy. |

## بعد الرفع (10 دقائق)
- افتح `/`، `/ar`، `/solutions`، `/sitemap.xml`، وجرّب رابطًا قديمًا مثل `/audit` (يجب أن يفتح الرئيسية ونافذة الاستشارة).
- أرسل طلب استشارة حقيقيًا وتأكد من وصول رسالة واتساب (وعلى السيرفر: البريد أيضًا).
- Google Search Console: أرسل `sitemap.xml` من جديد (8 روابط) — الروابط القديمة تحوّل 301 فلا حاجة لإجراء إضافي.
- Rich Results Test على الرئيسية (FAQPage + Organization + Service).

## أوامر مفيدة
```
npm test              # الاختبارات
npm run check         # الاختبارات + preflight (يشغّل نسخة مؤقتة على :3999)
npm run export        # تصدير النسخة الثابتة إلى dist/
npm run start:prod    # تشغيل بالإنتاج مع .env
```
