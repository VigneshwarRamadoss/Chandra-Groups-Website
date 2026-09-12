# CHANDRA — One-Page Site Map

## Product Model
Chandra is a **single-page scroll website**. Navigation items are anchors, not separate pages.

## Visual Site Map

```mermaid
flowchart TD
    A[Sticky / Transparent Header] --> B[01 Hero — #home]
    B --> C[02 Philosophy — #about]
    C --> D[03 Featured Experience — #featured]
    D --> E[04 Event Experiences — #work]
    E --> F[05 Process — #process]
    F --> G[06 Final CTA — #contact]
    G --> H[07 Footer]

    A -. ABOUT .-> C
    A -. WORK .-> E
    A -. PROCESS .-> F
    A -. CONTACT .-> G
    A -. PLAN AN EVENT .-> I[Enquiry Modal / Drawer]
    B -. LET'S CREATE .-> I
    G -. PLAN AN EVENT .-> I

    E --> E1[Corporate Events]
    E --> E2[Product Launches]
    E --> E3[College Festivals]
    E --> E4[Award Nights]
    E --> E5[Brand Activations]

    I --> I1[Event Type]
    I --> I2[Name / Organisation]
    I --> I3[Date / City]
    I --> I4[Audience Size]
    I --> I5[Budget Range]
    I --> I6[Phone / Email]
    I --> I7[Project Brief]
```

## Navigation
Desktop header:
- CHANDRA logo → `#home`
- ABOUT → `#about`
- WORK → `#work`
- SERVICES / PROCESS → `#process`
- CONTACT → `#contact`
- PLAN AN EVENT → enquiry modal

Recommended final nav labels:
`ABOUT | WORK | SERVICES | PROCESS | CONTACT`

If fewer items are preferred, merge SERVICES + PROCESS and use:
`ABOUT | WORK | PROCESS | CONTACT`

## Scroll Sequence

### 01 Hero — `#home`
- Cinematic event-video background
- Brand promise
- Primary CTA

### 02 Philosophy — `#about`
- “More Than Events”
- Short brand explanation
- Production/event image

### 03 Featured Experience — `#featured`
- One flagship project
- Scale / proof points
- Case-study CTA

**Single-page behavior:** case-study CTA may open an overlay/lightbox with 3–6 project images and concise facts. Avoid navigating to a separate page in phase 1.

### 04 Event Experiences — `#work`
- Corporate Events
- Product Launches
- College Festivals
- Award Nights
- Brand Activations

Card interaction options:
- Hover: media zoom + label shift
- Click: filtered project overlay, gallery modal, or no click for MVP

### 05 Process — `#process`
`Concept → Design → Produce → Manage → Deliver`

### 06 Final CTA — `#contact`
- Cinematic finale media
- Primary enquiry CTA

### 07 Footer
- Contact details
- Social links
- Legal

## Enquiry Modal Structure

```mermaid
flowchart LR
    A[Plan an Event] --> B[Event Type]
    B --> C[Name + Organisation]
    C --> D[Date + City]
    D --> E[Audience Size]
    E --> F[Budget Range]
    F --> G[Phone + Email]
    G --> H[Short Brief]
    H --> I[Submit Enquiry]
```

## URL Model
Because this is a single page:
- `/` — website
- `/#about`
- `/#featured`
- `/#work`
- `/#process`
- `/#contact`

Optional later:
- `/privacy`
- `/terms`

Keep the marketing experience on one page unless real content volume later justifies a dedicated portfolio system.
