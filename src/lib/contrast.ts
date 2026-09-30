/**
 * WCAG 2.x contrast utilities. Pure functions used by the contrast test, which reads the
 * palette from globals.css, the single source.
 */

/**
 * Extracts `--ot-name: #rrggbb` colour tokens from the stylesheet's :root block, keyed
 * without the `ot-` prefix (`--ot-saffron-ink` → `saffron-ink`).
 */
export function parseColorTokens(css: string): Record<string, string> {
  const root = css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''
  const tokens: Record<string, string> = {}
  for (const [, name, hex] of root.matchAll(/--ot-([a-z0-9-]+):\s*(#[0-9a-f]{6})\b/gi)) {
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
  { fg: 'ink', bg: 'bg', min: AA.text, use: 'Primary text' },
  { fg: 'ink', bg: 'card', min: AA.text, use: 'Primary text on cards' },
  { fg: 'ink-2', bg: 'bg', min: AA.text, use: 'Body copy' },
  { fg: 'ink-2', bg: 'card', min: AA.text, use: 'Body copy on cards' },
  { fg: 'muted', bg: 'bg', min: AA.text, use: 'Secondary text' },
  { fg: 'muted', bg: 'bg-alt', min: AA.text, use: 'Secondary text on icon wells' },
  { fg: 'muted', bg: 'card', min: AA.text, use: 'Secondary text on cards' },
  { fg: 'saffron-ink', bg: 'bg', min: AA.text, use: 'Links and saffron text' },
  { fg: 'saffron-ink', bg: 'bg-alt', min: AA.text, use: 'Links on icon wells' },
  { fg: 'saffron-ink', bg: 'card', min: AA.text, use: 'Links on cards' },
  { fg: 'white', bg: 'saffron-deep', min: AA.text, use: 'Primary button, gradient top' },
  { fg: 'white', bg: 'saffron-ink', min: AA.text, use: 'Primary button, gradient bottom' },
  { fg: 'ink', bg: 'saffron-soft', min: AA.text, use: 'Chips and badges' },
  { fg: 'bg', bg: 'night', min: AA.text, use: 'Footer text' },
  { fg: 'gold-soft', bg: 'night', min: AA.text, use: 'Kickers and footer headings' },
  { fg: 'saffron', bg: 'night', min: AA.text, use: 'Saffron text on dark surfaces' },
  { fg: 'saffron-glow', bg: 'night', min: AA.text, use: 'Logo accent and links on dark surfaces' },
  { fg: 'success-on-dark', bg: 'night', min: AA.text, use: 'Newsletter success message' },
  { fg: 'error-on-dark', bg: 'night', min: AA.text, use: 'Newsletter error message' },
  { fg: 'saffron-ink', bg: 'bg', min: AA.ui, use: 'Focus ring on light surfaces' },
  { fg: 'saffron', bg: 'night', min: AA.ui, use: 'Focus ring on dark surfaces' },
  { fg: 'saffron-deep', bg: 'bg', min: AA.ui, use: 'Switch on' },
  { fg: 'muted', bg: 'bg', min: AA.ui, use: 'Switch off' },
]

/** Pairings that must never be used for text — asserted to stay below AA so the rule stays honest. */
export const forbiddenTextPairings: { fg: string; bg: string; reason: string }[] = [
  { fg: 'white', bg: 'saffron', reason: 'White on the design accent #D96B22 (D-046)' },
  { fg: 'saffron', bg: 'bg', reason: 'Accent is for icons and decoration, not text' },
  { fg: 'gold', bg: 'card', reason: 'Gold is for hairlines and decoration' },
]
