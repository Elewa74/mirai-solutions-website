# Mirai Solutions Website Design Spec

## Goal
Build the first production-ready Mirai Solutions marketing website as a bilingual English/Arabic experience with optional light/dark themes, optimized for clarity, trust, modern visual perception, and qualified lead generation.

## Primary Positioning
Mirai is not positioned as an AI website builder or a generic digital agency. The website leads with business-first websites and digital presence solutions. AI is presented later as an operating advantage that improves speed and execution quality.

## Core Audience
- SMEs and growing businesses across different sectors (umbrella audience)
- Manufacturing and industrial businesses (priority segment)
- Retail and local chains (priority segment)
- NGOs and organizations (priority segment)

The three priority segments are examples of deeper sector thinking, not restrictions on who Mirai serves.

## V1 Pages
1. Home
2. Solutions
3. Who We Help
4. Work
5. About
6. Free Digital Presence Audit
7. Individual Case Study pages as projects are added

No standalone Pricing, Blog, AI, Automation, Branding, or Contact page in V1.

## Navigation
Solutions / Who We Help / Work / About / Get a Free Audit

## Default Language and Localization
- English is the default language at `/`.
- Arabic lives under `/ar`.
- Arabic is a first-class experience with RTL layout, not a literal UI mirror without adjustment.
- Language switching should preserve the same logical page when possible.

## Theme
- Light is the default visual foundation.
- User can switch to Dark mode.
- System preference may be honored on first visit, while explicit user preference persists locally.
- Visual direction: Editorial Tech / Modern Business.
- Avoid old corporate/SaaS card-heavy layouts.
- Use strong typography, generous whitespace, asymmetrical editorial composition, one or two dark cinematic sections, subtle Mirai cyan/mint gradient accents, and restrained motion.

## Brand Assets
Use the supplied Mirai logo assets:
- `/mnt/data/Mirai Logo.png`
- `/mnt/data/Mirai Logo black.png`

Do not create an AI/robot/neural-network visual identity.

## Homepage Message Hierarchy
1. Hero: websites and digital presence built around real business goals.
2. Trust: experience behind Mirai.
3. Problem: the business may be stronger than it looks online.
4. Who We Help: SMEs first, then manufacturing, retail/local chains, NGOs/organizations.
5. Mirai Difference: different businesses need different websites.
6. Featured Work / first NGO case study placeholder using only verified facts.
7. How We Work: Understand -> Create -> Launch.
8. Why Mirai: business-first, content support, AI-enabled lean workflow, ownership.
9. Free Audit.
10. FAQ.
11. Final CTA and footer.

## Hero Direction
Kicker: WEBSITES & DIGITAL PRESENCE
H1: Websites built around what your business needs to achieve.
Supporting message communicates that Mirai handles strategy, content, design, and development so customers, buyers, and partners can understand, trust, and act.
Primary CTA: Get a Free Digital Presence Audit
Secondary CTA: View Our Work

## Lead Flow
The Free Digital Presence Audit form includes:
- Name
- Company
- Website URL (optional)
- Business Type
- What they want to improve
- Email
- WhatsApp number

Submission behavior:
- Send the lead to a Mirai email endpoint.
- Show a clear success state.
- Offer a WhatsApp follow-up with a pre-filled message.
- Do not add a CMS or CRM in V1.
- Production email provider integration is abstracted behind a server endpoint so Resend or another provider can be configured later without changing the form UI.

## Visual Principles
- Contemporary editorial composition over generic SaaS cards.
- Large, confident typography.
- More whitespace and fewer simultaneous messages.
- Use actual project screenshots/business imagery when available.
- Feature work should be visually prominent.
- Motion should reward attention, not demand it.
- No custom cursor gimmicks, intro loader, excessive parallax, generic AI visuals, or stock-photo-heavy design.
- Mobile is a primary experience, not an afterthought.

## Accessibility and Quality
- Semantic HTML and keyboard-friendly controls.
- Accessible color contrast in both themes.
- Respect prefers-reduced-motion.
- Fast-loading assets and responsive images.
- Arabic text must use an Arabic-capable font stack and correct directionality.
- SEO metadata per language/page.

## Technical Architecture
- Next.js App Router + TypeScript.
- Tailwind CSS.
- Static content in code; no CMS.
- Locale-aware content dictionaries.
- Theme preference stored on client.
- API route for audit submission with graceful fallback if email provider is not configured.
- Deployable to a standard Next.js host; repository can live on GitHub.

## V1 Success Criteria
- English and Arabic routes render correctly.
- RTL/LTR switching is correct.
- Light/dark mode works and persists.
- All six core pages exist and use shared navigation/footer.
- Homepage follows approved content hierarchy and modern editorial design direction.
- Audit form validates required fields, reaches the server endpoint, and exposes WhatsApp follow-up after success.
- Responsive and usable on mobile, tablet, and desktop.
- Production build passes.
