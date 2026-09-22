import { describe, expect, it } from 'vitest'

import { isTempleDetailPath, primaryNav } from '@/lib/site-config'

describe('isTempleDetailPath (bottom bar vs action bar, D-010)', () => {
  it.each(['/temples/kedarnath', '/temples/baidyanath-deoghar', '/temples/somnath/'])(
    'treats %s as a temple page',
    (path) => expect(isTempleDetailPath(path)).toBe(true),
  )
  it.each(['/', '/temples', '/temples/', '/jyotirlingas', '/temples/kedarnath/photos'])(
    'does not treat %s as a temple page',
    (path) => expect(isTempleDetailPath(path)).toBe(false),
  )
})

describe('primary navigation', () => {
  it('has no Stories entry in V1 (D-005)', () => {
    expect(primaryNav.map((item) => item.href)).not.toContain('/stories')
  })
})
