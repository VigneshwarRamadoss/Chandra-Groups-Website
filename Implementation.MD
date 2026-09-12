# CHANDRA — Implementation Specification

## 1. Implementation Goal
Build the approved Chandra design as a performant, responsive, premium **single-page event website** with cinematic media and restrained scroll motion.

## 2. Recommended Stack
Preferred:
- Next.js + React + TypeScript
- Tailwind CSS or CSS Modules
- GSAP + ScrollTrigger for motion
- Optional Lenis for subtle smooth scrolling
- React Hook Form + Zod for enquiry form validation

Equivalent Nuxt/Vue implementation is acceptable if that matches the development team.

## 3. Route Structure
```text
/
/privacy   optional
/terms     optional
```

All marketing content lives on `/`.

## 4. Component Tree
```text
App / HomePage
├── Header
│   ├── Wordmark
│   ├── DesktopNav
│   ├── MobileMenu
│   └── PlanEventButton
├── HeroSection
│   ├── HeroVideo
│   ├── HeroOverlay
│   └── HeroContent
├── PhilosophySection
│   ├── EditorialHeading
│   ├── BrandCopy
│   └── ParallaxImage
├── FeaturedExperienceSection
│   ├── ProjectCopy
│   ├── ProjectMedia
│   └── ProjectStats
├── ExperiencesSection
│   └── ExperienceCard × 5
├── ProcessSection
│   └── ProcessStep × 5
├── FinalCTASection
├── Footer
└── PlanEventModal
```

## 5. Section IDs
```html
<section id="home">
<section id="about">
<section id="featured">
<section id="work">
<section id="process">
<section id="contact">
```

Use CSS `scroll-margin-top` so sticky navigation does not cover anchored headings.

## 6. Design Tokens
```css
:root {
  --ink: #090B0D;
  --ink-soft: #12161A;
  --ivory: #F2EEE6;
  --paper: #FAF8F3;
  --champagne: #C6A56A;
  --champagne-soft: #D7C39A;
  --text-on-dark: #F9F9F7;
  --muted-dark: #8D9297;
  --muted-light: #68635C;

  --page-x: clamp(20px, 4vw, 64px);
  --section-y: clamp(72px, 10vw, 160px);
  --content-max: 1320px;
}
```

## 7. Typography Setup
Use:
- `Bodoni Moda` — display
- `Manrope` — UI/body

Load locally or through a production-safe font strategy. Use variable/font-display swap where available.

## 8. Hero Video
### HTML behavior
```html
<video
  autoplay
  muted
  loop
  playsinline
  preload="metadata"
  poster="/media/chandra-hero-poster.webp"
>
  <source src="/media/chandra-hero.webm" type="video/webm" />
  <source src="/media/chandra-hero.mp4" type="video/mp4" />
</video>
```

### Production media strategy
Do **not** ship the 8K master to browsers.

Generate/export:
- Master archival file: 4K/8K if available
- Desktop web: 1920–2560 px wide, H.265/AV1/WebM where supported
- Mobile web: 720–1080 px portrait-safe crop
- Poster: AVIF/WebP

Aim for the shortest loop that preserves quality. A 10–20 second seamless loop is generally better for a hero than a 60-second file.

## 9. Responsive Breakpoints
Suggested:
- Mobile: `< 640`
- Small tablet: `640–899`
- Tablet: `900–1199`
- Desktop: `1200+`

### Desktop
- 12-column grid
- 5-card work composition
- optional sticky featured-project copy

### Tablet
- 8-column grid
- 2–3 work cards per row

### Mobile
- single-column editorial sections
- work cards in horizontal snap carousel
- process in vertical list
- hero media uses alternate crop
- no complex sticky parallax

## 10. Header Behavior
- Position fixed
- Transparent in hero
- Gains dark translucent background after scroll threshold
- CTA remains visible on desktop
- Mobile menu blocks page scroll while open

## 11. Motion Implementation
Use GSAP only where it adds meaning.

Recommended ScrollTrigger targets:
- hero copy reveal
- philosophy image drift
- featured-project media scale/drift
- work-card stagger
- process line draw
- final CTA background scale

Do not animate every text block.

Honor:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 12. Enquiry Modal
Recommended fields:
```ts
{
  name: string;
  organisation?: string;
  phone: string;
  email: string;
  eventType: 'Corporate' | 'Product Launch' | 'College Festival' | 'Award Night' | 'Brand Activation' | 'Other';
  eventDate?: string;
  city?: string;
  audienceSize?: string;
  budgetRange?: string;
  brief?: string;
}
```

Potential integrations later:
- email notification
- WhatsApp handoff
- CRM webhook

## 13. Media Content Model
```ts
type ExperienceCategory = {
  slug: string;
  title: string;
  image: string;
  alt: string;
};

type FeaturedExperience = {
  eyebrow: string;
  title: string;
  tagline: string;
  media: string;
  facts: Array<{ value: string; label: string }>;
};
```

Keep real client metrics editable rather than hard-coded into layout images.

## 14. SEO & Semantic HTML
- `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- One H1 only
- Descriptive H2s
- Real text instead of text embedded in images
- Unique page title + meta description
- Open Graph / Twitter cards
- Organization/LocalBusiness JSON-LD only with verified details
- Include service area only if accurate

## 15. Performance
- Lazy-load everything below first meaningful viewport
- Use Next/Image or equivalent image optimizer
- AVIF/WebP sources
- Defer non-critical motion JS
- Split GSAP bundles if possible
- Keep hero text server-rendered
- Preload only critical display font subset and hero poster
- Avoid large third-party trackers in initial load

## 16. Accessibility
- Semantic buttons and links
- `aria-modal="true"` for enquiry modal
- focus trap + restore focus on close
- Escape closes modal
- skip-to-content link
- visible focus ring
- minimum touch target 44 px
- sufficient contrast on video via overlay gradient

## 17. Suggested Overlay Gradient for Hero
```css
.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg,
      rgba(5,7,9,.82) 0%,
      rgba(5,7,9,.56) 34%,
      rgba(5,7,9,.18) 62%,
      rgba(5,7,9,.12) 100%);
  pointer-events: none;
}
```

Tune to actual footage rather than using this value blindly.

## 18. Figma-to-Code Handoff
Figma components should map directly to implementation components:
- Header
- Button / Primary
- Button / Outline
- Experience Card
- Process Step
- Stat Item
- Enquiry Field
- Modal
- Footer Link

Use Auto Layout throughout. Avoid absolute positioning except for deliberate hero/media overlays.

## 19. QA Checklist
### Visual
- Matches approved screenshot rhythm
- Dark/ivory alternation preserved
- Gold not overused
- Typography pair consistent

### Functional
- Anchor links work
- Modal works
- Form validates
- Mobile menu works
- External/social links work

### Motion
- No jank
- No scroll-jacking
- Reduced-motion works
- Mobile motion is simplified

### Performance
- Hero video not blocking first render
- Images correctly sized
- CLS near zero
- No oversized source media shipped

## 20. Implementation Rule
The final website should feel like an original Chandra product. The supplied event-industry websites are research references, not source layouts to reproduce.
