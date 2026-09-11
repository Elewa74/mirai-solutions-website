/**
 * Site copy for both locales. Shapes must match exactly (see tests/content.test.mjs).
 * Arabic is written as natural Modern Standard Arabic for Egypt/MENA business audiences — not a literal translation.
 */

const en = {
  nav: {
    items: [
      { label: "Solutions", href: "/solutions" },
      { label: "Who We Help", href: "/who-we-help" },
      { label: "About", href: "/about" }
    ],
    cta: "Get a Free Consultation",
    language: "AR",
    theme: "Theme",
    menu: "Menu"
  },
  global: {
    brandLine: "Practical digital solutions built around real business needs.",
    philosophy: "The future belongs to those who create it.",
    consultLabel: "Get a Free Consultation",
    consultShort: "Request a Consultation",
    talkLabel: "Talk to Mirai",
    discussLabel: "Discuss this solution",
    exploreLabel: "Explore Our Solutions",
    flagship: "Flagship solution"
  },
  meta: {
    "/": { title: "Mirai Solutions | Practical Digital Solutions for Growing Businesses", description: "Mirai Solutions helps growing businesses and organizations with websites, digital presence, brand essentials, content digitalization and smarter digital workflows." },
    "/solutions": { title: "Digital Solutions for SMEs & Organizations | Mirai Solutions", description: "Four practical solution areas — websites & digital presence, brand essentials, content digitalization and smarter workflows — built around the problem first." },
    "/who-we-help": { title: "Digital Solutions for SMEs, Manufacturers, Retail & NGOs | Mirai Solutions", description: "SMEs across sectors, with deeper thinking for manufacturers, retail and local chains, and NGOs — different businesses, different challenges, practical digital solutions." },
    "/about": { title: "About Mirai Solutions | Business, Technology & Practical Digital Solutions", description: "Mirai means Future: a technology-driven company combining business understanding, creativity, AI and modern tools to create practical digital solutions." }
  },
  solutions: [
    {
      key: "websites",
      flagship: true,
      name: "Websites & Digital Presence",
      short: "Websites",
      positioning: "Professional websites built around business goals — with strategy, structure, content, design and development handled as one connected process.",
      needs: ["New business website", "Website redesign", "Bilingual Arabic / English", "Product / service presentation", "Lead / inquiry journeys", "Content and messaging"],
      problem: "Customers, buyers and partners check a business online before they call. An outdated or unclear website makes an established business look smaller and less capable than it really is.",
      helps: "We shape the message, structure the customer journey, write and organize the content, and design and build the website — in Arabic and English — around the action you need visitors to take.",
      outputs: ["Website strategy and structure", "Bilingual copy and content organization", "Responsive design and development", "Inquiry, quotation or contact journeys", "Launch, handover and ownership of the site"],
      useful: "Businesses that win customers, buyers or partners through credibility and clear information — from SMEs and professional services to manufacturers, retail chains and organizations."
    },
    {
      key: "brand",
      flagship: false,
      name: "Brand Essentials & Business Materials",
      short: "Brand",
      positioning: "Practical brand foundations and business materials for growing organizations that need to look clear, consistent and professional.",
      needs: ["Essential visual identity", "Logo / identity refinement where appropriate", "Basic brand guidelines", "Company profiles", "Essential business materials"],
      problem: "A logo used ten different ways, a company profile from three years ago and presentations that never match: growing organizations often look improvised even when the work behind them is solid.",
      helps: "We build the practical foundations — an essential identity, simple guidelines and the materials you actually use every week — so everything you send out looks like it comes from the same, professional organization.",
      outputs: ["Essential visual identity or refinement of the current one", "Basic brand guidelines", "Company profile", "Presentation and document templates", "Essential business materials in Arabic and English"],
      useful: "Growing businesses and organizations that need consistency across proposals, profiles, presentations and digital channels — without a large rebranding programme."
    },
    {
      key: "content",
      flagship: false,
      name: "Content Digitalization",
      short: "Content",
      positioning: "Turn valuable information trapped in PDFs, manuals, Word documents and static files into clearer, easier-to-use digital experiences.",
      needs: ["Reports", "Manuals", "Guides", "Training materials", "Static documents", "Interactive / accessible digital content"],
      problem: "Valuable knowledge sits in PDFs, manuals and reports that are hard to find, hard to read on a phone and hard to keep up to date — so it is rarely used.",
      helps: "We restructure the content, design it for screens and turn it into digital experiences people actually use: searchable, accessible, bilingual where needed and easy to update.",
      outputs: ["Digital versions of reports, manuals and guides", "Interactive or web-based training material", "Structured, searchable content", "Accessible, mobile-friendly documents", "A simple way to keep content updated"],
      useful: "Organizations with reports, manuals, guides, training materials or programme documentation that deserve a better digital life."
    },
    {
      key: "workflows",
      flagship: false,
      name: "Digital Consulting & Smarter Workflows",
      short: "Workflows",
      positioning: "Identify digital bottlenecks, improve everyday processes and use modern tools or automation where they create meaningful business value.",
      needs: ["Repetitive manual tasks", "Disconnected tools", "Operational friction", "Digital process improvement", "Workflow automation", "Practical digital guidance"],
      problem: "Repetitive manual tasks, disconnected tools and operational friction quietly cost time every day — and buying more technology rarely fixes them on its own.",
      helps: "We map how the work actually happens, find the bottlenecks and apply the simplest practical improvement: a clearer workflow, the right tool, or targeted automation where it creates real value.",
      outputs: ["Digital process review and recommendations", "Workflow redesign", "Tool selection and setup", "Targeted automation of repetitive tasks", "Practical guidance and training for the team"],
      useful: "Teams that feel the friction of manual work and disconnected tools and want practical, measurable improvement — not a platform migration."
    }
  ],
  home: {
    hero: {
      kicker: "DIGITAL SOLUTIONS FOR GROWING BUSINESSES",
      title: "Digital solutions built around what your business needs to achieve.",
      body: "From professional websites and content to brand essentials, digitalization and smarter workflows, Mirai helps growing businesses and organizations solve practical digital challenges with business thinking, creativity and modern technology.",
      primary: "Get a Free Consultation",
      secondary: "Explore Our Solutions",
      ring: { label: "One team · practical digital solutions", nodes: ["Websites", "Content", "Brand", "Workflows"] }
    },
    trust: {
      eyebrow: "EXPERIENCE BEHIND MIRAI",
      title: "Business experience behind every digital decision.",
      body: "The experience behind Mirai spans 12+ years across digital products, Product Management, EdTech, business development, operations and social impact — now applied to practical digital problems.",
      caption: "Strategy · Content · Design · Technology",
      facts: [
        { value: "12+", label: "years of business & digital experience behind Mirai" },
        { value: "4", label: "focused solution areas" },
        { value: "AR / EN", label: "bilingual, RTL-first work" },
        { value: "1 team", label: "from understanding the problem to delivery" }
      ]
    },
    solutionsOverview: {
      kicker: "WHAT WE DO",
      title: "Practical solutions for real digital challenges.",
      body: "Four focused solution areas — with websites and digital presence as the flagship — instead of a menu of every possible digital service.",
      needsLabel: "Typical needs"
    },
    audiences: {
      kicker: "WHO WE HELP",
      title: "Built for growing businesses and organizations.",
      body: "SMEs across different sectors are our broad audience. We also bring deeper thinking to several business types where digital presence, content and workflows play an important role.",
      items: [
        { title: "SMEs & Growing Businesses", subtitle: "Look credible. Explain your value. Make it easy to enquire.", detail: "Professional services, trading, education, healthcare, construction, food & beverage and other growing businesses." },
        { title: "Manufacturing & Industrial", subtitle: "Present capabilities. Build B2B trust. Support RFQs.", detail: "Products, capabilities, certifications, company profiles and processes organized around how buyers decide." },
        { title: "Retail & Local Chains", subtitle: "Stay consistent. Be easy to find, visit and contact.", detail: "Stores, showrooms, cafés, restaurants and local brands with products, branches, customer contact and practical digital materials." },
        { title: "NGOs & Organizations", subtitle: "Communicate the mission. Show the impact.", detail: "Programs, reports and information turned into clear digital communication and smarter internal workflows." }
      ],
      link: "See who we help",
      closeTitle: "Don't see your sector here?",
      closeBody: "Mirai isn't limited to these categories. If you have a digital challenge worth solving, we start by understanding the business and finding the simplest practical solution."
    },
    mix: {
      kicker: "BUSINESS-FIRST BY DESIGN",
      title: "Different businesses need different digital solutions.",
      body: "We don't force every client into the same service package. Different businesses have different problems, audiences, processes and priorities — so the mix of solutions changes with them.",
      hint: "Same team. A different mix for each business.",
      panelLabel: "A typical mix",
      sectors: [
        { key: "sme", tab: "SME / Growing business", title: "A credible presence and a clearer path to enquiries.", items: [{ label: "Professional website", pillar: "websites" }, { label: "Clear messaging", pillar: "content" }, { label: "Brand essentials", pillar: "brand" }, { label: "Better inquiry flow", pillar: "workflows" }] },
        { key: "manufacturing", tab: "Manufacturing", title: "B2B credibility from the first visit to the quotation.", items: [{ label: "B2B digital presence", pillar: "websites" }, { label: "Products and capabilities", pillar: "content" }, { label: "Company profile / sales materials", pillar: "brand" }, { label: "RFQ or process improvements", pillar: "workflows" }] },
        { key: "retail", tab: "Retail / Local chain", title: "Consistent, easy to find and easy to contact.", items: [{ label: "Brand consistency", pillar: "brand" }, { label: "Products and branches", pillar: "websites" }, { label: "Customer contact / WhatsApp flows", pillar: "workflows" }, { label: "Practical digital materials", pillar: "content" }] },
        { key: "ngo", tab: "NGO / Organization", title: "Mission, programs and impact — clearly communicated.", items: [{ label: "Website and program communication", pillar: "websites" }, { label: "Reports and content digitalization", pillar: "content" }, { label: "Impact presentation", pillar: "brand" }, { label: "Smarter internal digital workflows", pillar: "workflows" }] }
      ]
    },
    organizations: {
      kicker: "ORGANIZATIONS WE'VE WORKED WITH",
      title: "Trusted relationships. Real organizations.",
      body: "Organizations Mirai has worked with — shown with their permission. Case studies will follow as work is approved for publication.",
      visit: "Visit website"
    },
    process: {
      kicker: "HOW WE WORK",
      title: "Start with the problem. Choose the right solution.",
      body: "The same way of working across every solution — clear, lean and built around the outcome.",
      steps: [
        { no: "01", title: "Understand", body: "Start with the business problem, the audience and the goal." },
        { no: "02", title: "Define", body: "Choose the right solution and agree on a clear scope." },
        { no: "03", title: "Create", body: "Use the right mix of content, design, technology and AI-enabled tools." },
        { no: "04", title: "Deliver", body: "Launch, hand over and train the team where relevant." }
      ]
    },
    why: {
      kicker: "WHY MIRAI",
      title: "Modern tools. Business thinking. Practical execution.",
      body: "Technology alone doesn't solve a business problem. Understanding the business does — and modern tools make the work faster and better.",
      items: [
        { title: "Business-first", body: "We start with the problem and the outcome before selecting the technology." },
        { title: "Content & communication", body: "We help turn business knowledge into clearer messages, materials and digital experiences." },
        { title: "AI-enabled & lean", body: "We use AI and modern tools where they help us research, create, automate or deliver faster — while human judgment stays in control." },
        { title: "Practical ownership", body: "Clear scope, usable deliverables and a straightforward handover." }
      ],
      close: "Technology should make the work better — not more complicated."
    },
    faq: {
      kicker: "COMMON QUESTIONS",
      title: "What you may want to know before we talk.",
      items: [
        { q: "What can Mirai help with?", a: "Four practical areas: websites and digital presence, brand essentials and business materials, content digitalization, and digital consulting and smarter workflows. Websites are our flagship, but many projects combine two or three of these." },
        { q: "What if we're not sure which solution we need?", a: "That's normal, and it's exactly what the free consultation is for. We start from the business problem, then recommend the simplest practical solution — sometimes that's one area, sometimes a small mix." },
        { q: "How does a project usually start?", a: "With a short conversation about the business, the audience and what you want to achieve. Then we define the scope, agree on deliverables and timeline, and start." },
        { q: "Can Mirai work in Arabic and English?", a: "Yes. We treat Arabic and English as two proper experiences designed for their audiences — not a word-for-word translation of one another." },
        { q: "How does Mirai use AI?", a: "As part of how we work: faster research, content drafts, design exploration, development, translation and quality checks. AI supports the work; strategy, creativity and responsibility remain human-led." },
        { q: "Do you provide support after delivery?", a: "Yes. Every project ends with a clear handover so you understand what you own and how to use it, and we can agree on ongoing support or updates when you need them." },
        { q: "How long does a project take?", a: "It depends on the scope. A focused website or a set of business materials moves faster than a full digitalization programme. We agree on a realistic timeline before work starts and keep the process lean." }
      ]
    },
    final: {
      title: "Not sure where to start? Start with a conversation.",
      body: "Tell us about the business and the challenge. We'll come back with a practical next step — no obligation."
    }
  },
  solutionsPage: {
    kicker: "OUR SOLUTIONS",
    title: "Practical digital solutions, built around the problem first.",
    intro: "Mirai combines business understanding, creativity, technology and AI-enabled workflows to solve practical digital challenges for growing businesses and organizations.",
    labels: { problem: "The problem", helps: "What Mirai helps with", outputs: "Typical outputs", useful: "Useful for" },
    process: {
      kicker: "HOW WE WORK",
      title: "One way of working across every solution.",
      steps: [
        { no: "01", title: "Understand", body: "We start with the business problem, audience and goal." },
        { no: "02", title: "Define", body: "We decide what solution is actually needed and agree on scope." },
        { no: "03", title: "Create", body: "We use the right mix of strategy, content, design, technology and modern tools." },
        { no: "04", title: "Deliver", body: "We test, hand over and make sure the client understands what they own and how to use it." }
      ]
    },
    principle: "We sell solutions and outcomes — not unnecessary technology."
  },
  whoWeHelp: {
    kicker: "WHO WE HELP",
    title: "Different businesses. Different challenges. Practical digital solutions.",
    intro: "SMEs across different sectors are Mirai's broad audience. We also bring deeper thinking to several priority business types where digital presence, content and workflows play an important role.",
    needsLabel: "Needs may include",
    groups: [
      { title: "SMEs & Growing Businesses", needs: ["Professional digital presence", "Clearer messaging", "Brand essentials", "Customer inquiries", "Practical workflow improvements"] },
      { title: "Manufacturing & Industrial", needs: ["B2B credibility", "Products and capabilities", "Certifications", "Company profiles", "RFQ journeys", "Content organization", "Workflow improvement"] },
      { title: "Retail & Local Chains", needs: ["Brand consistency", "Products and locations", "Branches / maps", "WhatsApp / customer contact", "Practical content and digital materials", "Operational digital improvements"] },
      { title: "NGOs & Organizations", needs: ["Mission and programs", "Impact communication", "Reports and content", "Partners and stakeholders", "Document digitalization", "Practical digital workflows"] }
    ],
    closingTitle: "Don't see your sector here?",
    closingBody: "Mirai isn't limited to these categories. If you have a digital challenge worth solving, we start by understanding the business and finding the simplest practical solution."
  },
  about: {
    kicker: "ABOUT MIRAI",
    title: "Mirai means Future. We think that should show in how we solve problems — not just how we look.",
    intro: "Mirai Solutions is a technology-driven company combining business understanding, creativity, AI and modern tools to create practical digital solutions.",
    storyTitle: "Built on experience across business, products and impact.",
    story: "The experience behind Mirai spans 12+ years across Product Management, business development, EdTech, digital products, operations, social impact and AI-assisted workflows. Mirai Solutions itself is a new company, built to turn that experience into a faster, clearer way to solve practical digital problems.",
    experience: ["Product Management", "Business Development", "EdTech", "Digital Products", "Operations", "Social Impact", "AI-assisted workflows"],
    todayTitle: "What we do today",
    todayBody: "Four focused solution areas, with websites and digital presence as the flagship.",
    principlesTitle: "How we think",
    principles: [
      { title: "Business first", body: "Start with the problem and the outcome." },
      { title: "Technology with purpose", body: "AI and modern tools matter only when they create an actual advantage." },
      { title: "Practical execution", body: "Clear scope, lean communication and usable results." },
      { title: "Human judgment", body: "AI supports the work; strategy, creativity and responsibility remain human-led." },
      { title: "Ownership", body: "Clients should clearly understand what they receive and own." }
    ],
    closingTitle: "Build for the future. Execute practically today."
  },
  consult: {
    title: "Get a free consultation",
    intro: "Tell us a little about the business and the challenge. We'll reply with a practical next step — a real conversation, not an automated report.",
    fields: {
      name: "Name",
      company: "Company / Organization",
      email: "Email",
      whatsapp: "WhatsApp number",
      businessType: "Business type",
      interest: "Interested in",
      website: "Website URL (optional)",
      message: "Briefly tell us what you need",
      choose: "Choose…"
    },
    businessTypes: ["SME / Growing Business", "Manufacturing / Industrial", "Retail / Local Chain", "NGO / Organization", "Other"],
    interests: ["Websites & Digital Presence", "Brand Essentials & Business Materials", "Content Digitalization", "Digital Consulting & Workflows", "Not Sure Yet"],
    submit: "Send request",
    sending: "Sending…",
    privacy: "We'll use these details only to review your request and get back to you.",
    close: "Close",
    whatsappCta: "Continue on WhatsApp",
    copyCta: "Copy message",
    copied: "Copied",
    channelNote: "WhatsApp is the current contact channel for this website.",
    states: {
      static: { title: "Your request is ready to send.", body: "This version of the site sends consultation requests through WhatsApp. Your details are pre-filled — tap the button to send them to Mirai." },
      success: { title: "Request received.", body: "We'll review what you shared and reply within one working day with a practical next step. You can also continue on WhatsApp now." },
      noEmail: { title: "Ready to send.", body: "Email delivery isn't set up on this server yet, so your request continues on WhatsApp with your details pre-filled." },
      noChannel: { title: "Almost there.", body: "Copy the message below and send it to Mirai on WhatsApp or by email — the contact channel is being set up." }
    },
    errors: {
      required: { name: "Tell us your name so we know who we're talking to.", company: "Add your company or organization name.", email: "We need an email to reply to.", whatsapp: "Add a WhatsApp number so we can follow up.", businessType: "Pick the closest business type.", interest: "Pick the closest area — or “Not sure yet”.", message: "One or two sentences on what you need is enough." },
      email: "That email doesn't look right — e.g. name@company.com",
      url: "Enter a full address starting with https://",
      whatsapp: "Use the international format — e.g. +2010XXXXXXXX",
      generic: "Please review the highlighted fields and try again.",
      network: "We couldn't send the request right now. Please try again or continue on WhatsApp."
    },
    whatsappMessage: {
      greeting: "Hello Mirai, I'd like a free consultation.",
      labels: { name: "Name", company: "Company", email: "Email", whatsapp: "WhatsApp", businessType: "Business type", interest: "Interested in", website: "Website", message: "What I need" }
    }
  },
  notFound: { title: "Page not found", body: "The page you're looking for doesn't exist or has moved.", cta: "Back home" },
  redirect: { title: "This page has moved", body: "Taking you to the new page…", cta: "Continue" }
};

const ar = {
  nav: {
    items: [
      { label: "الحلول", href: "/solutions" },
      { label: "من نخدم", href: "/who-we-help" },
      { label: "عن Mirai", href: "/about" }
    ],
    cta: "اطلب استشارة مجانية",
    language: "EN",
    theme: "المظهر",
    menu: "القائمة"
  },
  global: {
    brandLine: "حلول رقمية عملية تُبنى حول احتياجات عملك الحقيقية.",
    philosophy: "المستقبل لمن يصنعه.",
    consultLabel: "اطلب استشارة مجانية",
    consultShort: "اطلب استشارة",
    talkLabel: "تحدث مع Mirai",
    discussLabel: "ناقش هذا الحل معنا",
    exploreLabel: "استكشف حلولنا",
    flagship: "الحل الأساسي"
  },
  meta: {
    "/": { title: "Mirai Solutions | حلول رقمية عملية للأعمال النامية", description: "تساعد Mirai Solutions الشركات والمنظمات النامية في المواقع والحضور الرقمي، وأساسيات الهوية والمواد التعريفية، ورقمنة المحتوى، والاستشارات الرقمية وتحسين سير العمل." },
    "/solutions": { title: "حلول رقمية للشركات الصغيرة والمتوسطة والمنظمات | Mirai Solutions", description: "أربعة مجالات عملية: المواقع والحضور الرقمي، أساسيات الهوية، رقمنة المحتوى، والاستشارات الرقمية وتحسين سير العمل — نبدأ من المشكلة لا من التقنية." },
    "/who-we-help": { title: "حلول رقمية للشركات والمصانع والتجزئة والمنظمات | Mirai Solutions", description: "الشركات الصغيرة والمتوسطة هي جمهورنا الأوسع، مع تركيز أعمق على المصانع وسلاسل التجزئة والمنظمات — أعمال مختلفة، تحديات مختلفة، حلول رقمية عملية." },
    "/about": { title: "عن Mirai Solutions | الأعمال والتقنية والحلول الرقمية العملية", description: "Mirai تعني المستقبل: شركة تقودها التقنية تجمع بين فهم الأعمال والإبداع والذكاء الاصطناعي والأدوات الحديثة لبناء حلول رقمية عملية." }
  },
  solutions: [
    {
      key: "websites",
      flagship: true,
      name: "المواقع والحضور الرقمي",
      short: "المواقع",
      positioning: "مواقع احترافية تُبنى حول أهداف العمل — الاستراتيجية والهيكل والمحتوى والتصميم والتطوير في مسار واحد مترابط.",
      needs: ["موقع جديد للشركة", "إعادة تصميم موقع قائم", "موقع ثنائي اللغة عربي / إنجليزي", "عرض المنتجات أو الخدمات", "رحلات الاستفسار وطلب العروض", "المحتوى والرسالة"],
      problem: "العملاء والمشترون والشركاء يتفقّدون حضور الشركة على الإنترنت قبل أن يتصلوا بها. الموقع القديم أو الغامض يجعل شركة راسخة تبدو أصغر وأقل قدرة من حقيقتها.",
      helps: "نصوغ الرسالة، ونرتّب رحلة العميل، ونكتب المحتوى وننظّمه، ثم نصمّم الموقع ونطوّره — بالعربية والإنجليزية — حول الخطوة التي تريد من الزائر أن يتخذها.",
      outputs: ["استراتيجية الموقع وهيكله", "نصوص ثنائية اللغة وتنظيم للمحتوى", "تصميم متجاوب وتطوير", "رحلات الاستفسار أو طلب عرض السعر أو التواصل", "الإطلاق والتسليم وملكية كاملة للموقع"],
      useful: "الأعمال التي تكسب عملاءها أو مشتريها أو شركاءها بالمصداقية والمعلومات الواضحة — من الشركات الصغيرة والمتوسطة والخدمات المهنية إلى المصانع وسلاسل المتاجر والمنظمات."
    },
    {
      key: "brand",
      flagship: false,
      name: "أساسيات الهوية والمواد التعريفية",
      short: "الهوية",
      positioning: "أساسيات عملية للهوية ومواد تعريفية للمنظمات النامية التي تحتاج أن تبدو واضحة ومتسقة واحترافية.",
      needs: ["هوية بصرية أساسية", "تحسين الشعار أو الهوية الحالية عند الحاجة", "دليل هوية مبسّط", "ملف تعريفي للشركة", "المواد التعريفية الأساسية"],
      problem: "شعار يُستخدم بعشر طرق مختلفة، وملف تعريفي عمره ثلاث سنوات، وعروض تقديمية لا تشبه بعضها: كثير من المنظمات النامية تبدو مرتجلة رغم أن العمل خلفها متين.",
      helps: "نبني الأساسيات العملية — هوية أساسية، ودليل مبسّط، والمواد التي تستخدمها فعلًا كل أسبوع — حتى يبدو كل ما يخرج من شركتك صادرًا عن جهة واحدة محترفة.",
      outputs: ["هوية بصرية أساسية أو تحسين للهوية الحالية", "دليل هوية مبسّط", "ملف تعريفي للشركة", "قوالب للعروض التقديمية والمستندات", "المواد التعريفية الأساسية بالعربية والإنجليزية"],
      useful: "الشركات والمنظمات النامية التي تحتاج اتساقًا في العروض والملفات التعريفية والقنوات الرقمية — من دون برنامج إعادة هوية ضخم."
    },
    {
      key: "content",
      flagship: false,
      name: "رقمنة المحتوى",
      short: "المحتوى",
      positioning: "تحويل المعلومات القيّمة المحبوسة في ملفات PDF والأدلة ومستندات Word والملفات الثابتة إلى تجارب رقمية أوضح وأسهل في الاستخدام.",
      needs: ["التقارير", "الأدلة والكتيبات", "الإرشادات", "المواد التدريبية", "المستندات الثابتة", "محتوى رقمي تفاعلي وسهل الوصول"],
      problem: "معرفة ثمينة تقبع في ملفات PDF وأدلة وتقارير يصعب العثور عليها، ويصعب قراءتها على الهاتف، ويصعب تحديثها — فلا يستخدمها أحد تقريبًا.",
      helps: "نعيد هيكلة المحتوى، ونصمّمه للشاشات، ونحوّله إلى تجارب رقمية يستخدمها الناس فعلًا: قابلة للبحث، سهلة الوصول، ثنائية اللغة عند الحاجة، وسهلة التحديث.",
      outputs: ["نسخ رقمية من التقارير والأدلة والإرشادات", "مواد تدريبية تفاعلية أو على الويب", "محتوى منظّم وقابل للبحث", "مستندات سهلة الوصول ومناسبة للهاتف", "طريقة بسيطة لإبقاء المحتوى محدّثًا"],
      useful: "المنظمات التي لديها تقارير أو أدلة أو إرشادات أو مواد تدريبية أو توثيق لبرامجها يستحق حياة رقمية أفضل."
    },
    {
      key: "workflows",
      flagship: false,
      name: "الاستشارات الرقمية وتحسين سير العمل",
      short: "سير العمل",
      positioning: "تحديد الاختناقات الرقمية، وتحسين العمليات اليومية، واستخدام الأدوات الحديثة أو الأتمتة حيث تصنع قيمة حقيقية للعمل.",
      needs: ["المهام اليدوية المتكررة", "أدوات غير مترابطة", "احتكاك في العمليات اليومية", "تحسين العمليات الرقمية", "أتمتة سير العمل", "إرشاد رقمي عملي"],
      problem: "المهام اليدوية المتكررة والأدوات غير المترابطة والاحتكاك في العمليات تستهلك الوقت كل يوم بصمت — وشراء المزيد من التقنية نادرًا ما يحل المشكلة وحده.",
      helps: "نرسم خريطة العمل كما يحدث فعلًا، ونحدد الاختناقات، ثم نطبّق أبسط تحسين عملي: مسار عمل أوضح، أو الأداة المناسبة، أو أتمتة موجّهة حيث تصنع قيمة حقيقية.",
      outputs: ["مراجعة للعمليات الرقمية مع توصيات", "إعادة تصميم سير العمل", "اختيار الأدوات وإعدادها", "أتمتة موجّهة للمهام المتكررة", "إرشاد عملي وتدريب للفريق"],
      useful: "الفرق التي تشعر بعبء العمل اليدوي والأدوات المتفرقة وتريد تحسينًا عمليًا يمكن قياسه — لا الانتقال إلى منصة جديدة."
    }
  ],
  home: {
    hero: {
      kicker: "حلول رقمية للأعمال النامية",
      title: "حلول رقمية تُبنى حول ما يحتاجه عملك فعلًا.",
      body: "من المواقع والحضور الرقمي إلى المحتوى وأساسيات الهوية ورقمنة المعلومات وتحسين سير العمل، تساعد Mirai الشركات والمنظمات على حل تحدياتها الرقمية بطريقة عملية تجمع فهم الأعمال والإبداع والتكنولوجيا الحديثة.",
      primary: "اطلب استشارة مجانية",
      secondary: "استكشف حلولنا",
      ring: { label: "فريق واحد · حلول رقمية عملية", nodes: ["المواقع", "المحتوى", "الهوية", "سير العمل"] }
    },
    trust: {
      eyebrow: "الخبرة التي تقف خلف Mirai",
      title: "خبرة عملية خلف كل قرار رقمي.",
      body: "تمتد الخبرة خلف Mirai لأكثر من اثني عشر عامًا في المنتجات الرقمية وإدارة المنتجات وتقنيات التعليم وتطوير الأعمال والعمليات والعمل المجتمعي — ونطبّقها اليوم على مشكلات رقمية عملية.",
      caption: "استراتيجية · محتوى · تصميم · تقنية",
      facts: [
        { value: "+12", label: "عامًا من الخبرة في الأعمال والمنتجات الرقمية خلف Mirai" },
        { value: "4", label: "مجالات حلول محددة" },
        { value: "AR / EN", label: "عمل ثنائي اللغة يبدأ من العربية" },
        { value: "فريق واحد", label: "من فهم المشكلة إلى التسليم" }
      ]
    },
    solutionsOverview: {
      kicker: "ماذا نقدّم",
      title: "حلول عملية لتحديات رقمية حقيقية.",
      body: "أربعة مجالات محددة — المواقع والحضور الرقمي في المقدمة — بدل قائمة بكل خدمة رقمية ممكنة.",
      needsLabel: "احتياجات شائعة"
    },
    audiences: {
      kicker: "من نخدم",
      title: "مصمَّم للشركات والمنظمات التي تنمو.",
      body: "الشركات الصغيرة والمتوسطة من مختلف القطاعات هي جمهورنا الأوسع، ونبني فهمًا أعمق لعدة فئات يلعب فيها الحضور الرقمي والمحتوى وسير العمل دورًا مهمًا.",
      items: [
        { title: "الشركات الصغيرة والمتوسطة النامية", subtitle: "مصداقية واضحة، وقيمة مفهومة، وتواصل أسهل.", detail: "الخدمات المهنية والتجارة والتعليم والرعاية الصحية والمقاولات والمطاعم والمقاهي وغيرها من الأعمال النامية." },
        { title: "المصانع والشركات الصناعية", subtitle: "اعرض قدراتك، وابنِ ثقة المشتري، وسهّل طلب عروض الأسعار.", detail: "المنتجات والقدرات والشهادات والملفات التعريفية والعمليات مرتّبة حول طريقة اتخاذ المشتري قراره." },
        { title: "التجزئة والسلاسل المحلية", subtitle: "هوية متسقة، وسهولة في الوصول والزيارة والتواصل.", detail: "المتاجر والمعارض والمقاهي والمطاعم والعلامات المحلية، مع المنتجات والفروع وقنوات التواصل والمواد الرقمية العملية." },
        { title: "المنظمات والمؤسسات", subtitle: "وضّح رسالتك، وأظهر أثرك.", detail: "البرامج والتقارير والمعلومات تتحول إلى تواصل رقمي واضح وسير عمل داخلي أذكى." }
      ],
      link: "اعرف من نخدم",
      closeTitle: "قطاعك غير موجود هنا؟",
      closeBody: "Mirai لا تقتصر على هذه الفئات. إذا كان لديك تحدٍّ رقمي يستحق الحل، نبدأ بفهم عملك ثم نبحث عن أبسط حل عملي له."
    },
    mix: {
      kicker: "نبدأ من العمل لا من القالب",
      title: "أعمال مختلفة تحتاج حلولًا رقمية مختلفة.",
      body: "لا نحشر كل عميل في الباقة نفسها. لكل عمل مشكلاته وجمهوره وعملياته وأولوياته — ولذلك يتغير مزيج الحلول بتغيّر العمل.",
      hint: "الفريق نفسه. مزيج مختلف لكل عمل.",
      panelLabel: "مزيج شائع",
      sectors: [
        { key: "sme", tab: "شركة نامية", title: "حضور موثوق ومسار أوضح للاستفسارات.", items: [{ label: "موقع احترافي", pillar: "websites" }, { label: "رسالة واضحة", pillar: "content" }, { label: "أساسيات الهوية", pillar: "brand" }, { label: "مسار أفضل للاستفسارات", pillar: "workflows" }] },
        { key: "manufacturing", tab: "مصنع", title: "ثقة المشتري من أول زيارة حتى طلب عرض السعر.", items: [{ label: "حضور رقمي للأعمال B2B", pillar: "websites" }, { label: "المنتجات والقدرات", pillar: "content" }, { label: "ملف تعريفي ومواد بيع", pillar: "brand" }, { label: "تحسين طلبات العروض أو العمليات", pillar: "workflows" }] },
        { key: "retail", tab: "سلسلة متاجر", title: "هوية متسقة، وسهولة في الوصول والتواصل.", items: [{ label: "اتساق الهوية", pillar: "brand" }, { label: "المنتجات والفروع", pillar: "websites" }, { label: "تواصل العملاء ومسارات واتساب", pillar: "workflows" }, { label: "مواد رقمية عملية", pillar: "content" }] },
        { key: "ngo", tab: "منظمة", title: "الرسالة والبرامج والأثر — بوضوح.", items: [{ label: "الموقع والتواصل حول البرامج", pillar: "websites" }, { label: "رقمنة التقارير والمحتوى", pillar: "content" }, { label: "عرض الأثر", pillar: "brand" }, { label: "سير عمل داخلي أذكى", pillar: "workflows" }] }
      ]
    },
    organizations: {
      kicker: "جهات عملنا معها",
      title: "علاقات حقيقية مع جهات حقيقية.",
      body: "جهات عملت معها Mirai — تُعرض بإذنها. وستُضاف دراسات الحالة تباعًا مع اعتماد نشرها.",
      visit: "زيارة الموقع"
    },
    process: {
      kicker: "كيف نعمل",
      title: "نبدأ من المشكلة، ونختار الحل المناسب.",
      body: "طريقة عمل واحدة عبر كل الحلول — واضحة ورشيقة ومبنية حول النتيجة.",
      steps: [
        { no: "01", title: "نفهم", body: "نبدأ من مشكلة العمل، وجمهوره، وهدفه." },
        { no: "02", title: "نحدد", body: "نختار الحل المناسب ونتفق على نطاق واضح." },
        { no: "03", title: "ننفّذ", body: "نستخدم المزيج المناسب من المحتوى والتصميم والتقنية وأدوات الذكاء الاصطناعي." },
        { no: "04", title: "نسلّم", body: "نُطلق، ونسلّم، وندرّب الفريق حين يلزم." }
      ]
    },
    why: {
      kicker: "لماذا Mirai",
      title: "أدوات حديثة. فهم للعمل. تنفيذ عملي.",
      body: "التقنية وحدها لا تحل مشكلة عمل. فهم العمل هو ما يحلها — والأدوات الحديثة تجعل التنفيذ أسرع وأفضل.",
      items: [
        { title: "نبدأ من العمل", body: "نبدأ بالمشكلة والنتيجة المطلوبة قبل اختيار التقنية." },
        { title: "المحتوى والتواصل", body: "نساعدك على تحويل معرفتك بعملك إلى رسائل ومواد وتجارب رقمية أوضح." },
        { title: "ذكاء اصطناعي وفريق رشيق", body: "نستخدم الذكاء الاصطناعي والأدوات الحديثة حيث تساعدنا على البحث والإنتاج والأتمتة والتسليم بسرعة أكبر — ويبقى الحكم البشري صاحب القرار." },
        { title: "ملكية عملية", body: "نطاق واضح، ومخرجات قابلة للاستخدام، وتسليم مباشر بلا تعقيد." }
      ],
      close: "التقنية يجب أن تجعل العمل أفضل — لا أكثر تعقيدًا."
    },
    faq: {
      kicker: "أسئلة شائعة",
      title: "ما قد تريد معرفته قبل أن نتحدث.",
      items: [
        { q: "فيمَ تستطيع Mirai مساعدتنا؟", a: "في أربعة مجالات عملية: المواقع والحضور الرقمي، وأساسيات الهوية والمواد التعريفية، ورقمنة المحتوى، والاستشارات الرقمية وتحسين سير العمل. المواقع هي حلّنا الأساسي، لكن كثيرًا من المشاريع يجمع بين مجالين أو ثلاثة." },
        { q: "ماذا لو لم نكن متأكدين من الحل الذي نحتاجه؟", a: "هذا طبيعي، وهو بالضبط ما تخدمه الاستشارة المجانية. نبدأ من مشكلة العمل ثم نقترح أبسط حل عملي — أحيانًا يكون مجالًا واحدًا، وأحيانًا مزيجًا صغيرًا." },
        { q: "كيف يبدأ المشروع عادةً؟", a: "بحديث قصير عن العمل وجمهوره وما تريد تحقيقه. ثم نحدد النطاق، ونتفق على المخرجات والجدول الزمني، ونبدأ." },
        { q: "هل تعملون بالعربية والإنجليزية؟", a: "نعم. نتعامل مع العربية والإنجليزية كتجربتين مستقلتين مصمَّمتين لجمهور كل منهما — لا ترجمةً حرفية لإحداهما عن الأخرى." },
        { q: "كيف تستخدم Mirai الذكاء الاصطناعي؟", a: "كجزء من طريقة عملنا: بحث أسرع، ومسودات محتوى، واستكشاف للتصميم، وتطوير، وترجمة، ومراجعات للجودة. الذكاء الاصطناعي يدعم العمل، أما الاستراتيجية والإبداع والمسؤولية فتبقى بيد الإنسان." },
        { q: "هل تقدّمون دعمًا بعد التسليم؟", a: "نعم. ينتهي كل مشروع بتسليم واضح تفهم فيه ما تملكه وكيف تستخدمه، ويمكننا الاتفاق على دعم مستمر أو تحديثات عند الحاجة." },
        { q: "كم يستغرق المشروع؟", a: "يعتمد على النطاق. الموقع المحدد أو مجموعة المواد التعريفية أسرع من برنامج رقمنة كامل. نتفق على جدول زمني واقعي قبل البدء ونحافظ على مسار عمل رشيق." }
      ]
    },
    final: {
      title: "لا تعرف من أين تبدأ؟ ابدأ بحديث.",
      body: "أخبرنا عن عملك والتحدي الذي تواجهه، ونعود إليك بخطوة عملية تالية — دون أي التزام."
    }
  },
  solutionsPage: {
    kicker: "حلولنا",
    title: "حلول رقمية عملية تبدأ من المشكلة أولًا.",
    intro: "تجمع Mirai بين فهم الأعمال والإبداع والتقنية ومسارات العمل المدعومة بالذكاء الاصطناعي لحل تحديات رقمية عملية للشركات والمنظمات النامية.",
    labels: { problem: "المشكلة", helps: "كيف تساعد Mirai", outputs: "مخرجات شائعة", useful: "لمن يناسب" },
    process: {
      kicker: "كيف نعمل",
      title: "طريقة عمل واحدة عبر كل الحلول.",
      steps: [
        { no: "01", title: "نفهم", body: "نبدأ من مشكلة العمل وجمهوره وهدفه." },
        { no: "02", title: "نحدد", body: "نقرر الحل المطلوب فعلًا ونتفق على النطاق." },
        { no: "03", title: "ننفّذ", body: "نستخدم المزيج المناسب من الاستراتيجية والمحتوى والتصميم والتقنية والأدوات الحديثة." },
        { no: "04", title: "نسلّم", body: "نختبر، ونسلّم، ونتأكد أن العميل يفهم ما يملكه وكيف يستخدمه." }
      ]
    },
    principle: "نبيع حلولًا ونتائج — لا تقنية بلا داعٍ."
  },
  whoWeHelp: {
    kicker: "من نخدم",
    title: "أعمال مختلفة. تحديات مختلفة. حلول رقمية عملية.",
    intro: "الشركات الصغيرة والمتوسطة من مختلف القطاعات هي جمهور Mirai الأوسع. ونبني فهمًا أعمق لعدة فئات ذات أولوية يلعب فيها الحضور الرقمي والمحتوى وسير العمل دورًا مهمًا.",
    needsLabel: "قد تشمل الاحتياجات",
    groups: [
      { title: "الشركات الصغيرة والمتوسطة النامية", needs: ["حضور رقمي احترافي", "رسالة أوضح", "أساسيات الهوية", "استفسارات العملاء", "تحسينات عملية لسير العمل"] },
      { title: "المصانع والشركات الصناعية", needs: ["مصداقية أمام مشتري الأعمال", "المنتجات والقدرات", "الشهادات والاعتمادات", "الملفات التعريفية", "رحلات طلب عروض الأسعار", "تنظيم المحتوى", "تحسين سير العمل"] },
      { title: "التجزئة والسلاسل المحلية", needs: ["اتساق الهوية", "المنتجات والمواقع", "الفروع والخرائط", "التواصل عبر واتساب", "محتوى ومواد رقمية عملية", "تحسينات رقمية للتشغيل"] },
      { title: "المنظمات والمؤسسات", needs: ["الرسالة والبرامج", "التواصل حول الأثر", "التقارير والمحتوى", "الشركاء وأصحاب المصلحة", "رقمنة المستندات", "سير عمل رقمي عملي"] }
    ],
    closingTitle: "قطاعك غير موجود هنا؟",
    closingBody: "Mirai لا تقتصر على هذه الفئات. إذا كان لديك تحدٍّ رقمي يستحق الحل، نبدأ بفهم عملك ثم نبحث عن أبسط حل عملي له."
  },
  about: {
    kicker: "عن Mirai",
    title: "Mirai تعني «المستقبل». ونرى أن ذلك ينبغي أن يظهر في طريقة حلّنا للمشكلات، لا في شكلنا فقط.",
    intro: "Mirai Solutions شركة تقودها التقنية، تجمع بين فهم الأعمال والإبداع والذكاء الاصطناعي والأدوات الحديثة لبناء حلول رقمية عملية.",
    storyTitle: "خبرة تمتد عبر الأعمال والمنتجات والأثر.",
    story: "تمتد الخبرة خلف Mirai لأكثر من اثني عشر عامًا في إدارة المنتجات وتطوير الأعمال وتقنيات التعليم والمنتجات الرقمية والعمليات والعمل المجتمعي ومسارات العمل المدعومة بالذكاء الاصطناعي. أما Mirai Solutions نفسها فشركة جديدة، أُسّست لتحوّل هذه الخبرة إلى طريقة أسرع وأوضح لحل المشكلات الرقمية العملية.",
    experience: ["إدارة المنتجات", "تطوير الأعمال", "تقنيات التعليم", "المنتجات الرقمية", "العمليات", "الأثر المجتمعي", "مسارات عمل مدعومة بالذكاء الاصطناعي"],
    todayTitle: "ماذا نقدّم اليوم",
    todayBody: "أربعة مجالات حلول محددة، والمواقع والحضور الرقمي في المقدمة.",
    principlesTitle: "كيف نفكر",
    principles: [
      { title: "العمل أولًا", body: "نبدأ بالمشكلة والنتيجة المطلوبة." },
      { title: "تقنية لها غاية", body: "الذكاء الاصطناعي والأدوات الحديثة تهم فقط حين تصنع ميزة حقيقية." },
      { title: "تنفيذ عملي", body: "نطاق واضح، وتواصل رشيق، ونتائج قابلة للاستخدام." },
      { title: "الحكم البشري", body: "الذكاء الاصطناعي يدعم العمل، أما الاستراتيجية والإبداع والمسؤولية فتبقى بيد الإنسان." },
      { title: "الملكية", body: "ينبغي أن يفهم العميل بوضوح ما يستلمه وما يملكه." }
    ],
    closingTitle: "نبني للمستقبل، وننفّذ بخطوات عملية اليوم."
  },
  consult: {
    title: "اطلب استشارة مجانية",
    intro: "أخبرنا قليلًا عن عملك والتحدي الذي تواجهه، ونرد عليك بخطوة عملية تالية — حديث حقيقي، لا تقرير آلي.",
    fields: {
      name: "الاسم",
      company: "الشركة / المؤسسة",
      email: "البريد الإلكتروني",
      whatsapp: "رقم واتساب",
      businessType: "نوع النشاط",
      interest: "المجال الذي يهمك",
      website: "رابط الموقع (اختياري)",
      message: "أخبرنا باختصار بما تحتاجه",
      choose: "اختر…"
    },
    businessTypes: ["شركة صغيرة أو متوسطة نامية", "مصنع / شركة صناعية", "تجزئة / سلسلة محلية", "منظمة / مؤسسة", "أخرى"],
    interests: ["المواقع والحضور الرقمي", "أساسيات الهوية والمواد التعريفية", "رقمنة المحتوى", "الاستشارات الرقمية وسير العمل", "لم أحدد بعد"],
    submit: "أرسل الطلب",
    sending: "جارٍ الإرسال…",
    privacy: "نستخدم هذه البيانات فقط لمراجعة طلبك والرد عليك.",
    close: "إغلاق",
    whatsappCta: "تابع على واتساب",
    copyCta: "انسخ الرسالة",
    copied: "تم النسخ",
    channelNote: "واتساب هو قناة التواصل الحالية لهذا الموقع.",
    states: {
      static: { title: "طلبك جاهز للإرسال.", body: "هذه النسخة من الموقع ترسل طلبات الاستشارة عبر واتساب. بياناتك مجهّزة مسبقًا — اضغط الزر لإرسالها إلى Mirai." },
      success: { title: "استلمنا طلبك.", body: "سنراجع ما أرسلته ونرد عليك خلال يوم عمل واحد بخطوة عملية تالية. ويمكنك متابعة الحديث على واتساب الآن." },
      noEmail: { title: "جاهز للإرسال.", body: "إرسال البريد غير مفعّل على هذا الخادم بعد، لذلك يتابع طلبك عبر واتساب وبياناتك مجهّزة مسبقًا." },
      noChannel: { title: "خطوة أخيرة.", body: "انسخ الرسالة أدناه وأرسلها إلى Mirai عبر واتساب أو البريد — قناة التواصل قيد الإعداد." }
    },
    errors: {
      required: { name: "اكتب اسمك حتى نعرف مع من نتحدث.", company: "اكتب اسم الشركة أو المؤسسة.", email: "نحتاج بريدًا إلكترونيًا للرد عليك.", whatsapp: "أضف رقم واتساب حتى نتابع معك.", businessType: "اختر نوع النشاط الأقرب لعملك.", interest: "اختر المجال الأقرب — أو «لم أحدد بعد».", message: "جملة أو جملتان عمّا تحتاجه تكفيان." },
      email: "البريد الإلكتروني غير صحيح — مثال: name@company.com",
      url: "أدخل رابطًا كاملًا يبدأ بـ https://",
      whatsapp: "استخدم الصيغة الدولية — مثال: +2010XXXXXXXX",
      generic: "راجع الحقول المحددة وحاول مرة أخرى.",
      network: "تعذر إرسال الطلب الآن. حاول مرة أخرى أو تابع على واتساب."
    },
    whatsappMessage: {
      greeting: "مرحبًا Mirai، أرغب في استشارة مجانية.",
      labels: { name: "الاسم", company: "الشركة", email: "البريد", whatsapp: "واتساب", businessType: "نوع النشاط", interest: "المجال", website: "الموقع", message: "ما أحتاجه" }
    }
  },
  notFound: { title: "الصفحة غير موجودة", body: "الصفحة التي تبحث عنها غير موجودة أو انتقلت إلى مكان آخر.", cta: "العودة إلى الرئيسية" },
  redirect: { title: "انتقلت هذه الصفحة", body: "جارٍ نقلك إلى الصفحة الجديدة…", cta: "متابعة" }
};

export const siteContent = { en, ar };
