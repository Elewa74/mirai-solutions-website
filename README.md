# Mirai Solutions Website

A bilingual English/Arabic marketing website for **Mirai Solutions**, a technology-driven company delivering practical digital solutions for growing businesses and organizations. Four focused solution areas — Websites & Digital Presence (flagship), Brand Essentials & Business Materials, Content Digitalization, and Digital Consulting & Smarter Workflows — with one conversion flow: a free consultation.

Dependency-free: Node 20+ renders the pages server-side (`server.mjs`) and the same renderer produces a static export for GitHub Pages. No framework, no build step.

## Run locally

```bash
npm test          # unit + integration tests (node:test)
npm run check     # tests + preflight (routes, redirects, SEO, headers, assets, API)
npm run dev       # http://localhost:3000  (Arabic: /ar)
npm run export    # static site → dist/
```

## Routes

English (default locale):

| Route | Page |
|---|---|
| `/` | Home — hero, experience, four solutions, who we help, "different businesses need different digital solutions", organizations (when configured), how we work, why Mirai, FAQ, consultation CTA |
| `/solutions` | The four solution areas in depth + how we work |
| `/who-we-help` | SMEs (umbrella) + manufacturing, retail & local chains, NGOs |
| `/about` | Mirai means Future — story, what we do today, principles |

Arabic mirrors the same logical pages under `/ar` (`/ar`, `/ar/solutions`, `/ar/who-we-help`, `/ar/about`). `lang`/`dir` switch per locale; copy lives in `content/site-content.mjs` and must keep the same shape in both languages (enforced by tests).

Legacy URLs redirect (301 on the server, `noindex` refresh pages in the static export):

| Old | New |
|---|---|
| `/work`, `/ar/work` | `/#clients`, `/ar#clients` |
| `/audit`, `/ar/audit` | `/?consult=1`, `/ar?consult=1` (opens the consultation modal) |
| `/manufacturing`, `/retail`, `/ngo` (+ `/ar/…`) | `/who-we-help` (+ `/ar/who-we-help`) |

Only the eight canonical pages appear in `sitemap.xml`. There is no website scanner, no audit page, no work/portfolio page and no per-sector or per-service pages.

## Consultation modal (the one conversion flow)

Every "Get a Free Consultation" control (`[data-consult]` in the header, hero, solution blocks, page CTAs, footer and the mobile sticky bar) opens one global modal rendered on every page (`consultationModal()` in `lib/render.mjs`, behaviour in `public/site.js`).

- Fields: name, company/organization, email, WhatsApp number, business type, interested in (four solutions + "Not sure yet"), website URL (optional), message. Solution CTAs preselect "Interested in" via `data-interest="websites|brand|content|workflows"`; `/?consult=1&interest=<key>` does the same on load.
- Accessibility: `role="dialog"` + `aria-modal`, labelled/described by the title and intro, focus moves to the first field, Tab is trapped inside, `Esc` and the backdrop close it, focus returns to the trigger, every control has a `<label for>` and an `aria-describedby` error slot, RTL layout in Arabic; near-full-screen sheet on phones.
- **Node server mode** — `POST /api/consultation` validates server-side (`lib/consultation.mjs`), emails the request through Resend to `MIRAI_LEAD_EMAIL` when `RESEND_API_KEY` is set (`lib/consultation-email.mjs`), and returns `{ ok, emailSent, emailConfigured, whatsappHref }`. The client shows "Request received" only when `emailSent` is true; otherwise it offers the WhatsApp hand-off. A Resend failure returns 502 with the WhatsApp link — never a fake success.
- **Static mode (GitHub Pages)** — the export marks `<body data-static="1">`; there is no API, so the form validates client-side. When an email relay is configured (`MIRAI_FORM_ENDPOINT`, baked in as `data-form-endpoint`), the browser POSTs the request as JSON to that endpoint (FormSubmit's AJAX API: readable field labels, `_subject`, `_replyto` = the visitor's email, `_cc` = `MIRAI_FORM_CC`) and shows "Your request has been sent" only when the relay confirms `success`; a WhatsApp button appears next to the confirmation only when `MIRAI_WHATSAPP` is configured (currently switched off in the Pages workflow so the number never appears on the site). If the relay is missing or fails, the form falls back to the WhatsApp hand-off (`https://wa.me/<MIRAI_WHATSAPP>?text=…`) with a professionally pre-filled message containing the submitted details — never a fake success. If neither is set, the visitor gets the composed message with a copy button.
- **Owner notification** — after a confirmed send (either mode) the browser fires `MIRAI_NOTIFY_URL` with `{text}` replaced by the URL-encoded message (`fetch` in `no-cors`/`keepalive` mode, so a CallMeBot-style WhatsApp API URL works). It is best-effort and never affects what the visitor sees.

## Email + WhatsApp configuration

Copy `.env.example` (or `deploy/env.production.example.txt`) and set:

- `RESEND_API_KEY`, `MIRAI_LEAD_EMAIL`, `MIRAI_FROM_EMAIL` — Resend delivery (Node server only; verify the sending domain first).
- `MIRAI_WHATSAPP` — the Mirai WhatsApp number in international digits (e.g. `2010XXXXXXXX`). Used by the server response and baked into the static export as `data-whatsapp`. On GitHub Pages it would be a repository **variable** (`Settings → Secrets and variables → Actions → Variables → MIRAI_WHATSAPP`), but the workflow line that passes it to the export is commented out on purpose — the live site is email-only and shows no number.
- `MIRAI_FORM_ENDPOINT` — static email relay: `https://formsubmit.co/ajax/<address>` (FormSubmit emails an activation link to that address on the first submission; click it once). `MIRAI_FORM_CC` — optional extra recipient(s), comma-separated. Both are GitHub repository variables like `MIRAI_WHATSAPP`.
- `MIRAI_NOTIFY_URL` — optional owner WhatsApp notification URL containing a literal `{text}` placeholder, e.g. `https://api.callmebot.com/whatsapp.php?phone=2010XXXXXXXX&apikey=<key>&text={text}` (CallMeBot needs a one-time opt-in message from that number). Note that this URL — key included — is visible in the page source; keep the key revocable.
- `SITE_URL` — canonical origin for canonical/hreflang/sitemap (`https://miraisolutions.net`).

## Organizations we've worked with

`content/organizations.mjs` holds real organizations only (`{ name, nameAr?, logo?, websiteUrl?, alt?, caseStudyUrl?, servicesProvided?, portfolioContent? }`). The homepage section `#clients` renders only when the list has entries: a logo (or a tasteful text fallback when no logo file exists) that opens the organization's real website in a new tab. Never add placeholder names or logos.

## Theme

Light is the default for every visitor (`MIRAI_THEME=light`); the header toggle switches to dark and stores the choice in `localStorage` (`mirai-theme`). `MIRAI_THEME=system` follows the device setting instead (`public/theme.mjs` + the inline no-flash script in `lib/render.mjs`). `color-scheme: only light` stops browsers' forced auto-dark from repainting the light look.

## Design system

`public/site.css`: tokens (cool paper + cyan/mint/blue gradient accent, fluid type scale, spacing rhythm), Manrope/Inter for Latin and Readex Pro/IBM Plex Sans Arabic for Arabic, editorial layouts with generous whitespace, one restrained dark band per page, photography via `<picture>` (WebP + JPG, intrinsic sizes, localized alt), and a motion layer (scroll reveals, hero ring, magnetic CTA, dot grid) that is fully disabled under `prefers-reduced-motion`. Verified at 1440 / 768 / 375 in both locales and both themes with no horizontal overflow.

## SEO

Per-page titles and descriptions (`content/site-content.mjs → meta`), canonical, `hreflang` en/ar/x-default, Open Graph, `twitter:card`, JSON-LD (`Organization`, `WebSite`, four `Service` entries; `FAQPage` on the home page), `robots.txt` and `sitemap.xml`. Redirect and 404 pages are `noindex`.

## Tests

`tests/` (node:test, no dependencies): content parity + positioning rules, renderer (IA, CTAs, modal markup, metadata, no scanner/legacy links), consultation validation/WhatsApp/email, HTTP handler (email modes), live server (301s, `/api/scan` gone, sitemap), static export (redirect pages, links resolve, WhatsApp baked, preview mode), theme, i18n, canonical-host redirect. `tests/browser.test.mjs` covers the modal end-to-end (open/close, focus trap, preselect, `?consult=1`, validation, static WhatsApp fallback, static email relay + owner notification with a mocked FormSubmit/CallMeBot, theme toggle, 375px overflow) and runs only when Playwright is available (`npm i -D playwright` or `PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs`); it is skipped otherwise.

## Static site on GitHub Pages

`.github/workflows/pages.yml` runs the tests and publishes `npm run export` on every push to `main`. Pages get folder URLs (`/solutions/`), root-relative URLs are prefixed with the Pages base path, legacy URLs become `noindex` redirect pages, a project-site preview is `noindex`, and a custom-domain build (currently `miraisolutions.net`) is indexable with a sitemap. On Pages the consultation form emails through the FormSubmit relay when `MIRAI_FORM_ENDPOINT` is set (with the WhatsApp hand-off as the fallback) and pings `MIRAI_NOTIFY_URL` after a confirmed send; Resend delivery needs the Node server.

## Deploy the Node server

See `PRE-LAUNCH.md`. `render.yaml` is a Render Blueprint (set the secrets in the service's Environment tab); `deploy/` holds a systemd unit + Caddyfile for a VPS and a Dockerfile. `MIRAI_REDIRECT_TO_SITE_URL=1` turns on a 301 from any other host to `SITE_URL` once DNS points at the server.
