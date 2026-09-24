import { describe, expect, it } from 'vitest'

import { pageWindow } from '@/components/directory/pagination'

describe('pageWindow', () => {
  it('shows every page when there are few', () => {
    expect(pageWindow(1, 3)).toEqual([1, 2, 3])
  })

  it('keeps first and last, a window around the current page, and marks gaps', () => {
    expect(pageWindow(6, 12)).toEqual([1, 'gap', 5, 6, 7, 'gap', 12])
    expect(pageWindow(1, 12)).toEqual([1, 2, 'gap', 12])
    expect(pageWindow(12, 12)).toEqual([1, 'gap', 11, 12])
  })

  it('does not insert a gap between adjacent pages', () => {
    expect(pageWindow(3, 5)).toEqual([1, 2, 3, 4, 5])
  })
})
