/**
 * Segment landing pages — the "who we work for" playbooks.
 * Each segment: ICP (this page is for you if…), what the buyer needs, page blueprint, primary actions,
 * common mistakes, what Mirai includes, and a segment-specific audit prompt.
 */
export const segments = {
  en: {
    intro: {
      kicker: "SEGMENT PLAYBOOKS",
      title: "One goal. Three very different websites.",
      body: "A factory, a retail chain and an NGO don't need the same website with different colors. Each playbook below starts from how that business actually wins."
    },
    items: {
      manufacturing: {
        slug: "/manufacturing",
        nav: "Manufacturing",
        kicker: "WEBSITES FOR MANUFACTURERS & INDUSTRIAL COMPANIES",
        title: "Make B2B buyers trust you before they ever call.",
        intro: "Industrial buyers, procurement teams and importers check your website before they shortlist you. It has to answer their questions in the order they ask them — capabilities, proof, then how to request a quotation.",
        icpTitle: "This page is for you if…",
        icp: [
          "You manufacture products or components and sell to other businesses, distributors or importers.",
          "Your sales cycle involves technical questions, samples, certifications or several decision-makers.",
          "You want more qualified RFQs — not more random enquiries.",
          "Your current website is a brochure from years ago, or you rely on a PDF profile sent over WhatsApp."
        ],
        needsTitle: "What your buyer needs to find in 30 seconds",
        needs: [
          { title: "What exactly you make", body: "Product families, specs, materials, tolerances and applications — structured so a buyer finds their category fast." },
          { title: "Proof you can deliver", body: "Capacity, machinery, quality process, certifications (ISO, CE, SASO…), export markets and years in operation." },
          { title: "Who you already serve", body: "Industries, notable clients, reference projects and the markets you export to." },
          { title: "How to request a quotation", body: "An RFQ form that asks the right technical questions, a downloadable catalog and a direct sales contact." }
        ],
        blueprintTitle: "Page blueprint",
        blueprint: ["Home: capabilities-led hero + RFQ", "Products / product families", "Capabilities & quality", "Certifications", "Industries served", "About & export markets", "Catalog download", "Request a Quotation"],
        actionsTitle: "Primary actions we design around",
        actions: ["Request a Quotation (RFQ)", "Download the catalog", "Talk to sales / WhatsApp Business", "Ask about a specification"],
        mistakesTitle: "What usually goes wrong",
        mistakes: [
          "A generic 'Welcome to our company' hero that says nothing about what you make.",
          "Certifications buried in an About page, or only visible as a scanned image.",
          "No English version for importers — or a literal translation nobody reviewed.",
          "Contact page only; no RFQ form, no catalog, no WhatsApp Business."
        ],
        includesTitle: "What Mirai includes",
        includes: ["Buyer-journey strategy and sitemap", "Product & capability content structuring", "Bilingual copy (Arabic / English) written for procurement", "RFQ form + catalog + WhatsApp Business flow", "Design and development, mobile-first", "Search & AI visibility setup (schema, metadata)"],
        auditTitle: "See how your factory looks to a buyer.",
        auditBody: "The free audit reviews your current presence through a procurement lens: clarity of offering, proof of capability, and how easy it is to request a quotation.",
        demo: { nav: ["Products", "Capabilities", "Certifications", "Industries", "RFQ"], hero: "Precision components for export markets", cta: "Request a Quotation", blocks: ["ISO 9001 · CE", "Capacity 120k units/mo", "Exporting to 14 markets"] }
      },
      retail: {
        slug: "/retail",
        nav: "Retail & Local Chains",
        kicker: "WEBSITES FOR RETAIL BRANDS & LOCAL CHAINS",
        title: "Make it effortless to find you, visit you, and order.",
        intro: "For stores, showrooms, cafés, restaurants and local brands, the website is a mobile-first decision tool: where is the nearest branch, what do you offer, how do I order right now.",
        icpTitle: "This page is for you if…",
        icp: [
          "You run one or more physical locations — stores, showrooms, branches, cafés or restaurants.",
          "Customers ask the same questions on Instagram and WhatsApp every day: location, hours, prices, delivery.",
          "You want the website to drive visits and orders, not just 'look nice'.",
          "You're opening new branches and need a presence that scales with you."
        ],
        needsTitle: "What your customer needs to find in 10 seconds",
        needs: [
          { title: "The nearest branch", body: "Branches with maps, hours, phone and directions — fast on mobile, in Arabic first." },
          { title: "What you offer", body: "Products, menu or collections with clear photos and prices where relevant." },
          { title: "Today's reason to act", body: "Offers, new arrivals or seasonal items placed where people actually look." },
          { title: "One tap to order", body: "WhatsApp ordering, delivery partners or a simple online order flow — whatever matches how you sell." }
        ],
        blueprintTitle: "Page blueprint",
        blueprint: ["Home: offer + nearest branch + order", "Products / menu / collections", "Branches with maps & hours", "Offers & new arrivals", "About the brand", "Order / delivery", "Franchise or wholesale (if relevant)", "Contact & WhatsApp"],
        actionsTitle: "Primary actions we design around",
        actions: ["Get directions to a branch", "Order on WhatsApp / delivery", "Browse the menu or collection", "Follow the brand"],
        mistakesTitle: "What usually goes wrong",
        mistakes: [
          "Branch information only exists on Google Maps and Instagram highlights.",
          "A desktop-first design when 90% of your customers are on their phones.",
          "Menus and prices as low-resolution images that can't be searched or updated.",
          "No clear order path — visitors leave to ask on WhatsApp anyway."
        ],
        includesTitle: "What Mirai includes",
        includes: ["Customer-journey strategy for visits and orders", "Branch / product content structure that grows with you", "Arabic-first, mobile-first design", "WhatsApp ordering & Google Maps integration", "Development with an easy way to update offers", "Local search setup (Google Business alignment, schema)"],
        auditTitle: "See how your brand looks to a customer on their phone.",
        auditBody: "The free audit reviews your presence the way a customer experiences it: can they find the branch, understand the offer, and order — in under a minute.",
        demo: { nav: ["Menu", "Branches", "Offers", "Order"], hero: "Find a branch. Order in one tap.", cta: "Order on WhatsApp", blocks: ["Nearest branch · 1.2 km", "Today's offer", "Delivery 30–45 min"] }
      },
      ngo: {
        slug: "/ngo",
        nav: "NGOs & Organizations",
        kicker: "WEBSITES FOR NGOS, FOUNDATIONS & ORGANIZATIONS",
        title: "Turn programs, reports and mission into one experience people trust.",
        intro: "Donors, partners, ministries and beneficiaries all arrive with different questions. The website has to make the mission clear, the programs legible, and the impact visible — then invite the right next step.",
        icpTitle: "This page is for you if…",
        icp: [
          "You run programs, initiatives or services and need to communicate them to partners, donors or the public.",
          "Your information lives across PDFs, presentations and social posts with no single clear home.",
          "You need to look credible to institutional partners, ministries and international funders.",
          "You want partnership and support enquiries to come through the website, not only through personal networks."
        ],
        needsTitle: "What your partner needs to find quickly",
        needs: [
          { title: "A clear mission", body: "Who you serve, what you change and where — in one paragraph anyone can repeat." },
          { title: "Legible programs", body: "Each program with its goal, audience, activities and results — not a list of names." },
          { title: "Visible impact", body: "Numbers, stories and reports presented honestly and consistently." },
          { title: "A way to partner", body: "Partnership, volunteering, donation or contact — matched to how your organization actually works." }
        ],
        blueprintTitle: "Page blueprint",
        blueprint: ["Home: mission + impact + partner", "Programs (one page each)", "Impact & stories", "Reports & publications", "Partners & governance", "About & team", "News / updates", "Partner with us / Contact"],
        actionsTitle: "Primary actions we design around",
        actions: ["Partner with us", "Download the annual report", "Donate or volunteer (when applicable)", "Contact a program lead"],
        mistakesTitle: "What usually goes wrong",
        mistakes: [
          "Mission statements that are long, abstract and impossible to remember.",
          "Programs as a single dense page — or a PDF.",
          "Reports scattered, unbranded and hard to find.",
          "Arabic and English versions that say different things."
        ],
        includesTitle: "What Mirai includes",
        includes: ["Message and content architecture workshop", "Program and impact content structuring", "Bilingual copy with consistent terminology", "Reports library and partner journey", "Accessible, mobile-first design and development", "Search visibility and social sharing setup"],
        auditTitle: "See how your organization looks to a potential partner.",
        auditBody: "The free audit reviews mission clarity, program legibility, trust signals and the partnership path — in both languages.",
        demo: { nav: ["Programs", "Impact", "Reports", "Partner"], hero: "One mission. Clear programs. Real impact.", cta: "Partner with us", blocks: ["Beneficiaries reached", "Annual report 2025", "Institutional partners"] }
      }
    }
  },
  ar: {
    intro: {
      kicker: "أدلة الشرائح",
      title: "هدف واحد. ثلاثة مواقع مختلفة تمامًا.",
      body: "المصنع وسلسلة المتاجر والمنظمة لا يحتاجون نفس الموقع بألوان مختلفة. كل دليل هنا يبدأ من الطريقة التي يكسب بها هذا النوع من العمل فعليًا."
    },
    items: {
      manufacturing: {
        slug: "/manufacturing",
        nav: "التصنيع",
        kicker: "مواقع للمصانع والشركات الصناعية",
        title: "اجعل المشتري الصناعي يثق بك قبل أن يتصل.",
        intro: "المشترون الصناعيون وفرق المشتريات والمستوردون يفحصون موقعك قبل أن يضعوك في القائمة المختصرة. الموقع لازم يجيب على أسئلتهم بالترتيب الذي يسألونها به: القدرات، ثم الإثبات، ثم كيف يطلبون عرض سعر.",
        icpTitle: "هذه الصفحة لك إذا…",
        icp: [
          "تصنّع منتجات أو مكونات وتبيع لشركات أو موزعين أو مستوردين.",
          "دورة البيع عندك فيها أسئلة فنية، عينات، شهادات، أو أكثر من متخذ قرار.",
          "تريد طلبات عروض أسعار جادّة أكثر — لا استفسارات عشوائية أكثر.",
          "موقعك الحالي بروشور من سنوات، أو تعتمد على ملف PDF يُرسَل عبر واتساب."
        ],
        needsTitle: "ما يحتاج المشتري أن يجده في 30 ثانية",
        needs: [
          { title: "ماذا تصنّع بالضبط", body: "عائلات المنتجات، المواصفات، الخامات، التفاوتات، والتطبيقات — مُهيكلة ليجد المشتري فئته بسرعة." },
          { title: "إثبات أنك تقدر تسلّم", body: "الطاقة الإنتاجية، الماكينات، إجراءات الجودة، الشهادات (ISO, CE, SASO…)، أسواق التصدير، وسنوات التشغيل." },
          { title: "لمن تخدم بالفعل", body: "الصناعات، العملاء البارزون، المشاريع المرجعية، والأسواق التي تصدّر لها." },
          { title: "كيف يطلب عرض سعر", body: "نموذج طلب عرض سعر يطرح الأسئلة الفنية الصحيحة، وكتالوج قابل للتحميل، وجهة اتصال مباشرة مع المبيعات." }
        ],
        blueprintTitle: "هيكل الصفحات",
        blueprint: ["الرئيسية: القدرات أولًا + طلب عرض سعر", "المنتجات / عائلات المنتجات", "القدرات والجودة", "الشهادات", "الصناعات التي نخدمها", "من نحن وأسواق التصدير", "تحميل الكتالوج", "طلب عرض سعر"],
        actionsTitle: "الإجراءات الأساسية التي نصمّم حولها",
        actions: ["طلب عرض سعر", "تحميل الكتالوج", "التحدث مع المبيعات / واتساب للأعمال", "الاستفسار عن مواصفة"],
        mistakesTitle: "ما يحدث خطأ عادةً",
        mistakes: [
          "هيرو عام «مرحبًا بكم في شركتنا» لا يقول شيئًا عمّا تصنّعه.",
          "الشهادات مدفونة في صفحة «من نحن» أو ظاهرة فقط كصورة ممسوحة.",
          "لا نسخة إنجليزية للمستوردين — أو ترجمة حرفية لم يراجعها أحد.",
          "صفحة «اتصل بنا» فقط؛ بلا نموذج لطلب عرض سعر، ولا كتالوج، ولا واتساب للأعمال."
        ],
        includesTitle: "ما تقدّمه Mirai",
        includes: ["استراتيجية رحلة المشتري وخريطة الموقع", "هيكلة محتوى المنتجات والقدرات", "نصوص ثنائية اللغة مكتوبة لفرق المشتريات", "نموذج طلب عرض سعر + كتالوج + مسار واتساب للأعمال", "تصميم وتطوير موبايل-أولاً", "إعداد الظهور في محركات البحث ومساعدي الذكاء الاصطناعي (البيانات المهيكلة والوصف)"],
        auditTitle: "شاهد كيف يبدو مصنعك في عين المشتري.",
        auditBody: "المراجعة المجانية تفحص حضورك الحالي من منظور فريق المشتريات: وضوح ما تقدّمه، إثبات القدرة، وسهولة طلب عرض السعر.",
        demo: { nav: ["المنتجات", "القدرات", "الشهادات", "الصناعات", "عرض سعر"], hero: "مكونات دقيقة لأسواق التصدير", cta: "اطلب عرض سعر", blocks: ["ISO 9001 · CE", "طاقة 120 ألف وحدة/شهر", "نصدّر إلى 14 سوقًا"] }
      },
      retail: {
        slug: "/retail",
        nav: "التجزئة والسلاسل المحلية",
        kicker: "مواقع لبراندات التجزئة والسلاسل المحلية",
        title: "اجعل العثور عليك وزيارتك والطلب منك بلا مجهود.",
        intro: "للمتاجر والمعارض والكافيهات والمطاعم والبراندات المحلية، الموقع أداة قرار على الموبايل: أين أقرب فرع، ماذا تقدّمون، وكيف أطلب الآن.",
        icpTitle: "هذه الصفحة لك إذا…",
        icp: [
          "تدير موقعًا فعليًا أو أكثر — متاجر، معارض، فروع، كافيهات أو مطاعم.",
          "العملاء يسألون نفس الأسئلة على إنستجرام وواتساب كل يوم: المكان، المواعيد، الأسعار، التوصيل.",
          "تريد أن يدفع الموقع الزيارات والطلبات، لا أن «يبدو جميلًا» فقط.",
          "تفتح فروعًا جديدة وتحتاج حضورًا ينمو معك."
        ],
        needsTitle: "ما يحتاج العميل أن يجده في 10 ثوانٍ",
        needs: [
          { title: "أقرب فرع", body: "الفروع بالخرائط والمواعيد والهاتف والاتجاهات — سريع على الموبايل، بالعربية أولاً." },
          { title: "ماذا تقدّم", body: "المنتجات أو القائمة أو المجموعات بصور واضحة وأسعار حيث يلزم." },
          { title: "سبب اليوم للتحرك", body: "العروض، الجديد، أو الموسمي في المكان الذي ينظر فيه الناس فعلًا." },
          { title: "ضغطة واحدة للطلب", body: "طلب عبر واتساب، شركاء التوصيل، أو مسار طلب أونلاين بسيط — حسب طريقة بيعك." }
        ],
        blueprintTitle: "هيكل الصفحات",
        blueprint: ["الرئيسية: العرض + أقرب فرع + اطلب", "المنتجات / القائمة / المجموعات", "الفروع بالخرائط والمواعيد", "العروض والجديد", "قصة البراند", "الطلب / التوصيل", "الامتياز أو الجملة (إن وُجد)", "التواصل وواتساب"],
        actionsTitle: "الإجراءات الأساسية التي نصمّم حولها",
        actions: ["الاتجاهات إلى فرع", "الطلب عبر واتساب / التوصيل", "تصفّح القائمة أو المجموعة", "متابعة البراند"],
        mistakesTitle: "ما يحدث خطأ عادةً",
        mistakes: [
          "معلومات الفروع موجودة فقط على خرائط Google وهايلايتس إنستجرام.",
          "تصميم للديسكتوب أولًا بينما 90% من عملائك على هواتفهم.",
          "القوائم والأسعار كصور منخفضة الدقة لا تُبحث ولا تُحدَّث.",
          "لا مسار طلب واضح — الزائر يخرج ليسأل على واتساب على أي حال."
        ],
        includesTitle: "ما تقدّمه Mirai",
        includes: ["استراتيجية رحلة العميل للزيارات والطلبات", "هيكل محتوى للفروع/المنتجات ينمو معك", "تصميم عربي-أولاً وموبايل-أولاً", "تكامل طلب واتساب وخرائط Google", "تطوير مع طريقة سهلة لتحديث العروض", "إعداد البحث المحلي (المواءمة مع ملف Google للأعمال والبيانات المهيكلة)"],
        auditTitle: "شاهد كيف يبدو براندك في عين عميل على هاتفه.",
        auditBody: "المراجعة المجانية تفحص حضورك كما يعيشه العميل: هل يجد الفرع، يفهم العرض، ويطلب — في أقل من دقيقة.",
        demo: { nav: ["القائمة", "الفروع", "العروض", "اطلب"], hero: "اعرف أقرب فرع. اطلب بضغطة واحدة.", cta: "اطلب عبر واتساب", blocks: ["أقرب فرع · 1.2 كم", "عرض اليوم", "توصيل 30–45 دقيقة"] }
      },
      ngo: {
        slug: "/ngo",
        nav: "المنظمات والمؤسسات",
        kicker: "مواقع للمنظمات غير الربحية والمؤسسات",
        title: "حوّل البرامج والتقارير والرسالة إلى تجربة واحدة يثق بها الناس.",
        intro: "المانحون والشركاء والوزارات والمستفيدون يأتون بأسئلة مختلفة. الموقع لازم يجعل الرسالة واضحة، والبرامج مقروءة، والأثر ظاهرًا — ثم يدعو للخطوة التالية الصحيحة.",
        icpTitle: "هذه الصفحة لك إذا…",
        icp: [
          "تدير برامج أو مبادرات أو خدمات وتحتاج أن توصلها لشركاء أو مانحين أو للجمهور.",
          "معلوماتك موزعة بين ملفات PDF وعروض تقديمية ومنشورات سوشيال بلا بيت واحد واضح.",
          "تحتاج أن تبدو موثوقًا أمام الشركاء المؤسسيين والوزارات والممولين الدوليين.",
          "تريد أن تأتي طلبات الشراكة والدعم من الموقع، لا فقط من الشبكات الشخصية."
        ],
        needsTitle: "ما يحتاج الشريك أن يجده بسرعة",
        needs: [
          { title: "رسالة واضحة", body: "من تخدم، وماذا تغيّر، وأين — في فقرة واحدة يستطيع أي شخص إعادتها." },
          { title: "برامج مقروءة", body: "كل برنامج بهدفه وجمهوره وأنشطته ونتائجه — لا قائمة أسماء." },
          { title: "أثر ظاهر", body: "أرقام وقصص وتقارير معروضة بصدق واتساق." },
          { title: "طريقة للشراكة", body: "شراكة، تطوّع، تبرع أو تواصل — بما يطابق طريقة عمل منظمتك فعلًا." }
        ],
        blueprintTitle: "هيكل الصفحات",
        blueprint: ["الرئيسية: الرسالة + الأثر + شراكة", "البرامج (صفحة لكل برنامج)", "الأثر والقصص", "التقارير والإصدارات", "الشركاء والحوكمة", "من نحن والفريق", "الأخبار / التحديثات", "كن شريكًا / تواصل"],
        actionsTitle: "الإجراءات الأساسية التي نصمّم حولها",
        actions: ["كن شريكًا معنا", "تحميل التقرير السنوي", "تبرّع أو تطوّع (عند الانطباق)", "التواصل مع مسؤول برنامج"],
        mistakesTitle: "ما يحدث خطأ عادةً",
        mistakes: [
          "بيانات رسالة طويلة ومجردة يستحيل تذكّرها.",
          "البرامج كصفحة واحدة مزدحمة — أو ملف PDF.",
          "تقارير متفرقة بلا هوية وصعبة الوصول.",
          "نسخة عربية ونسخة إنجليزية تقولان أشياء مختلفة."
        ],
        includesTitle: "ما تقدّمه Mirai",
        includes: ["ورشة الرسالة ومعمارية المحتوى", "هيكلة محتوى البرامج والأثر", "نصوص ثنائية اللغة بمصطلحات متسقة", "مكتبة التقارير ورحلة الشريك", "تصميم وتطوير يسهل الوصول إليه وموبايل-أولاً", "إعداد الظهور في البحث والمشاركة الاجتماعية"],
        auditTitle: "شاهد كيف تبدو منظمتك في عين شريك محتمل.",
        auditBody: "المراجعة المجانية تفحص وضوح الرسالة، مقروئية البرامج، إشارات الثقة، ومسار الشراكة — باللغتين.",
        demo: { nav: ["البرامج", "الأثر", "التقارير", "شراكة"], hero: "رسالة واحدة. برامج واضحة. أثر حقيقي.", cta: "كن شريكًا معنا", blocks: ["المستفيدون", "التقرير السنوي 2025", "شركاء مؤسسيون"] }
      }
    }
  }
};

export const segmentSlugs = ["/manufacturing", "/retail", "/ngo"];
export function segmentBySlug(slug, locale) {
  return Object.values(segments[locale].items).find((s) => s.slug === slug) || null;
}
