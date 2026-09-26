/**
 * WCAG 2.x contrast utilities. Pure functions used by the contrast test, which reads the
 * palette from globals.css, the single source.
 */

/** Extracts `--name: #rrggbb` colour tokens from the stylesheet's :root block. */
export function parseColorTokens(css: string): Record<string, string> {
  const root = css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''
  const tokens: Record<string, string> = {}
  for (const [, name, hex] of root.matchAll(/--([a-z]+-\d{2,3}|white):\s*(#[0-9a-f]{6})\b/gi)) {
    if (name && hex) tokens[name] = hex.toLowerCase()
  }
  return tokens
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

export function contrastRatio(foreground: string, background: string): number {
  const [light, dark] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  )
  return (light! + 0.05) / (dark! + 0.05)
}

/** Thresholds: 4.5 normal text, 3 large text and non-text UI (WCAG 1.4.3 / 1.4.11). */
export const AA = { text: 4.5, large: 3, ui: 3 } as const

/**
 * Every foreground/background pairing the design system permits for text, with the
 * threshold it must meet. Adding a new pairing in a component means adding it here.
 */
export const approvedPairings: {
  fg: string
  bg: string
  min: number
  use: string
}[] = [
  { fg: 'charcoal-900', bg: 'ivory-50', min: AA.text, use: 'Primary text' },
  { fg: 'charcoal-700', bg: 'ivory-50', min: AA.text, use: 'Secondary text' },
  { fg: 'charcoal-700', bg: 'sand-100', min: AA.text, use: 'Secondary text on cards' },
  { fg: 'stone-600', bg: 'ivory-50', min: AA.text, use: 'Meta text' },
  { fg: 'stone-600', bg: 'sand-100', min: AA.text, use: 'Meta text on cards' },
  { fg: 'saffron-800', bg: 'ivory-50', min: AA.text, use: 'Links, eyebrows' },
  { fg: 'white', bg: 'saffron-700', min: AA.text, use: 'Primary button' },
  { fg: 'charcoal-900', bg: 'saffron-500', min: AA.text, use: 'Accent button, highlights' },
  { fg: 'ivory-50', bg: 'charcoal-900', min: AA.text, use: 'Footer text' },
  { fg: 'sand-100', bg: 'charcoal-900', min: AA.text, use: 'Footer body text' },
  { fg: 'saffron-500', bg: 'charcoal-900', min: AA.text, use: 'Footer headings' },
  { fg: 'saffron-800', bg: 'ivory-50', min: AA.ui, use: 'Focus ring on light surfaces' },
  { fg: 'saffron-500', bg: 'charcoal-900', min: AA.ui, use: 'Focus ring on dark surfaces' },
]

/** Pairings that must never be used for text — asserted to stay below AA so the rule stays honest. */
export const forbiddenTextPairings: { fg: string; bg: string; reason: string }[] = [
  { fg: 'white', bg: 'saffron-500', reason: 'White on bright saffron (D-017)' },
  { fg: 'saffron-700', bg: 'ivory-50', reason: 'Button fill colour, not a text colour' },
  { fg: 'gold-500', bg: 'ivory-50', reason: 'Decorative accents only' },
]
