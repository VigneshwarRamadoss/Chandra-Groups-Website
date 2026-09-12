# CHANDRA — Product Requirements Document

## 1. Product
A premium, cinematic, single-page website for **Chandra**, an event-management and event-production company.

## 2. Problem
Prospective clients need to understand within seconds:
- what Chandra does,
- what kinds of events it can execute,
- the scale and quality of its work,
- whether it feels trustworthy and premium,
- and how to start an enquiry.

Most event-company websites become crowded portfolios or brochure sites. Chandra should instead feel like a **controlled event experience**: visual, immersive, fast to understand, and easy to enquire from.

## 3. Goal
Create a premium one-page experience that turns visual credibility into qualified event enquiries.

## 4. Primary Users
### Corporate decision-makers
- Marketing heads
- HR / people teams
- Brand managers
- Procurement teams
- Founders / leadership

### Institutions
- Colleges / universities
- Student cultural committees
- Education-management teams

### Brand / agency partners
- Product teams
- Activation teams
- Creative / marketing agencies looking for execution partners

## 5. User Needs
1. “Can they handle my type of event?”
2. “Does their work look premium?”
3. “Can they manage production end-to-end?”
4. “Have they handled scale?”
5. “How do I contact them quickly?”

## 6. Scope — MVP
### Must have
- Single-page scrolling website
- Transparent/sticky navigation
- Cinematic hero video or image fallback
- Short brand philosophy
- Featured event/project
- Event-type gallery
- 5-step process
- Final CTA
- Enquiry modal/drawer
- Responsive desktop/tablet/mobile layouts
- Reduced-motion accessibility mode
- Optimized image/video loading
- Basic SEO and social metadata

### Nice to have
- Project gallery lightbox
- Filtered work overlay by event category
- Client-logo marquee
- Testimonial micro-block
- CMS-backed projects

### Out of scope for MVP
- Separate service pages
- Blog / insights
- User accounts
- Full CRM dashboard
- Ticketing
- Event attendee registration
- Wedding-specific content

## 7. Content Architecture
1. Hero
2. Philosophy
3. Featured Experience
4. Event Experiences
5. Process
6. Final CTA
7. Footer

## 8. Functional Requirements

### Navigation
- Sticky after first viewport or remain transparently fixed
- Anchor-scroll to page sections
- Active-section state can be subtle; no bulky navigation indicator
- Mobile uses full-screen dark menu

### Hero media
- Autoplay muted
- `playsinline`
- Loop if the source edit supports a seamless loop
- Poster image displayed before video loads
- Video does not block first paint

### Enquiry modal
Required fields:
- Name
- Organisation
- Phone
- Email
- Event type
- Event date / approximate date
- City
- Audience size
- Budget range
- Project brief

Submission states:
- Idle
- Validating
- Sending
- Success
- Error

### Event cards
- Hover media scale: restrained
- Mobile: swipeable horizontal list
- No hidden essential text on hover only

## 9. UX Requirements
- User understands Chandra's category within **5 seconds**
- Main CTA visible in first viewport
- No section contains more than one core message
- Paragraphs remain under ~55 words
- No scroll-jacking
- Motion reinforces hierarchy; it must not delay reading
- User can reach enquiry from header, hero, and final CTA

## 10. Visual Requirements
- Premium editorial typography
- Black / ivory rhythm
- Champagne-gold accent
- Full-bleed event imagery
- High contrast
- Minimal UI chrome
- No generic SaaS cards
- No wedding-led art direction

## 11. Performance Requirements
Targets:
- LCP ≤ 2.5 s on good 4G
- CLS < 0.1
- INP < 200 ms target
- Hero video should have compressed web variants
- Lazy-load offscreen imagery
- Serve AVIF/WebP for photography
- Prefer 1080p/1440p optimized web video over shipping an 8K file

## 12. Accessibility
- WCAG AA contrast for all functional text
- Keyboard-visible focus states
- Modal traps focus correctly and closes with Escape
- Images have meaningful alt text
- Decorative media uses empty alt
- Honor `prefers-reduced-motion`
- Hero video must not rely on audio

## 13. SEO Requirements
- Clear `<h1>` only in hero
- Section headings use logical H2/H3 hierarchy
- Title + description optimized around Chandra's real operating geography and event specialisms
- Organization / LocalBusiness structured data where accurate
- Open Graph image
- Canonical URL
- Crawlable text; do not bake important copy into images/video

## 14. Success Metrics
Primary:
- Qualified “Plan an Event” submissions
- CTA click-through rate

Secondary:
- Hero-to-work scroll depth
- Work-section engagement
- Completion rate to final CTA
- WhatsApp/call clicks if enabled

## 15. Acceptance Criteria
The MVP is ready when:
- All seven sections match the approved visual direction
- Desktop and mobile layouts are complete
- Navigation scrolls correctly
- Hero media performs smoothly
- Event types are clearly recognizable
- Enquiry flow works end-to-end
- Motion degrades gracefully on low-power/mobile devices
- No section visually resembles a copied reference-site layout
