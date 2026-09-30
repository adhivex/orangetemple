/*
 * Homepage and site-chrome copy from the approved design (docs/design/code/homepage-content.ts),
 * adapted to the owner decisions: no handoff photographs (D-045, D-046), no temple count
 * (D-045(3)), and V1 non-goals as "coming soon" toasts (D-053). Temple data is not here:
 * it comes from the database (content/ → Supabase).
 */

/** A navigation entry: a real page, a "coming soon" toast, or the cookie preferences dialog. */
export type LinkItem =
  | { label: string; href: string }
  | { label: string; soon: string }
  | { label: string; action: 'cookie-preferences' }

export const soon = {
  stories: 'Temple stories are coming soon.',
  festivals: 'Festivals are coming soon.',
  yatra: 'Yatra planning is coming soon.',
  knowledge: 'Knowledge articles are coming soon.',
  map: 'The interactive map is coming soon.',
  signIn: 'Sign in is coming soon.',
  terms: 'The Terms of Use page is coming soon.',
  disclaimer: 'The Disclaimer page is coming soon.',
  deity: (name: string) => `${name} temples are coming soon.`,
  region: (name: string) => `Temples in the ${name} are coming soon.`,
} as const

export const homeCopy = {
  meta: {
    title: 'OrangeTemple — Discover the Sacred Temples of Bharat',
  },
  hero: {
    kicker: ['Discover', 'Explore', 'Experience'],
    title: 'Discover the Sacred Temples of Bharat',
    lead: "Explore India's ancient temples, timeless traditions, spiritual stories and sacred destinations.",
    primaryCta: { label: 'Explore Temples', href: '#jyotirlingas' },
    secondaryCta: { label: 'Begin Your Yatra', href: '#char-dham' },
    quote: 'Not just destinations, but divine journeys.',
  },
  stats: [
    { icon: 'namaste', title: 'More Temples', subtitle: 'Coming Soon' },
    {
      icon: 'people',
      title: 'Sacred Stories',
      subtitle: 'Stories & Traditions',
      href: '#stories',
    },
    {
      icon: 'map',
      title: 'Plan Your Yatra',
      subtitle: 'Routes, Guides & Tips',
      href: '#char-dham',
    },
    {
      icon: 'lotus',
      title: 'Explore Bharat',
      subtitle: 'A Spiritual Journey',
      href: '#explore-bharat',
    },
  ],
  jyotirlingas: {
    title: '12 Jyotirlingas',
    subtitle: 'The sacred abodes of Lord Shiva, shining across Bharat.',
    moreLabel: 'Explore All Jyotirlingas',
    moreLabelMobile: 'View All',
    chip: 'Jyotirlinga',
  },
  charDham: {
    title: 'Char Dham',
    subtitle: 'The four sacred pilgrimage destinations of India.',
    moreLabel: 'Explore All Char Dham',
    moreLabelMobile: 'View All',
    chip: 'Char Dham',
  },
  deities: {
    title: 'Explore Temples by Deity',
    subtitle: 'Discover temples dedicated to the many forms of the Divine.',
    allLabel: 'All',
  },
  regions: {
    title: 'Explore by Region',
    subtitle: 'Find sacred places across every corner of India.',
  },
  map: {
    title: 'Explore Sacred Bharat',
    subtitle: "An interactive map of India's temples and spiritual destinations.",
    cta: 'View Interactive Map',
    browse: 'Browse temples state by state',
    quote: 'In every direction, there is a temple, and in every temple, there is a story.',
  },
  explore: [
    {
      icon: 'people',
      title: 'Temple Stories',
      text: 'Legends that inspire.',
      cta: 'Read Stories',
      soon: soon.stories,
    },
    {
      icon: 'lotus',
      title: 'Festivals',
      text: 'Celebrate the divine.',
      cta: 'Explore Festivals',
      soon: soon.festivals,
    },
    {
      icon: 'map',
      title: 'Plan Your Yatra',
      text: 'Routes, tips and guides.',
      cta: 'Plan Now',
      soon: soon.yatra,
    },
    {
      icon: 'book',
      title: 'Knowledge',
      text: 'Learn, discover, deepen.',
      cta: 'Explore',
      soon: soon.knowledge,
    },
  ],
  latestStories: {
    title: 'Latest Stories',
    subtitle: 'Legends that inspire. Stories that connect.',
    moreLabel: 'See All',
    readMore: 'Read More',
    items: ['The Story of Kedarnath', 'Significance of Mahashivratri', 'The Legend of Somnath'],
  },
  band: {
    quote:
      'Temples are not just built with stone, but with faith, stories and the devotion of millions.',
    attribution: 'OrangeTemple',
  },
  newsletter: {
    title: 'Join Our Journey',
    subtitle: 'Get updates on new temples, stories and features.',
    label: 'Email address',
    placeholder: 'Enter your email',
    cta: 'Subscribe',
    note: 'A small step to stay connected with the sacred.',
    success: "You're on the list. We'll write when new temples and stories arrive.",
    invalid: 'Enter a valid email address, like name@example.com.',
    failed: "We couldn't add you just now. Please try again in a moment.",
  },
  footer: {
    tagline: 'Sacred Bharat. Always with you.',
    description:
      'A mobile-first guide to the sacred temples of Bharat: their stories, traditions and the yatras that lead to them.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: '12 Jyotirlingas', href: '/jyotirlingas' },
          { label: 'Char Dham', href: '/char-dham' },
          { label: 'Temples by Deity', href: '/temples' },
          { label: 'Temples by Region', href: '/explore-bharat' },
          { label: 'Interactive Map', soon: soon.map },
        ],
      },
      {
        title: 'Discover',
        links: [
          { label: 'Temple Stories', soon: soon.stories },
          { label: 'Festivals', soon: soon.festivals },
          { label: 'Plan Your Yatra', soon: soon.yatra },
          { label: 'Knowledge', soon: soon.knowledge },
        ],
      },
      {
        title: 'OrangeTemple',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Credits', href: '/credits' },
          { label: 'Terms of Use', soon: soon.terms },
          { label: 'Disclaimer', soon: soon.disclaimer },
          { label: 'Cookie Settings', action: 'cookie-preferences' },
        ],
      },
    ] satisfies { title: string; links: LinkItem[] }[],
    copyright: '© 2026 OrangeTemple.in',
    dedication: 'A tribute to Sanatan Dharma',
    credit: {
      prefix: 'Designed & Developed by',
      label: 'OrangeKite',
      href: 'https://orangekite.in/',
    },
    backToTop: 'Back to top',
  },
  cookieConsent: {
    title: 'We value your privacy',
    text: "We use essential cookies to run OrangeTemple. With your consent, we'd also use analytics and marketing cookies to improve the site and our content. See our",
    policyLink: 'Privacy Policy',
    accept: 'Accept all',
    reject: 'Reject optional',
    customise: 'Customise preferences',
    dialogTitle: 'Cookie preferences',
    dialogIntro:
      'Choose which cookies OrangeTemple may use. You can change this anytime from Cookie Settings in the footer.',
    categories: [
      {
        id: 'essential',
        label: 'Essential',
        description:
          "Needed for the site to work, such as remembering these choices. Can't be turned off.",
        locked: true,
      },
      {
        id: 'analytics',
        label: 'Analytics',
        description: 'Anonymous usage statistics that help us improve pages and content.',
        locked: false,
      },
      {
        id: 'marketing',
        label: 'Marketing',
        description: 'Used to measure campaigns and show relevant content on other platforms.',
        locked: false,
      },
    ],
    alwaysOn: 'Always on',
    save: 'Save choices',
    savedToast: 'Preferences saved. Thank you.',
    essentialOnlyToast: 'Only essential cookies will be used.',
  },
} as const
