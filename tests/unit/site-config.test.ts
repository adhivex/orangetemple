import { describe, expect, it } from 'vitest'

import { isCurrentPath, isTempleDetailPath, primaryNav } from '@/lib/site-config'

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
  it('links Stories to no page in V1: it is a "coming soon" toast (D-005, D-053)', () => {
    const stories = primaryNav.find((item) => item.label === 'Stories')
    expect(stories).toBeDefined()
    expect(stories).not.toHaveProperty('href')
    expect(stories).toHaveProperty('soon')
  })
})

describe('isCurrentPath', () => {
  it('matches Home only on the homepage', () => {
    expect(isCurrentPath('/', '/')).toBe(true)
    expect(isCurrentPath('/temples', '/')).toBe(false)
  })
  it('matches a section and its children', () => {
    expect(isCurrentPath('/temples', '/temples')).toBe(true)
    expect(isCurrentPath('/temples/kedarnath', '/temples')).toBe(true)
    expect(isCurrentPath('/templesx', '/temples')).toBe(false)
  })
})
