// Homepage content + launch temple data used by the design.
// Temple rows are launch seed data: move them into the Prisma seed (prisma/seed.ts)
// following the existing schema in docs/. The homepage should read temples from the
// database; the static copy below (hero text, section titles, quotes) can stay in code.

export type Region = "North" | "South" | "East" | "West" | "Central" | "Northeast";
export type TempleGroup = "Jyotirlinga" | "Char Dham";

export interface LaunchTemple {
  slug: string;
  name: string;
  state: string;
  region: Region;
  deity: "Shiva" | "Vishnu" | "Krishna";
  groups: TempleGroup[];
  /** Interim image in /public. null = show the "Photo coming soon" placeholder card. */
  image: string | null;
  /** Order within the homepage rail(s) */
  jyotirlingaOrder?: number;
  charDhamOrder?: number;
}

export const launchTemples: LaunchTemple[] = [
  { slug: "somnath", name: "Somnath", state: "Gujarat", region: "West", deity: "Shiva", groups: ["Jyotirlinga"], image: "/images/temples/somnath.jpg", jyotirlingaOrder: 1 },
  { slug: "mallikarjuna", name: "Mallikarjuna", state: "Andhra Pradesh", region: "South", deity: "Shiva", groups: ["Jyotirlinga"], image: "/images/temples/mallikarjuna.jpg", jyotirlingaOrder: 2 },
  { slug: "mahakaleshwar", name: "Mahakaleshwar", state: "Madhya Pradesh", region: "Central", deity: "Shiva", groups: ["Jyotirlinga"], image: "/images/temples/mahakaleshwar.jpg", jyotirlingaOrder: 3 },
  { slug: "omkareshwar", name: "Omkareshwar", state: "Madhya Pradesh", region: "Central", deity: "Shiva", groups: ["Jyotirlinga"], image: "/images/temples/omkareshwar.jpg", jyotirlingaOrder: 4 },
  { slug: "kedarnath", name: "Kedarnath", state: "Uttarakhand", region: "North", deity: "Shiva", groups: ["Jyotirlinga"], image: "/images/temples/kedarnath.jpg", jyotirlingaOrder: 5 },
  { slug: "bhimashankar", name: "Bhimashankar", state: "Maharashtra", region: "West", deity: "Shiva", groups: ["Jyotirlinga"], image: "/images/temples/bhimashankar.jpg", jyotirlingaOrder: 6 },
  { slug: "kashi-vishwanath", name: "Kashi Vishwanath", state: "Uttar Pradesh", region: "North", deity: "Shiva", groups: ["Jyotirlinga"], image: null, jyotirlingaOrder: 7 },
  { slug: "trimbakeshwar", name: "Trimbakeshwar", state: "Maharashtra", region: "West", deity: "Shiva", groups: ["Jyotirlinga"], image: null, jyotirlingaOrder: 8 },
  { slug: "vaidyanath", name: "Vaidyanath", state: "Jharkhand", region: "East", deity: "Shiva", groups: ["Jyotirlinga"], image: null, jyotirlingaOrder: 9 },
  { slug: "nageshwar", name: "Nageshwar", state: "Gujarat", region: "West", deity: "Shiva", groups: ["Jyotirlinga"], image: null, jyotirlingaOrder: 10 },
  { slug: "rameshwaram", name: "Rameshwaram", state: "Tamil Nadu", region: "South", deity: "Shiva", groups: ["Jyotirlinga", "Char Dham"], image: "/images/temples/rameshwaram.jpg", jyotirlingaOrder: 11, charDhamOrder: 4 },
  { slug: "grishneshwar", name: "Grishneshwar", state: "Maharashtra", region: "West", deity: "Shiva", groups: ["Jyotirlinga"], image: null, jyotirlingaOrder: 12 },
  { slug: "badrinath", name: "Badrinath", state: "Uttarakhand", region: "North", deity: "Vishnu", groups: ["Char Dham"], image: "/images/temples/badrinath.jpg", charDhamOrder: 1 },
  { slug: "dwarka", name: "Dwarka", state: "Gujarat", region: "West", deity: "Krishna", groups: ["Char Dham"], image: "/images/temples/dwarka.jpg", charDhamOrder: 2 },
  { slug: "jagannath-puri", name: "Jagannath Puri", state: "Odisha", region: "East", deity: "Vishnu", groups: ["Char Dham"], image: "/images/temples/jagannath-puri.jpg", charDhamOrder: 3 },
];

export const homeCopy = {
  hero: {
    kicker: "Discover · Explore · Experience",
    title: "Discover the Sacred Temples of Bharat",
    lead: "Explore India's ancient temples, timeless traditions, spiritual stories and sacred destinations.",
    primaryCta: { label: "Explore Temples", href: "#jyotirlingas" },
    secondaryCta: { label: "Begin Your Yatra", href: "#char-dham" },
    quote: "Not just destinations, but divine journeys.",
    imageCaption: "Somnath Temple, Gujarat",
    image: "/images/home/hero-somnath.jpg",
  },
  stats: [
    { icon: "namaste", title: "1000+", subtitle: "Temples", badge: "Coming Soon" },
    { icon: "people", title: "Sacred Stories", subtitle: "Stories & Traditions", href: "#stories" },
    { icon: "map", title: "Plan Your Yatra", subtitle: "Routes, Guides & Tips", href: "#char-dham" },
    { icon: "lotus", title: "Explore Bharat", subtitle: "A Spiritual Journey", href: "#explore-bharat" },
  ],
  jyotirlingas: { title: "12 Jyotirlingas", subtitle: "The sacred abodes of Lord Shiva, shining across Bharat.", moreLabel: "Explore All Jyotirlingas", moreLabelMobile: "View All" },
  charDham: { title: "Char Dham", subtitle: "The four sacred pilgrimage destinations of India.", moreLabel: "Explore All Char Dham", moreLabelMobile: "View All" },
  deities: {
    title: "Explore Temples by Deity",
    subtitle: "Discover temples dedicated to the many forms of the Divine.",
    items: [
      { name: "Shiva", icon: "trishul", available: true },
      { name: "Vishnu", icon: "chakra", available: true },
      { name: "Devi", icon: "lotusfill", available: false },
      { name: "Krishna", icon: "feather", available: true },
      { name: "Rama", icon: "bow", available: false },
      { name: "Hanuman", icon: "gada", available: false },
      { name: "Ganesha", icon: "om", available: false },
      { name: "All", icon: "grid", available: true },
    ],
  },
  regions: {
    title: "Explore by Region",
    subtitle: "Find sacred places across every corner of India.",
    items: [
      { name: "North", image: "/images/regions/north.jpg" },
      { name: "South", image: "/images/regions/south.jpg" },
      { name: "East", image: "/images/regions/east.jpg" },
      { name: "West", image: "/images/regions/west.jpg" },
      { name: "Central", image: "/images/regions/central.jpg" },
      { name: "Northeast", image: null },
    ],
  },
  map: {
    title: "Explore Sacred Bharat",
    subtitle: "An interactive map of India's temples and spiritual destinations.",
    cta: "View Interactive Map",
    quote: "In every direction, there is a temple, and in every temple, there is a story.",
    image: "/images/home/map-india.png",
  },
  explore: [
    { title: "Temple Stories", text: "Legends that inspire.", cta: "Read Stories", image: "/images/stories/temple-stories.jpg" },
    { title: "Festivals", text: "Celebrate the divine.", cta: "Explore Festivals", image: "/images/stories/festivals.jpg" },
    { title: "Plan Your Yatra", text: "Routes, tips and guides.", cta: "Plan Now", image: "/images/stories/plan-your-yatra.jpg" },
    { title: "Knowledge", text: "Learn, discover, deepen.", cta: "Explore", image: "/images/stories/knowledge.jpg" },
  ],
  latestStories: {
    title: "Latest Stories",
    subtitle: "Legends that inspire. Stories that connect.",
    items: [
      { title: "The Story of Kedarnath", image: "/images/stories/story-kedarnath.jpg" },
      { title: "Significance of Mahashivratri", image: "/images/stories/story-mahashivratri.jpg" },
      { title: "The Legend of Somnath", image: "/images/temples/somnath.jpg" },
    ],
  },
  band: {
    quote: "Temples are not just built with stone, but with faith, stories and the devotion of millions.",
    attribution: "OrangeTemple",
    image: "/images/home/band-mountains.jpg",
  },
  newsletter: {
    title: "Join Our Journey",
    subtitle: "Get updates on new temples, stories and features.",
    placeholder: "Enter your email",
    cta: "Subscribe",
    note: "A small step to stay connected with the sacred.",
    success: "You're on the list. We'll write when new temples and stories arrive.",
    invalid: "Enter a valid email address, like name@example.com.",
  },
  footer: {
    tagline: "Sacred Bharat. Always with you.",
    description: "A mobile-first guide to the sacred temples of Bharat: their stories, traditions and the yatras that lead to them.",
    social: ["YouTube", "Instagram", "Facebook", "X", "Pinterest"],
    columns: [
      { title: "Explore", links: [
        { label: "12 Jyotirlingas", href: "/#jyotirlingas" },
        { label: "Char Dham", href: "/#char-dham" },
        { label: "Temples by Deity", href: "/temples?view=deity" },
        { label: "Temples by Region", href: "/temples?view=region" },
        { label: "Interactive Map", href: "/#explore-bharat" },
      ]},
      { title: "Discover", links: [
        { label: "Temple Stories", href: "/stories" },
        { label: "Festivals", href: "/festivals" },
        { label: "Plan Your Yatra", href: "/yatra" },
        { label: "Knowledge", href: "/knowledge" },
      ]},
      { title: "OrangeTemple", links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Use", href: "/terms" },
        { label: "Disclaimer", href: "/disclaimer" },
        { label: "Cookie Settings", action: "open-cookie-preferences" },
      ]},
    ],
    copyright: "© 2026 OrangeTemple.in",
    dedication: "A tribute to Sanatan Dharma",
    credit: { prefix: "Designed & Developed by", label: "OrangeKite", href: "https://orangekite.in/" },
  },
  cookieConsent: {
    title: "We value your privacy",
    text: "We use essential cookies to run OrangeTemple. With your consent, we'd also use analytics and marketing cookies to improve the site and our content. See our Privacy Policy.",
    accept: "Accept all",
    reject: "Reject optional",
    customise: "Customise preferences",
    dialogTitle: "Cookie preferences",
    dialogIntro: "Choose which cookies OrangeTemple may use. You can change this anytime from Cookie Settings in the footer.",
    categories: [
      { id: "essential", label: "Essential", description: "Needed for the site to work, such as remembering these choices and your theme. Can't be turned off.", locked: true },
      { id: "analytics", label: "Analytics", description: "Anonymous usage statistics that help us improve pages and content.", locked: false },
      { id: "marketing", label: "Marketing", description: "Used to measure campaigns and show relevant content on other platforms.", locked: false },
    ],
    save: "Save choices",
    savedToast: "Preferences saved. Thank you.",
    essentialOnlyToast: "Only essential cookies will be used.",
  },
} as const;
