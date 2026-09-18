# CHANDRA — Design System & Visual Direction

## 1. Design Status
This document describes the **approved single-page Chandra event-management website design**.

The attached **Approved Design Reference.png** is the primary visual source of truth. The reference websites listed below are only for understanding event-industry information architecture, trust signals, and content expectations. **Do not copy their layouts, compositions, typography, or section styling.**

### Structural references only
- https://www.heliosevent.in
- http://www.revents.in
- https://circusinc.in
- https://proscenium.com

## 2. Brand Idea
**Chandra creates events that move people.**

The website should feel like entering a high-production event before the event has even started: dark anticipation, controlled light, scale, precision, then a dramatic reveal.

### Personality
- Premium, modern, cinematic
- Confident, not loud
- Luxury through restraint, not decoration
- Experiential, not corporate-template
- Broad enough for corporate events, product launches, college festivals, award nights, brand activations, and live experiences
- Never wedding-centric

## 3. Core Visual Language

### Color palette
| Token | Value | Use |
|---|---:|---|
| `ink` | `#090B0D` | Main dark background |
| `ink-soft` | `#12161A` | Elevated dark surfaces |
| `ivory` | `#F2EEE6` | Editorial light sections |
| `paper` | `#FAF8F3` | Secondary light background |
| `champagne` | `#C6A56A` | Accent, borders, CTAs, micro-details |
| `champagne-soft` | `#D7C39A` | Hover/highlight only |
| `cool-blue` | `#5B7FA4` | Event-lighting accent inside media only |
| `white` | `#F9F9F7` | Text on dark |
| `muted-dark` | `#8D9297` | Secondary text on dark |
| `muted-light` | `#68635C` | Secondary text on light |

**Rule:** gold/champagne must remain under ~10% of the interface. It is an accent, not a background theme.

## 4. Layout System
- Desktop design frame: **1440 px**
- Max content width: **1320 px**
- Desktop grid: **12 columns**
- Desktop outer margin: 48–64 px
- Tablet outer margin: 32 px
- Mobile outer margin: 20 px
- Section spacing desktop: 120–160 px
- Section spacing mobile: 72–96 px
- Border radius: 0–4 px only; avoid rounded-card SaaS aesthetics
- Dividers: 1 px, low-contrast champagne/gray

## 5. One-Page Section Design

### 01 — Hero / `#home`
**Purpose:** immediate premium perception + communicate what Chandra does.

**Background:** full-bleed cinematic event video, 16:9 desktop crop, darkened for legibility.

**Composition:**
- Header floats over video
- CHANDRA wordmark top-left
- Primary nav centered/right
- `PLAN AN EVENT →` outlined CTA top-right
- Large headline anchored left
- Right side of video retains visual spectacle

**Copy hierarchy:**
- Eyebrow: `EVENTS THAT`
- H1: `MOVE` / `PEOPLE`
- Descriptor: `IDEAS · PRODUCTION · EXPERIENCES`
- CTA: `LET'S CREATE →`

**Video framing:** keep left 35–40% darker and less visually busy so headline remains readable.

### 02 — Philosophy / `#about`
**Purpose:** explain Chandra in one emotional idea without over-explaining.

**Background:** warm ivory.

**Layout:** asymmetric editorial split.
- Left: heading `More Than Events`
- Under heading: `WE CREATE MOMENTS THAT MATTER`
- Middle: 2–3 line description
- Right: tall cinematic production/event image
- Right image can carry subtle vertical microcopy such as `IDEAS / PEOPLE / POSSIBILITIES`

**Content limit:** maximum 45–55 words.

### 03 — Featured Experience / `#featured`
**Purpose:** demonstrate scale, production quality, and capability through one hero project.

**Background:** near-black.

**Layout:**
- Left 35–40%: project title and CTA
- Right 60–65%: large event/product-launch image or short muted loop
- Bottom: 3–4 concise proof points

**Default example structure:**
- Label: `FEATURED EXPERIENCE`
- Title: `A Global Product Launch`
- Subline: `IDEAS ON A BIGGER STAGE`
- CTA: `VIEW CASE STUDY →`
- Proof: `1 ICONIC REVEAL` / `3,000 ATTENDEES` / `IMMERSIVE STAGE DESIGN` / `GLOBAL MEDIA REACH`

Use real client/project information when available. Never fabricate production statistics in the final live site.

### 04 — Event Experiences / `#work`
**Purpose:** make Chandra's range instantly understandable.

**Background:** ivory.

**Heading:** `Every Event. A New Story`

**Cards:** five tall editorial image panels:
1. Corporate Events
2. Product Launches
3. College Festivals
4. Award Nights
5. Brand Activations

**Desktop:** 5-column gallery or responsive 10/12-column composition.
**Mobile:** horizontal snap-scrolling carousel with 80–86vw cards.

Cards should be image-first. No long descriptions inside cards.

### 05 — Process / `#process`
**Purpose:** reduce perceived risk and show end-to-end control.

**Background:** near-black.

**Heading:** `HOW WE BRING IT TO LIFE`

**Five steps:**
1. Concept
2. Design
3. Produce
4. Manage
5. Deliver

Use minimal line icons, numbered stages, and a subtle champagne connecting line. Avoid paragraphs.

### 06 — Final CTA / `#contact`
**Purpose:** convert interest into enquiry.

**Background:** full-bleed event finale image/video with warm-gold lighting and crowd silhouette.

**Copy:**
- Eyebrow: `LET'S CREATE`
- H2: `Experiences People Never Forget`
- CTA: `PLAN AN EVENT →`

Clicking CTA opens a focused enquiry modal or drawer; do not navigate away from the single-page experience.

### 07 — Footer
Integrated directly under the CTA.

Include only:
- CHANDRA wordmark
- Short brand descriptor
- Instagram
- LinkedIn
- YouTube if active
- Email
- Phone
- Location
- Copyright

## 6. Imagery Direction
- Real event production, not generic stock-office photography
- Large stages, lighting rigs, LED walls, speakers, audiences, backstage moments
- Corporate conferences, launches, college cultural events, award nights, activations
- Human silhouettes are welcome; hero should emphasize scale more than faces
- Dark blacks, controlled highlights, blue/gold stage lighting
- Avoid weddings, florals, bridal styling, banquet romance, generic nightclub visuals

## 7. Component Styling Rules
- Buttons: thin 1 px champagne border, square corners, uppercase sans text
- Hover: background fills champagne, text flips to ink
- Links: arrow motion 4–8 px on hover
- Cards: image-led; no drop shadows
- Icons: 1.25–1.5 px line weight
- Dividers: subtle, never high-contrast
- No glassmorphism
- No neon gradients
- No oversized pill buttons
- No generic agency blobs/shapes

## 8. Figma Design Instructions
When generating frames from this document:
1. Use **Approved Design Reference.png** as the visual source of truth.
2. Keep the website a **single continuous scroll**.
3. Preserve the dark → ivory → dark → ivory → dark → cinematic CTA rhythm.
4. Prioritize large real-event media and editorial spacing.
5. Do not invent extra sections unless specifically requested.
6. Do not copy any reference website. Use references only to understand what an event-management customer expects to find.
