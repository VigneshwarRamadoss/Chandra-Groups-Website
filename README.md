# CHANDRA — Events That Move People

**Premium cinematic event-production website** built for Chandra Groups.

> *"We create experiences that move people."*

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Live Preview](#2-live-preview)
3. [Tech Stack](#3-tech-stack)
4. [Project Architecture](#4-project-architecture)
5. [Design System](#5-design-system)
6. [Section-by-Section Guide](#6-section-by-section-guide)
7. [File Structure](#7-file-structure)
8. [Getting Started (Developers)](#8-getting-started-developers)
9. [Content Management](#9-content-management)
10. [Figma / Design Reference](#10-figma--design-reference)
11. [Font Setup](#11-font-setup)
12. [Media Assets](#12-media-assets)
13. [Deployment](#13-deployment)
14. [Contributing Guidelines](#14-contributing-guidelines)
15. [Roadmap / Known Placeholders](#15-roadmap--known-placeholders)

---

## 1. Project Overview

Chandra Groups is a premium event production company. This website serves as their primary marketing and conversion platform, designed to communicate:

- **Scale** — corporate summits, product launches, college festivals, award nights, brand activations
- **Craft** — cinematic aesthetics, production-grade design, surgical precision
- **Trust** — featured brand clients, featured work, and a clear process

The website is a **single-page application (SPA)** with a curated narrative scroll flow:

```
Hero (Cinematic Video)
  ↓
Trusted Brands (Credibility Rail)
  ↓
Our Philosophy (Emotional Transformation)
  ↓
Featured Experience (Case Study Proof)
  ↓
Work / Event Experiences (3D Cinematic Gallery)
  ↓
How We Bring It To Life (Process)
  ↓
Final CTA (Conversion)
  ↓
Footer
```

---

## 2. Live Preview

```
Local Dev:    http://localhost:3000
```

> Production URL: TBD (Vercel deployment recommended)

---

## 3. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 15** (App Router) | React 19, SSR-ready |
| Language | **TypeScript 5.7** | Strict mode enabled |
| Styling | **Vanilla CSS** + CSS Custom Properties | No Tailwind, no CSS-in-JS library |
| Animation | **GSAP 3.12** | Available globally, used for scroll/transition animations |
| Fonts | Self-hosted WOFF2 | Monument Grotesk, Söhne, Canela |
| Images | WebP format | Optimized, lazy-loaded |
| Video | MP4 / WebM | Muted autoplay hero, HLS-ready for CDN |
| State | React `useState` / `useRef` / `useEffect` | No external state library |
| Scroll | Native `window.addEventListener('scroll')` + `requestAnimationFrame` | No Lenis or other inertia library currently active |
| Deployment | **Vercel** (recommended) | Zero-config Next.js deployment |

---

## 4. Project Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root HTML shell, metadata, viewport
│   ├── page.tsx            # SPA root — composes all sections in order
│   └── globals.css         # Global resets, base styles, utility classes
│
├── components/             # One file per section / UI element
│   ├── Navigation.tsx      # Sticky top nav with scroll-aware behavior
│   ├── Hero.tsx            # Cinematic video hero with CTA
│   ├── TrustedClients.tsx  # Animated marquee brand logo rail
│   ├── Philosophy.tsx      # Asymmetric editorial + scroll-transformation visual
│   ├── FeaturedExperience.tsx  # Case study spotlight card
│   ├── EventExperiences.tsx    # 3D depth-scroll cinematic gallery (WORK)
│   ├── Process.tsx         # 5-step production pipeline visualization
│   ├── FinalCTA.tsx        # Fullscreen emotional conversion CTA
│   ├── Footer.tsx          # Minimal footer with links
│   ├── EnquiryModal.tsx    # Full-screen event enquiry form modal
│   └── CaseStudyModal.tsx  # Lightbox case study detail modal
│
├── content/
│   └── siteContent.ts      # ⭐ SINGLE SOURCE OF TRUTH for all copy & content data
│
└── styles/
    └── tokens.css          # ⭐ SINGLE SOURCE OF TRUTH for all design tokens
```

### Data Flow

```
siteContent.ts  →  component props / JSX
tokens.css      →  CSS custom properties (var(--token-name))
public/media/   →  image & video assets referenced by siteContent.ts
public/fonts/   →  self-hosted WOFF2 font files loaded in tokens.css
```

---

## 5. Design System

### Color Palette

All colors are defined as **CSS custom properties** in [`src/styles/tokens.css`](./src/styles/tokens.css).

| Token | Value | Role |
|---|---|---|
| `--color-black` | `#070807` | Near-black; primary background for dark sections |
| `--color-charcoal` | `#11120F` | Card / overlay backgrounds |
| `--color-charcoal-elevated` | `#181A16` | Hover surfaces |
| `--color-ivory` | `#F3EFE6` | Warm ivory; light section backgrounds |
| `--color-ivory-soft` | `#E9E3D7` | Subtle surface variation on ivory |
| `--color-gold` | `#C6A15B` | Champagne gold; accents, CTAs, dividers |
| `--color-gold-hover` | `#D8B573` | Gold hover state |
| `--color-white` | `#F8F7F3` | Off-white; text on dark backgrounds |
| `--color-muted-dark` | `#8E9398` | Muted text on dark |
| `--color-muted-light` | `#6B665F` | Muted text on light/ivory |

### Typography

| Token | Font | Role |
|---|---|---|
| `--font-display-condensed` | **Monument Grotesk Condensed Heavy** | Hero headline (`MOVE PEOPLE`) |
| `--font-display` | **Monument Grotesk** | Section headlines, nav, titles |
| `--font-body` | **Söhne** | Body copy, eyebrows, metadata, CTAs |
| `--font-mono` | **Monument Grotesk Semi-Mono** | Technical annotations, indices |
| `--font-serif` | **Canela Light** | Emotional display (`MORE THAN EVENTS`) |

> ⚠️ Fonts are **not bundled** — they must be placed in `/public/fonts/` as WOFF2 files. See [Font Setup](#11-font-setup).

### Spacing & Layout

| Token | Value |
|---|---|
| `--container-max` | `1380px` |
| `--page-pad-x` | `clamp(20px, 4vw, 64px)` |
| `--section-pad-y` | `clamp(72px, 8vw, 140px)` |

### Motion

| Token | Value | Use |
|---|---|---|
| `--ease-cinematic` | `cubic-bezier(0.22, 1, 0.36, 1)` | Section reveals, hover transitions |
| `--ease-ui` | `cubic-bezier(0.16, 1, 0.3, 1)` | UI micro-interactions |
| `--duration-fast` | `220ms` | Quick feedback |
| `--duration-medium` | `450ms` | Content transitions |
| `--duration-slow` | `850ms` | Page-level reveals |

> All scroll animations respect `prefers-reduced-motion: reduce`.

---

## 6. Section-by-Section Guide

### 01 — Navigation (`Navigation.tsx`)

- Sticky top bar, transitions from transparent-on-dark to semi-opaque on scroll
- Left: `CHANDRA` wordmark + `EVENTS BEYOND ORDINARY` subline
- Right: Nav links (`ABOUT`, `WORK`, `SERVICES`, `CONTACT`) + `PLAN AN EVENT →` CTA button
- CTA button opens the **Enquiry Modal**

---

### 01.5 — Trusted Brands Rail (`TrustedClients.tsx`)

- Warm Ivory `#F3EFE6` background
- Eyebrow label: `SELECTED BRANDS WE'VE WORKED WITH` (Söhne, 11px, uppercase)
- **10 placeholder brand names** displayed as a continuously scrolling marquee
- Slow cinematic marquee speed — not a fast SaaS scroll
- Section height: ~100px desktop; compact credibility signal

> 🔄 **Placeholder**: Replace brand names with actual Chandra client logos once confirmed.

---

### 02 — Our Philosophy (`Philosophy.tsx`)

- Ivory `#F3EFE6` background
- **Asymmetric layout**: Left editorial block (~35%) / Right cinematic image (~52%)
- Left:
  - Eyebrow: `OUR PHILOSOPHY`
  - Headline: `MORE THAN / EVENTS` (Canela Light serif)
  - Subline: `WE CREATE MOMENTS THAT MATTER`
  - Body: Short emotional copy
  - CTA: `SEE OUR APPROACH →`
- Right: **Scroll-driven 3-state visual transformation**:
  - **State 01 — Intention**: Darker, desaturated, technical blueprint overlays (crop marks, grid lines, micro labels)
  - **State 02 — Atmosphere**: Technical marks fade, warm amber practical lights bloom
  - **State 03 — Impact**: Full cinematic grade, technical overlays gone, `IDEAS · PEOPLE · EXPERIENCES` annotations appear

---

### 03 — Featured Experience (`FeaturedExperience.tsx`)

- Full-width case study spotlight
- Displays key stats (attendees, scope, scale), visual, brief summary
- Opens **Case Study Modal** on CTA click

> 🔄 **Placeholder**: Case study data in `siteContent.ts` — populate with real client project details.

---

### 04 — Work / Event Experiences (`EventExperiences.tsx`)

The **main interactive section**. A premium cinematic 3D vertical gallery.

- **Desktop**: Sticky scroll track (~290vh). Five categories scroll sequentially.
  - **Left**: Stable editorial column — headline, active category card (`01/05` → `05/05`), short description, 5-step interactive progress indicators, CTA
  - **Right**: 3D perspective gallery — active item scaled full cinematic, inactive items recede in depth, opacity, scale, and subtle rotateX tilt
- **Mobile**: Stacked cinematic cards — no 3D overhead, touch-scroll friendly
- **Categories**:
  1. Corporate Events — *Built for attention, clarity and scale.*
  2. Product Launches — *The reveal moment, engineered for impact.*
  3. College Festivals — *Unbridled energy and collective celebration.*
  4. Award Nights — *Prestige, precision and cinematic recognition.*
  5. Brand Activations — *Immersive worlds where audiences connect.*

---

### 05 — Process (`Process.tsx`)

- `HOW WE BRING IT TO LIFE` header
- 5-step pipeline visualization: `CONCEPT → DESIGN → PRODUCE → MANAGE → DELIVER`
- Horizontal step-bar with icons and active/inactive state animation

---

### 06 — Final CTA (`FinalCTA.tsx`)

- Fullscreen emotional conversion section
- `LET'S CREATE` headline
- Opens Enquiry Modal

---

### Overlays / Modals

| Component | Purpose |
|---|---|
| `EnquiryModal.tsx` | Event enquiry form: name, email, phone, event type, city, budget, message |
| `CaseStudyModal.tsx` | Expanded case study details with imagery |

---

## 7. File Structure

```
ChandraGroupsDesign/
├── public/
│   ├── fonts/                    # ⚠️ WOFF2 font files (not committed — see Font Setup)
│   │   ├── MonumentGrotesk-Condensed-Heavy.woff2
│   │   ├── MonumentGrotesk-Regular.woff2
│   │   ├── MonumentGrotesk-Medium.woff2
│   │   ├── MonumentGrotesk-SemiMono.woff2
│   │   ├── Sohne-Buch.woff2
│   │   ├── Sohne-Medium.woff2
│   │   └── Canela-Light.woff2
│   └── media/                    # WebP images & video
│       ├── hero-poster.webp
│       ├── philosophy-production.webp
│       ├── featured-launch.webp
│       ├── cta-finale.webp
│       ├── cat-corporate.webp
│       ├── cat-product.webp
│       ├── cat-college.webp
│       ├── cat-awards.webp
│       └── cat-activations.webp
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/               # 11 section components
│   ├── content/
│   │   └── siteContent.ts        # All copy, titles, alt text, category data
│   └── styles/
│       └── tokens.css            # All CSS variables / design tokens
│
├── Design.MD                     # Visual direction & brand guidelines
├── Implementation.MD             # Technical implementation notes
├── PRD.MD                        # Product requirements document
├── Typography.MD                 # Font & type system reference
├── UI-UX20brief.MD               # UX brief
├── Site Map.MD                   # Page & section sitemap
├── Parallax%20Scrolling.MD       # Scroll interaction specifications
├── Approved20Reference.png       # Figma-approved visual reference screenshot
├── next.config.mjs
├── package.json
└── tsconfig.json
```

---

## 8. Getting Started (Developers)

### Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9 or **pnpm** / **yarn**
- **Font files** in `/public/fonts/` (see [Font Setup](#11-font-setup))

### Install & Run

```bash
# Clone the repo
git clone https://github.com/VigneshwarRamadoss/Chandra-Groups-Website.git
cd Chandra-Groups-Website

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build & Production

```bash
# Type-check
npx tsc --noEmit

# Production build
npm run build

# Start production server locally
npm start
```

### Key Dev Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Next.js dev server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm start` | Serve production build locally |
| `npm run lint` | ESLint checks |

---

## 9. Content Management

**All content lives in one file**: [`src/content/siteContent.ts`](./src/content/siteContent.ts)

This is the single source of truth for:
- All section copy (headlines, body text, CTAs, eyebrows)
- Category titles and descriptions
- Image paths and alt text
- Process step labels
- Featured experience data (stats, scope)

### How to Edit Copy

1. Open `src/content/siteContent.ts`
2. Find the relevant section (e.g. `philosophy`, `experiences`, `featured`)
3. Edit the string values
4. Save — hot-reload reflects instantly in dev

### How to Change Images

1. Add your new WebP image to `public/media/`
2. Update the `image` path in `siteContent.ts` for the relevant category
3. Update the `alt` text

### Example Content Entry

```typescript
// In siteContent.ts
categories: [
  {
    id: 'corporate',
    index: '01',
    title: 'Corporate Events',
    shortDesc: 'Built for attention, clarity and scale.',
    image: '/media/cat-corporate.webp',
    alt: 'Corporate keynote auditorium summit...',
  },
  // ...
]
```

---

## 10. Figma / Design Reference

> For UI/UX Designers

### Figma Source of Truth

The **approved visual reference** is included as [`Approved20Reference.png`](./Approved20Reference.png) in the project root.

This is the final approved Figma composition. All section layouts, spacing, typography choices, and color use should refer back to this reference.

### Design Documents in Repo

| File | Audience | Contains |
|---|---|---|
| `Design.MD` | All | Brand guidelines, color palette, typography, visual direction |
| `Typography.MD` | Designers + FE Devs | Font system, size scales, line-height rules |
| `PRD.MD` | All | Product requirements, feature scope |
| `UI-UX20brief.MD` | Designers | Full UX brief, user journey, section objectives |
| `Site Map.MD` | All | Page structure, section order, navigation map |
| `Parallax%20Scrolling.MD` | Designers + FE Devs | Scroll interaction specs for each animated section |
| `Implementation.MD` | FE Devs | Technical notes, component structure decisions |

### Design Tokens → Code Mapping

| Figma Token | CSS Variable | File |
|---|---|---|
| Near Black | `--color-black` | `tokens.css` |
| Warm Ivory | `--color-ivory` | `tokens.css` |
| Champagne Gold | `--color-gold` | `tokens.css` |
| Display Condensed | `--font-display-condensed` | `tokens.css` |
| Canela Serif | `--font-serif` | `tokens.css` |
| Body / Söhne | `--font-body` | `tokens.css` |

### Section Composition Rules

- **Dark sections** (Hero, Work, Process, CTA, Footer): `--color-black` / `--color-charcoal` backgrounds
- **Light sections** (Trusted Brands, Philosophy): `--color-ivory` background
- Gold accent used only as **highlight** — never as background fill
- All text overlaid on imagery uses vignette gradients — never a flat box

---

## 11. Font Setup

Fonts are **self-hosted** (licensed separately) and are **not included in this repository**.

### Required Files

Place these WOFF2 files in `/public/fonts/`:

```
MonumentGrotesk-Condensed-Heavy.woff2    → Hero display (MOVE PEOPLE)
MonumentGrotesk-Regular.woff2            → General display text
MonumentGrotesk-Medium.woff2             → Medium weight display
MonumentGrotesk-SemiMono.woff2           → Technical annotations, metadata
Sohne-Buch.woff2                         → Body copy (regular weight)
Sohne-Medium.woff2                       → Eyebrows, CTAs, labels
Canela-Light.woff2                       → Emotional serif headline (Philosophy)
```

### Font Licenses

- **Monument Grotesk** — [ABC Foundry](https://abcdinamo.com/typefaces/monument-grotesk)
- **Söhne** — [Klim Type Foundry](https://klim.co.nz/retail-fonts/sohne/)
- **Canela** — [Commercial Type](https://commercialtype.com/typefaces/canela)

> ⚠️ **Without font files**: the site renders using browser fallbacks (Impact, Arial, Georgia). Layout and sizing will look correct but typography will not match the Figma design.

---

## 12. Media Assets

All media assets are in `/public/media/` and served as static files.

| Asset | Section | Notes |
|---|---|---|
| `hero-poster.webp` | Hero | Video poster fallback |
| `philosophy-production.webp` | Our Philosophy | Backstage production specialist |
| `featured-launch.webp` | Featured Experience | Product launch reveal |
| `cta-finale.webp` | Final CTA | Atmospheric arena aerial |
| `cat-corporate.webp` | Work → Corporate Events | Keynote auditorium |
| `cat-product.webp` | Work → Product Launches | LED reveal environment |
| `cat-college.webp` | Work → College Festivals | Festival crowd / energy |
| `cat-awards.webp` | Work → Award Nights | Gala / trophy stage |
| `cat-activations.webp` | Work → Brand Activations | Spatial branding installation |

### Hero Video (Not Yet Committed)

The Hero section expects a video at `/public/media/hero-reel.mp4` (or `.webm`).

> 🔄 **Placeholder**: Provide an optimized ~3–8 second muted looping production reel. Maximum recommended size: 8–12 MB for web.

---

## 13. Deployment

### Recommended: Vercel

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel
```

Or connect the GitHub repository directly to [vercel.com](https://vercel.com) for automatic deployments on every push to `main`.

### Environment Variables

No environment variables are currently required for the frontend.

> If a backend API or CMS is added in the future, create a `.env.local` file (see [Contributing Guidelines](#14-contributing-guidelines)).

### Build Output

Next.js builds to `.next/` (excluded from git via `.gitignore`).

---

## 14. Contributing Guidelines

### Branches

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `dev` | Integration branch for new features |
| `feature/section-name` | Individual feature work |
| `fix/issue-description` | Bug fixes |

### Commit Convention

```
feat(section): add 3D gallery to EventExperiences
fix(nav): correct scroll-aware background transition
style(tokens): update gold accent to #C6A15B
content(siteContent): update philosophy body copy
```

### Scoped Changes

- **Content changes** (copy, images): only edit `siteContent.ts` and `public/media/`
- **Style changes**: only edit `tokens.css` or scoped `<style jsx>` inside a component
- **New components**: create new file in `src/components/`, import in `page.tsx`
- **Do NOT** modify `globals.css` without team review
- **Do NOT** modify `tokens.css` color values without design approval

### Adding a New Section

1. Create `src/components/NewSection.tsx`
2. Add content to `siteContent.ts`
3. Import and place in `src/app/page.tsx` at the correct position
4. Document the section in this README

---

## 15. Roadmap / Known Placeholders

The following items are **clearly marked as placeholders** and require real data/assets before production:

| Item | File | Status |
|---|---|---|
| Hero video reel | `public/media/hero-reel.mp4` | 🔄 Awaiting client-provided video |
| Trusted brand logos | `TrustedClients.tsx` | 🔄 Text placeholders — replace with SVG logos |
| Featured experience data | `siteContent.ts → featured` | 🔄 Dummy stats — replace with real project data |
| Case study copy | `siteContent.ts → featured.caseStudySummary` | 🔄 Placeholder copy |
| Font files | `public/fonts/` | 🔄 Licensed fonts not in repo |
| Contact form backend | `EnquiryModal.tsx` | 🔄 Form UI complete — needs API endpoint |
| SEO metadata | `src/app/layout.tsx` | 🔄 Update URL, OG images after launch |

### Planned Backend Integrations

- **Enquiry form** → Email notification (SendGrid / Resend) or CRM (HubSpot)
- **CMS** → Sanity or Contentful for case studies (optional)
- **Analytics** → Vercel Analytics or Google Analytics 4

---

## License

All code in this repository is proprietary to **Chandra Groups**.

Design assets, brand identity, and copy are copyright © Chandra Groups. Not licensed for redistribution or use outside this project.

---

<div align="center">

**CHANDRA GROUPS**

*Events Beyond Ordinary*

</div>
