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
    steps: [
      { id: '01', name: 'CONCEPT' },
      { id: '02', name: 'DESIGN' },
      { id: '03', name: 'PRODUCE' },
      { id: '04', name: 'MANAGE' },
      { id: '05', name: 'DELIVER' },
    ],
    sideTagline: 'SEAMLESS FROM IDEA TO IMPACT',
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
