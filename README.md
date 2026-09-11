# Mirai Solutions Website

Bilingual English/Arabic marketing website for Mirai Solutions with RTL/LTR support, light-first theming with an optional dark mode, responsive editorial layouts, brand photography, and a Free Digital Presence Audit lead flow.

## Run locally

```bash
npm test
npm run dev
```

Open `http://localhost:3000`.

## Routes

English (default):
- `/`
- `/solutions`
- `/who-we-help`
- `/manufacturing`, `/retail`, `/ngo` — segment playbooks (content in `content/segments.mjs`)
- `/work`
- `/about`
- `/audit` (accepts `?site=<url>&score=<n>` hand-off from the instant scan)

Arabic uses the same logical pages under `/ar`, for example `/ar/about`.

## Homepage hero (v1.4)

Light, typographic hero: the headline rotates the audience word ("factory / retail chain / organization / business") in the brand gradient while the **Mirai ring** — an abstract of the logo's "a" — draws itself and lights the matching segment node. One lead sentence, one primary CTA, one text link to the scan. Everything else moved out of the hero:
- **Mirai Lens** band (`#lens`) directly below: the instant website scan.
- **"Different businesses need different websites"** section: sector tabs + live website preview (was the hero device) and the four facts (12+ years, AR/EN, one team, 0 templates).

Hero copy lives in `content/site-content.mjs` → `home.hero.rotate` / `home.hero.ring` for both locales.

## Motion layer (v1.5)

Site-wide, all CSS/vanilla JS, all disabled under `prefers-reduced-motion`: page fade-in, scroll progress bar, header shrink on scroll, cursor-reactive dot grid in the hero, rotating audience word + Mirai ring, staggered scroll reveals (lists, cards, timeline draw-on), animated counters, magnetic/shine CTAs, 3D tilt on cards, cursor glow on dark bands, smooth FAQ. Patterns reviewed against 21st.dev components (interactive dot-grid hero, staggered word reveal, infinite marquee, bounce cards) and rebuilt dependency-free.

## Responsive

Verified at 375px on all 12 routes (EN + AR): no horizontal scroll, tap targets ≥ 42px, header/nav/hero/Lens/demo/forms stack correctly.

## Mirai Lens — instant scan (v1.2)

`POST /api/scan { url }` fetches the public home page server-side (9s timeout, 1.5MB cap, no external services) and runs 10 business-first checks — clarity, CTA, mobile, speed, HTTPS, Arabic/English, search & AI visibility, content depth, visual trust, business-model fit — returning a 0–100 score with AR/EN labels and advice (`lib/scan.mjs`). Rate-limited to 12 scans/minute per IP. The hero form renders the report inline and hands the URL + score to `/audit`, where they are attached to the lead (email includes budget, timeline and scan score).

## SEO

Every page ships canonical + `hreflang` (en/ar/x-default), Open Graph locale/url, and JSON-LD (`Organization`, `WebSite`, `Service`; `FAQPage` on the home page). Set `SITE_URL` in production so absolute URLs are correct.

## Photography, palette & typography (v1.6)

**Photography.** Eight AI-generated, brand-toned photos (Egyptian/regional settings, teal palette) live in `public/images/` as `name-1600.webp` + `name-800.webp` (+ `name-1200.jpg` fallback, `name-thumb.webp` for row thumbnails). They are placed by `picture()` in `lib/render.mjs`, which emits `<picture>` with `srcset/sizes`, intrinsic `width/height` (no layout shift), `loading="lazy"` everywhere except the segment-page hero (eager + `<link rel="preload">` for LCP), and **localised alt text** (`imageAlt.en/.ar`). Placements: home experience band (team), audience rows (thumbnails), work case frame (work), segment heroes (photo behind the device mockup), about story (about), audit sidebar (audit), Mirai Lens background (glass, decorative). `og:image` + `twitter:card` are set per page. Total weight ≈ 1.9 MB for all variants; a page loads ~250–400 KB of imagery.

**Palette polish (same direction).** Tokens in `:root`: cool paper `--bg #f6f8fa`, `--surface-tint`, deeper neutrals (`--muted #5c6a7c` ≥ 5:1), a dedicated **`--accent-text #077a84`** for teal text (kickers, indices, text links — 5.1:1 on white; the bright `--accent` stays for fills and borders), tinted shadows (`--shadow`, `--photo-shadow`), `--danger`, a deeper CTA gradient for legible white labels, and a soft grain texture on dark bands. Dark theme mirrors every token.

**Typographic scale.** Fluid tokens `--fs-display/h1/h2/h3/lead/body/small/micro`, line-height tokens (`--lh-tight 1.02` for display, `1.08` headings, `1.3` sub-heads, body `1.6`), tracking tokens, `text-wrap: balance` on headings and `pretty` on paragraphs, and a reading measure (`main p { max-width: 62ch }`). **Arabic overrides:** body `1.85`, h1 `1.22`, h2 `1.28`, h3 `1.5`, lists `1.8`, no letter-spacing, weights capped at 600/700 so Readex Pro / IBM Plex Sans Arabic never synthesise bold. Section rhythm uses `--space-section` / `--space-block`.

## Theme

The light look is the default for every visitor (`MIRAI_THEME=light`, the default); the header toggle switches to dark and the choice is stored in `localStorage` under `mirai-theme`. To follow the device's light/dark setting instead, deploy with `MIRAI_THEME=system` (policy in `public/theme.mjs`, mirrored by the inline no-flash script in `lib/render.mjs`).

## Audit email and WhatsApp

Copy `.env.example` values into your host environment. Email sending uses the Resend HTTP API only when `RESEND_API_KEY` and `MIRAI_LEAD_EMAIL` are configured. Without those variables, local/demo submissions still validate and return success without sending email.

For WhatsApp follow-up, set `MIRAI_WHATSAPP` to the Mirai WhatsApp number in international format.

## Architecture note

This current build is dependency-free (Node + HTML/CSS/JS) because the execution environment could not reach the npm registry while building the site. The content model, routes, and UI can later be migrated to Next.js without changing the information architecture or visual direction.

## Deploy

See `PRE-LAUNCH.md` for the checklist. `npm run check` runs the tests and the 253-point preflight (routes, SEO, headers, assets, API). `render.yaml` (repo root) is a Render Blueprint — free plan for review, `SITE_URL=https://miraisolutions.net` (the domain is registered at NameSilo; DNS steps in PRE-LAUNCH.md), and `MIRAI_REDIRECT_TO_SITE_URL=1` turns on a 301 from any other host (onrender.com, www) to the canonical domain once DNS is live; `deploy/` holds a systemd unit + Caddyfile for a VPS and a Dockerfile. Copy `deploy/env.production.example.txt` to `.env` and run `npm run start:prod`.
