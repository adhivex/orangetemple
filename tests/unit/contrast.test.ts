import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  AA,
  approvedPairings,
  contrastRatio,
  forbiddenTextPairings,
  parseColorTokens,
} from '@/lib/contrast'

const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8')
const tokens = parseColorTokens(css)

describe('design tokens', () => {
  it('defines every palette token from docs/design with its documented value (D-046)', () => {
    expect(tokens).toMatchObject({
      bg: '#fbf1e5',
      'bg-alt': '#faf7f0',
      card: '#ede2cf',
      ink: '#2b2118',
      'ink-2': '#5a4332',
      muted: '#80563a',
      line: '#e2d4bd',
      saffron: '#d96b22',
      'saffron-deep': '#b5561a',
      'saffron-ink': '#a34c14',
      'saffron-soft': '#f6dfc9',
      gold: '#8b5e3c',
      'gold-soft': '#ede2cf',
      night: '#2b2118',
      white: '#ffffff',
    })
  })
})

describe('WCAG AA contrast (D-017, D-046)', () => {
  it.each(approvedPairings)('$use: $fg on $bg meets $min:1', ({ fg, bg, min }) => {
    expect(tokens[fg], `missing token --${fg}`).toBeDefined()
    expect(tokens[bg], `missing token --${bg}`).toBeDefined()
    expect(contrastRatio(tokens[fg]!, tokens[bg]!)).toBeGreaterThanOrEqual(min)
  })

  it.each(forbiddenTextPairings)('$reason: $fg on $bg stays below AA text', ({ fg, bg }) => {
    expect(contrastRatio(tokens[fg]!, tokens[bg]!)).toBeLessThan(AA.text)
  })
})

describe('contrastRatio', () => {
  it('matches known reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5)
    // DESIGN-SYSTEM.md: white on #FF9933 is "only about 2:1"
    expect(contrastRatio('#ffffff', '#ff9933')).toBeCloseTo(2.1, 1)
  })
})
