# CHANDRA — Parallax & Scroll Motion Specification

## 1. Motion Goal
Parallax should make the site feel spatial and cinematic without making it feel like a demo reel.

**Rule:** motion supports the event story; it never blocks navigation or reading.

## 2. Global Motion Principles
- Native browser scroll remains in control
- No scroll-jacking
- Optional smooth-scroll layer may be used only if it preserves accessibility and anchor navigation
- All scroll-triggered effects must have a reduced-motion fallback
- Large media can move; body text should remain relatively stable
- Keep movement mostly on Y-axis and scale; avoid unnecessary 3D rotations

## 3. Recommended Motion Stack
Implementation option:
- GSAP + ScrollTrigger
- Optional Lenis for subtle smooth scrolling

Do not use heavy WebGL unless a later phase explicitly requires it.

## 4. Hero Motion
### Background video
- Video itself provides primary motion
- Optional container scale: `1.03 → 1.00` during first 35–50% of hero scroll
- Optional vertical drift: maximum 3–4vh

### Hero text
- Eyebrow: fade + 14 px rise
- H1 lines: staggered 70–110 ms
- Descriptor: fade in after H1
- CTA: final reveal

### Header
- At 0–60 px: transparent
- After hero begins scrolling: fade toward `rgba(9,11,13,0.82)`
- Avoid dramatic header shrinking

## 5. Philosophy Motion
The ivory section should feel calmer.

### Heading
- Translate Y: `32px → 0`
- Opacity: `0 → 1`

### Right image
- Container stays fixed in layout
- Image internal position drifts from `-5% → +5%` across section scroll
- Max scale: 1.06

### Supporting text
Simple fade/rise only. Do not parallax every line.

## 6. Featured Experience Motion
This is the strongest scroll interaction after hero.

### Media
- Scale: `1.08 → 1.00`
- Y drift: approximately `5vh → -3vh`

### Title block
- Reveal slightly later than media
- Project title can mask-reveal line-by-line

### Proof points
Stagger in from bottom at 80–100 ms intervals.

Optional desktop enhancement:
- Left text column can remain sticky for part of the media travel
- Do not use on mobile

## 7. Event Experiences Gallery
### Desktop
Cards enter with staggered Y offsets:
- Card 1: +28 px
- Card 2: +48 px
- Card 3: +20 px
- Card 4: +42 px
- Card 5: +26 px

All settle to 0 as gallery enters viewport.

Hover:
- media scale 1.00 → 1.04
- duration 450–650 ms
- premium easing

### Mobile
No scroll-triggered stagger needed.
Use horizontal scroll snap and subtle image scale only on active/center card if performant.

## 8. Process Motion
The connecting line can draw from left to right as the section enters.

Sequence:
1. section label appears
2. line draws
3. step icons appear
4. labels appear

Keep total sequence under ~1.2 seconds.

Mobile:
- Vertical progress line or no line animation
- reveal step-by-step on scroll

## 9. Final CTA Motion
### Background
- scale `1.08 → 1.00`
- very subtle Y drift

### Crowd / light image
If the source image has strong depth, allow slow push-in while user enters section.

### Text
- Eyebrow
- H2 line 1
- H2 line 2
- CTA

Do not add confetti particles in CSS; use real media if confetti is desired.

## 10. Recommended Trigger Ranges
Example logic:
```text
Hero:             top top      → bottom top
Philosophy media: top bottom   → bottom top
Featured media:   top 85%      → bottom 20%
Gallery reveal:   top 80%      → top 35%
Process line:     top 75%      → top 40%
Final CTA:        top bottom    → bottom top
```

## 11. Reduced Motion
When `prefers-reduced-motion: reduce`:
- Disable parallax
- Disable scale-on-scroll
- Remove smooth-scroll override
- Keep short opacity transitions ≤ 150 ms or render content immediately
- Hero video may remain if autoplay is permitted, but provide pause controls if required by final accessibility review

## 12. Performance Rules
- Animate only `transform` and `opacity` where possible
- Avoid scroll-driven layout properties such as top/left/width
- Use `will-change` sparingly
- Pause offscreen videos
- Do not run high-frequency pointer effects on mobile
- Avoid multiple pinned sections

## 13. Figma Prototype Equivalent
If demonstrating motion inside Figma:
- Smart Animate for text/mask reveals
- 300–600 ms ease-out transitions
- Simulate hero media with a video fill
- Use only a few prototype states; do not overbuild every scroll interaction in Figma

The final browser implementation is the source of truth for parallax behavior.
