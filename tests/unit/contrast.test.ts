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
  it('defines every palette token from DESIGN-SYSTEM.md §2 with its documented value', () => {
    expect(tokens).toMatchObject({
      'ivory-50': '#fbf6ec',
      'sand-100': '#efe6d6',
      'charcoal-900': '#1f1b16',
      'charcoal-700': '#3a342d',
      'stone-600': '#6b6257',
      'saffron-500': '#f28c28',
      'saffron-700': '#bf510c',
      'saffron-800': '#a63f08',
      'gold-500': '#b08d3c',
    })
  })
})

describe('WCAG AA contrast (D-017)', () => {
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
