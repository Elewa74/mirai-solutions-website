# Mirai Solutions Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready bilingual English/Arabic Mirai Solutions marketing website with light/dark themes, six core pages, responsive editorial UI, and a working Free Digital Presence Audit lead flow.

**Architecture:** Use the Next.js App Router with English routes at the root and Arabic routes under `/ar`. Keep page copy in typed locale dictionaries, render shared UI from reusable components, persist theme preference in localStorage, and submit audit leads to a Next.js API route that can use a transactional email provider when configured and otherwise returns a development-safe success response.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Vitest, React Testing Library, Lucide React.

**Spec:** `docs/superpowers/specs/2026-09-03-mirai-website-design.md`

## Global Constraints

- English is the default language at `/`; Arabic is under `/ar` with RTL direction.
- Light is the default visual foundation, with an optional persistent Dark mode.
- No CMS, CRM, standalone Pricing, Blog, AI, Automation, Branding, or Contact page in V1.
- V1 core pages: Home, Solutions, Who We Help, Work, About, Free Digital Presence Audit.
- Navigation: Solutions / Who We Help / Work / About / Get a Free Audit.
- Hero H1: `Websites built around what your business needs to achieve.`
- The three priority sectors must be presented as examples/deeper sector thinking, not as restrictions.
- AI appears as an operating advantage, not the primary positioning.
- Avoid generic AI visuals, stock-photo-heavy design, excessive motion, intro loaders, and card-heavy SaaS composition.
- Audit form fields: Name, Company, Website URL optional, Business Type, Improvement Goal, Email, WhatsApp Number.
- Mobile, accessibility, reduced-motion, SEO, and production build are required.

---

## File Structure

- `app/layout.tsx` — root metadata, theme bootstrap, global shell.
- `app/page.tsx` — English homepage.
- `app/ar/page.tsx` — Arabic homepage.
- `app/solutions/page.tsx`, `app/ar/solutions/page.tsx` — Solutions pages.
- `app/who-we-help/page.tsx`, `app/ar/who-we-help/page.tsx` — audience pages.
- `app/work/page.tsx`, `app/ar/work/page.tsx` — work pages.
- `app/about/page.tsx`, `app/ar/about/page.tsx` — about pages.
- `app/audit/page.tsx`, `app/ar/audit/page.tsx` — audit pages.
- `app/api/audit/route.ts` — validation and lead dispatch.
- `components/site-header.tsx` — responsive navigation, locale switch, theme toggle.
- `components/site-footer.tsx` — shared footer.
- `components/theme-toggle.tsx` — persisted light/dark mode control.
- `components/locale-switch.tsx` — same-page locale routing.
- `components/home/*` — homepage sections.
- `components/audit/audit-form.tsx` — form state, submit, success state, WhatsApp link.
- `components/ui/*` — focused primitives such as buttons and section wrappers.
- `content/site-content.ts` — typed English and Arabic content dictionaries.
- `lib/i18n.ts` — locale helpers and path conversion.
- `lib/audit.ts` — audit field types, validation, WhatsApp message generation.
- `public/brand/*` — copied Mirai logo assets.
- `tests/i18n.test.ts` — route localization tests.
- `tests/audit.test.ts` — audit validation/message tests.
- `tests/content.test.ts` — content completeness tests.

---

### Task 1: Scaffold the Next.js project and establish testable locale/theme foundations

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `lib/i18n.ts`
- Create: `tests/i18n.test.ts`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: `type Locale = "en" | "ar"`
- Produces: `localizePath(pathname: string, locale: Locale): string`
- Produces: `localeFromPath(pathname: string): Locale`

- [ ] **Step 1: Create package and TypeScript configuration**

Create a Next.js App Router project configuration with scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Include dependencies for `next`, `react`, `react-dom`, and `lucide-react`, plus dev dependencies for TypeScript, Tailwind/PostCSS, Vitest, jsdom, and React Testing Library.

- [ ] **Step 2: Write the failing locale routing tests**

Create `tests/i18n.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { localeFromPath, localizePath } from "../lib/i18n";

describe("locale helpers", () => {
  it("detects Arabic only under /ar", () => {
    expect(localeFromPath("/ar/about")).toBe("ar");
    expect(localeFromPath("/about")).toBe("en");
  });

  it("preserves the logical page when switching locale", () => {
    expect(localizePath("/solutions", "ar")).toBe("/ar/solutions");
    expect(localizePath("/ar/solutions", "en")).toBe("/solutions");
    expect(localizePath("/ar", "en")).toBe("/");
  });
});
```

- [ ] **Step 3: Run the locale test and verify it fails**

Run: `npm test -- tests/i18n.test.ts`
Expected: FAIL because `lib/i18n.ts` does not exist.

- [ ] **Step 4: Implement locale helpers**

Create `lib/i18n.ts`:

```ts
export type Locale = "en" | "ar";

export function localeFromPath(pathname: string): Locale {
  return pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en";
}

export function localizePath(pathname: string, locale: Locale): string {
  const logical = pathname === "/ar" ? "/" : pathname.replace(/^\/ar(?=\/)/, "");
  if (locale === "en") return logical || "/";
  return logical === "/" ? "/ar" : `/ar${logical}`;
}
```

- [ ] **Step 5: Run the locale tests**

Run: `npm test -- tests/i18n.test.ts`
Expected: PASS.

- [ ] **Step 6: Add global theme tokens and root layout**

Define CSS variables for light/dark backgrounds, text, muted text, border, surface, and Mirai accent. Add a root layout that sets English document defaults, includes a small inline theme bootstrap script that reads `localStorage.mirai-theme`, and exposes CSS via `data-theme="dark"` on `<html>`.

- [ ] **Step 7: Copy brand assets into public**

Copy:
- `/mnt/data/Mirai Logo.png` -> `public/brand/mirai-logo.png`
- `/mnt/data/Mirai Logo black.png` -> `public/brand/mirai-logo-black.png`

- [ ] **Step 8: Run tests and commit**

Run: `npm test`
Expected: PASS.

Commit:

```bash
git add .
git commit -m "chore: scaffold Mirai website foundations"
```

---

### Task 2: Create typed bilingual content and shared shell

**Files:**
- Create: `content/site-content.ts`
- Create: `tests/content.test.ts`
- Create: `components/site-header.tsx`
- Create: `components/site-footer.tsx`
- Create: `components/theme-toggle.tsx`
- Create: `components/locale-switch.tsx`
- Create: `components/ui/button-link.tsx`
- Create: `components/ui/container.tsx`

**Interfaces:**
- Produces: `siteContent.en` and `siteContent.ar` with the same keys.
- Consumes: `Locale`, `localizePath`, `localeFromPath` from `lib/i18n.ts`.
- Produces: `<SiteHeader locale={locale} />` and `<SiteFooter locale={locale} />`.

- [ ] **Step 1: Write content parity tests**

Create `tests/content.test.ts` that asserts both locales include navigation labels, hero H1, CTA labels, audiences, FAQ entries, and footer philosophy. Also assert English hero H1 equals exactly:

```ts
"Websites built around what your business needs to achieve."
```

- [ ] **Step 2: Run the content test and verify it fails**

Run: `npm test -- tests/content.test.ts`
Expected: FAIL because `content/site-content.ts` does not exist.

- [ ] **Step 3: Implement typed bilingual content**

Create a single `SiteContent` TypeScript interface and supply full English/Arabic dictionaries. Arabic copy should be natural business Arabic, while key technical/business terms may remain in English where that improves clarity.

- [ ] **Step 4: Run content tests**

Run: `npm test -- tests/content.test.ts`
Expected: PASS.

- [ ] **Step 5: Build header, locale switch, theme toggle, and footer**

Implement:
- responsive desktop navigation and mobile menu;
- same-page locale switch using `localizePath`;
- theme toggle that persists `light`/`dark` in localStorage and updates the root `data-theme`;
- logo variant that remains legible in both themes;
- footer with `The future belongs to those who create it.` and Arabic equivalent.

- [ ] **Step 6: Run tests and commit**

Run: `npm test`
Expected: PASS.

Commit:

```bash
git add .
git commit -m "feat: add bilingual site shell and content"
```

---

### Task 3: Build the editorial homepage in both locales

**Files:**
- Create: `components/home/home-page.tsx`
- Create: `components/home/hero.tsx`
- Create: `components/home/trust-strip.tsx`
- Create: `components/home/problem.tsx`
- Create: `components/home/audiences.tsx`
- Create: `components/home/difference.tsx`
- Create: `components/home/featured-work.tsx`
- Create: `components/home/process.tsx`
- Create: `components/home/why-mirai.tsx`
- Create: `components/home/audit-cta.tsx`
- Create: `components/home/faq.tsx`
- Create: `app/page.tsx`
- Create: `app/ar/page.tsx`

**Interfaces:**
- Consumes: `SiteContent` sections from `content/site-content.ts`.
- Produces: `<HomePage locale="en" | "ar" />`.

- [ ] **Step 1: Implement homepage composition**

Build the approved hierarchy:
Hero -> Trust -> Problem -> Who We Help -> Different Businesses -> Featured Work -> How We Work -> Why Mirai -> Audit CTA -> FAQ -> Final CTA.

Use editorial layout rules:
- oversized hero typography;
- asymmetrical visual composition;
- fewer box cards, with audience rows/large blocks instead;
- one cinematic dark section for Why Mirai;
- strong whitespace;
- restrained cyan/mint accent;
- CSS transitions and reduced-motion support.

- [ ] **Step 2: Add English and Arabic page entry points**

`app/page.tsx` renders `<HomePage locale="en" />`; `app/ar/page.tsx` renders `<HomePage locale="ar" />`. Each route sets correct `lang`/`dir` at page-shell level and localized metadata.

- [ ] **Step 3: Add responsive behavior**

Verify hero, audience blocks, process rows, featured work, and audit CTA collapse cleanly to a single-column mobile layout without horizontal overflow.

- [ ] **Step 4: Run tests and production build**

Run:

```bash
npm test
npm run build
```

Expected: all tests PASS and Next.js production build succeeds.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: build bilingual Mirai homepage"
```

---

### Task 4: Build the five supporting pages

**Files:**
- Create: `components/pages/content-page.tsx`
- Create: `app/solutions/page.tsx`
- Create: `app/ar/solutions/page.tsx`
- Create: `app/who-we-help/page.tsx`
- Create: `app/ar/who-we-help/page.tsx`
- Create: `app/work/page.tsx`
- Create: `app/ar/work/page.tsx`
- Create: `app/about/page.tsx`
- Create: `app/ar/about/page.tsx`
- Create: `app/audit/page.tsx`
- Create: `app/ar/audit/page.tsx`

**Interfaces:**
- Consumes: localized page content from `siteContent`.
- Produces: six consistent core page experiences across both locales.

- [ ] **Step 1: Implement Solutions**

Present the service as one end-to-end solution rather than separate agency services: Understand -> Structure -> Create -> Launch, with strategy/content/design/development/handover detail.

- [ ] **Step 2: Implement Who We Help**

Present SMEs & Growing Businesses first, followed by Manufacturing & Industrial, Retail & Local Chains, and NGOs & Organizations. Include a clear `Don't see your sector here?` message.

- [ ] **Step 3: Implement Work**

Create a premium selected-work page with a verified NGO project placeholder shell that does not invent client results. Structure each work item around challenge, role, and transformation.

- [ ] **Step 4: Implement About**

Explain Mirai = Future, business-first philosophy, founder experience, and lean operating approach without implying Mirai itself has existed for 12+ years.

- [ ] **Step 5: Implement Audit page shell**

Create the editorial intro and reserve the main content area for the form implemented in Task 5.

- [ ] **Step 6: Run build and commit**

Run:

```bash
npm test
npm run build
```

Expected: PASS.

Commit:

```bash
git add .
git commit -m "feat: add Mirai core marketing pages"
```

---

### Task 5: Implement the Free Digital Presence Audit form and WhatsApp follow-up

**Files:**
- Create: `lib/audit.ts`
- Create: `tests/audit.test.ts`
- Create: `components/audit/audit-form.tsx`
- Create: `app/api/audit/route.ts`
- Modify: `app/audit/page.tsx`
- Modify: `app/ar/audit/page.tsx`
- Create: `.env.example`

**Interfaces:**
- Produces: `AuditLead` type.
- Produces: `validateAuditLead(input: unknown): { ok: true; data: AuditLead } | { ok: false; errors: Record<string, string> }`.
- Produces: `buildWhatsAppMessage(lead: AuditLead, locale: Locale): string`.
- API: `POST /api/audit` returns `{ ok: true }` or `{ ok: false, errors?: Record<string,string>, message?: string }`.

- [ ] **Step 1: Write failing audit validation tests**

Test that:
- name/company/email/WhatsApp/business type/improvement goal are required;
- website is optional but must be a valid URL when present;
- email validation rejects malformed values;
- WhatsApp message contains name and company in both locale variants.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- tests/audit.test.ts`
Expected: FAIL because `lib/audit.ts` does not exist.

- [ ] **Step 3: Implement validation and WhatsApp message helpers**

Use explicit string checks and URL/email parsing without a heavyweight form library. Normalize whitespace and limit field lengths.

- [ ] **Step 4: Run audit tests**

Run: `npm test -- tests/audit.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement API route**

Parse JSON, validate through `validateAuditLead`, and if `RESEND_API_KEY` plus `MIRAI_LEAD_EMAIL` are configured, send via Resend REST API using `fetch`. If they are not configured, log a safe redacted development message and return success so local demos remain usable. Never log the full WhatsApp number or email address.

- [ ] **Step 6: Implement AuditForm**

Build accessible fields, inline errors, loading state, and success state. On success, show a WhatsApp CTA using:

```ts
const href = `https://wa.me/${process.env.NEXT_PUBLIC_MIRAI_WHATSAPP}?text=${encodeURIComponent(message)}`;
```

If the public WhatsApp number is not configured, hide the WhatsApp button rather than rendering a broken link.

- [ ] **Step 7: Add environment documentation**

`.env.example` contains:

```bash
RESEND_API_KEY=
MIRAI_LEAD_EMAIL=
NEXT_PUBLIC_MIRAI_WHATSAPP=
```

- [ ] **Step 8: Run tests/build and commit**

Run:

```bash
npm test
npm run build
```

Expected: PASS.

Commit:

```bash
git add .
git commit -m "feat: add audit lead flow"
```

---

### Task 6: Final quality pass, accessibility, metadata, and delivery package

**Files:**
- Modify: `app/layout.tsx`
- Modify: localized page entry files as needed for metadata.
- Create: `README.md`
- Create: `public/robots.txt`
- Create: `app/sitemap.ts`

**Interfaces:**
- Produces: documented local development and deployment workflow.
- Produces: locale-aware sitemap and basic crawler configuration.

- [ ] **Step 1: Add metadata and sitemap**

Set Mirai title/description defaults, canonical root URLs via `NEXT_PUBLIC_SITE_URL` when available, language alternates, Open Graph defaults, and sitemap entries for all English and Arabic pages.

- [ ] **Step 2: Accessibility review**

Verify:
- one H1 per page;
- navigation/buttons have accessible labels;
- visible keyboard focus;
- theme/locale controls are keyboard accessible;
- contrast works in both themes;
- reduced-motion disables nonessential transforms;
- Arabic pages render `dir="rtl"` in the primary page wrapper.

- [ ] **Step 3: Add README**

Document:
- `npm install`
- `npm run dev`
- `npm test`
- `npm run build`
- environment variables
- language routes
- theme behavior
- audit email/WhatsApp configuration
- GitHub/Vercel deployment notes without requiring a specific host.

- [ ] **Step 4: Run final verification**

Run:

```bash
npm test
npm run build
```

Expected: all tests PASS and build succeeds with no TypeScript errors.

- [ ] **Step 5: Review git status and commit**

Run:

```bash
git status --short
git log --oneline -6
```

Expected: only intended files, then clean working tree after commit.

Commit:

```bash
git add .
git commit -m "chore: finalize Mirai website v1"
```
