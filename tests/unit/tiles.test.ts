import { describe, expect, it } from 'vitest'

import { visibleTiles } from '@/lib/tiles'

describe('visibleTiles (D-007)', () => {
  const tile = (slug: string, count: number) => ({ slug, name: slug, count })

  it('hides tiles with no published temples', () => {
    expect(
      visibleTiles([tile('shiva', 12), tile('devi', 0), tile('vishnu', 1), tile('krishna', 1)]).map(
        (t) => t.slug,
      ),
    ).toEqual(['shiva', 'vishnu', 'krishna'])
  })

  it('hides the whole section when fewer than three tiles remain', () => {
    expect(visibleTiles([tile('shiva', 12), tile('vishnu', 1), tile('devi', 0)])).toEqual([])
  })
})
