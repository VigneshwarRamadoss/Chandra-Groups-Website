// CHANDRA — Content Architecture
// Separates confirmed brand content from placeholder metrics/copy for client verification.

export const siteContent = {
  brand: {
    name: 'CHANDRA',
    deltaChar: 'Δ', // Geometric stylized delta: CHANDRΔ
    tagline: 'EVENTS BEYOND ORDINARY', // [Placeholder / To be confirmed]
    idea: 'EVENTS THAT MOVE PEOPLE',
    pillars: 'IDEAS · PRODUCTION · EXPERIENCES',
  },
  navigation: [
    { label: 'ABOUT', href: '#about' },
    { label: 'WORK', href: '#work' },
    { label: 'SERVICES', href: '#process' },
    { label: 'CONTACT', href: '#contact' },
  ],
  hero: {
    eyebrow: 'EVENTS THAT',
    titleLine1: 'MOVE',
    titleLine2: 'PEOPLE',
    descriptor: 'IDEAS · PRODUCTION · EXPERIENCES',
    cta: "LET'S CREATE →",
    verticalMeta: ['PEOPLE', 'IDEAS', 'SPACES', 'EXPERIENCES'],
    backdropCaption: 'A BIGGER TOMORROW', // [Placeholder]
  },
  philosophy: {
    eyebrow: 'OUR PHILOSOPHY',
    headlineLine1: 'MORE THAN',
    headlineLine2: 'EVENTS',
    headline: 'MORE THAN EVENTS',
    subline: 'WE CREATE MOMENTS THAT MATTER',
    body: 'From the first idea to the final moment, we shape every detail around what your audience will feel, remember and talk about.',
    cta: 'SEE OUR APPROACH →',
    visualCaption: ['IDEAS', 'PEOPLE', 'EXPERIENCES'],
    microLabels: ['IDEA', 'SPACE', 'LIGHT', 'PEOPLE'],
  },
  featured: {
    eyebrow: 'FEATURED EXPERIENCE',
    title: 'A Global Product Launch',
    tagline: 'IDEAS ON A BIGGER STAGE',
    cta: 'VIEW CASE STUDY →',
    visualOverlay: ['SAME', 'BOLD', 'DIFFERENT'], // [Placeholder]
    // [Placeholders: The 4 proof metrics must be confirmed with client data]
    stats: [
      { value: '1', label: 'ICONIC REVEAL' },
      { value: '3,000', label: 'ATTENDEES' },
      { value: 'IMMERSIVE', label: 'STAGE DESIGN' },
      { value: 'GLOBAL', label: 'MEDIA REACH' },
    ],
    caseStudySummary: {
      client: 'Global Automotive Pioneer',
      location: 'Main Arena, Tech Expo',
      scope: 'Keynote, Stage Architecture, 360° Reveal, Broadcast',
      description:
        'A milestone product unveil uniting 3,000 in-person industry leaders and over 1.2M live-stream viewers worldwide with choreographed robotic lighting and motorized silk unveil mechanics.',
    },
  },
  experiences: {
    eyebrow: 'EVENT EXPERIENCES',
    titleLine1: 'EVERY EVENT.',
    titleLine2: 'A NEW STORY.',
    title: 'Every Event. A New Story',
    subtitle: 'DIFFERENT AUDIENCES. BIGGER POSSIBILITIES.',
    exploreCta: 'EXPLORE ALL →',
    categories: [
      {
        id: 'corporate',
        index: '01',
        title: 'Corporate Events',
        shortDesc: 'Built for attention, clarity and scale.',
        image: '/media/cat-corporate.webp',
        alt: 'Corporate keynote auditorium summit with tiered seating and atmospheric blue lighting',
      },
      {
        id: 'product',
        index: '02',
        title: 'Product Launches',
        shortDesc: 'The reveal moment, engineered for impact.',
        image: '/media/cat-product.webp',
        alt: 'Sensational product launch with vertical digital LED screen towers',
      },
      {
        id: 'festivals',
        index: '03',
        title: 'College Festivals',
        shortDesc: 'Unbridled energy and collective celebration.',
        image: '/media/cat-college.webp',
        alt: 'College cultural festival concert with hands raised and golden confetti burst',
      },
      {
        id: 'awards',
        index: '04',
        title: 'Award Nights',
        shortDesc: 'Prestige, precision and cinematic recognition.',
        image: '/media/cat-awards.webp',
        alt: 'Prestigious award night gala with backlit golden trophy sculpture on stage',
      },
      {
        id: 'activations',
        index: '05',
        title: 'Brand Activations',
        shortDesc: 'Immersive worlds where audiences connect.',
        image: '/media/cat-activations.webp',
        alt: 'Architectural brand activation gallery with illuminated typography monoliths',
      },
    ],
  },
  process: {
    eyebrow: 'HOW WE BRING IT TO LIFE',
    supportingLine: 'FROM THE FIRST BRIEF TO THE FINAL CUE.',
    steps: [
      {
        id: '01',
        title: 'CONCEPT',
        description: 'We define the idea, audience and outcome.',
        meta: '01 / 05 · IDEATION',
        image: '/media/process-concept.jpg',
        imageAlt: 'Event production creative brief and architectural arena stage drawings in design studio',
      },
      {
        id: '02',
        title: 'DESIGN',
        description: 'We shape the space, story and visual experience.',
        meta: '02 / 05 · SPATIAL & VISUAL',
        image: '/media/process-design.jpg',
        imageAlt: '3D spatial visualization and volumetric laser lighting render of arena concert stage',
      },
      {
        id: '03',
        title: 'PRODUCE',
        description: 'We turn the design into a live production.',
        meta: '03 / 05 · ENGINEERING',
        image: '/media/process-produce.jpg',
        imageAlt: 'Production crew assembling massive aluminum trussing and motorized LED lighting rig',
      },
      {
        id: '04',
        title: 'MANAGE',
        description: 'Every moving part stays coordinated behind the scenes.',
        meta: '04 / 05 · SHOW CONTROL',
        image: '/media/process-manage.jpg',
        imageAlt: 'Show caller and technical director at front-of-house master control desk',
      },
      {
        id: '05',
        title: 'DELIVER',
        description: 'Everything comes together when the audience arrives.',
        meta: '05 / 05 · LIVE EXPERIENCE',
        image: '/media/process-deliver.jpg',
        imageAlt: 'Monumental live event climax with packed cheering arena audience and golden atmospheric pyro',
      },
    ],
  },
  cta: {
    eyebrow: "LET'S CREATE",
    headlineLine1: 'Experiences',
    headlineLine2: 'People Never Forget',
    primaryButton: 'PLAN AN EVENT →',
    footerAnchorLeft: 'CHANDRA',
    footerSubLeft: 'EVENTS BEYOND ORDINARY',
    footerAnchorRight: 'BIGGER EVENTS',
    footerSubRight: 'BRIGHTER TOMORROWS',
  },
  footer: {
    copyright: '© 2024 CHANDRA. ALL RIGHTS RESERVED.',
    socials: [
      { name: 'INSTAGRAM', url: 'https://instagram.com' },
      { name: 'LINKEDIN', url: 'https://linkedin.com' },
      { name: 'YOUTUBE', url: 'https://youtube.com' },
    ],
  },
};
