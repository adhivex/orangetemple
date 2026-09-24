'use client'

import type { ComponentProps, FocusEvent } from 'react'

/**
 * Brings a focused carousel item fully into view. Browsers leave a partly visible
 * element where it is when it takes focus, so without this a keyboard user tabbing
 * through a mobile rail lands on cards that are mostly off screen. Does nothing when
 * the list is not scrolling sideways (the md+ grid).
 */
export function scrollFocusedItemIntoView(event: FocusEvent<HTMLElement>) {
  const list = event.currentTarget
  if (list.scrollWidth <= list.clientWidth) return
  const item = (event.target as HTMLElement).closest('li')
  if (!item || !list.contains(item)) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  item.scrollIntoView({
    block: 'nearest',
    inline: 'start',
    behavior: reduceMotion ? 'instant' : 'smooth',
  })
}

/** The `<ul>` of a <Rail>, with keyboard focus scrolling. */
export function RailList(props: ComponentProps<'ul'>) {
  return <ul {...props} onFocus={scrollFocusedItemIntoView} />
}
