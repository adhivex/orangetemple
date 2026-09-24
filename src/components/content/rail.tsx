import { Children, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { RailList } from './rail-list'

/**
 * Horizontal swipe rail on mobile (scroll-snap, next card peeking), grid from md up
 * (DESIGN-SYSTEM.md §5). Scrolling is CSS; the only client code scrolls a card fully
 * into view when a keyboard user tabs to it (see <RailList>).
 */
export function Rail({
  children,
  label,
  columns = 3,
  className,
}: {
  children: ReactNode
  /** Accessible name for the list. */
  label: string
  columns?: 3 | 4
  className?: string
}) {
  return (
    <RailList
      aria-label={label}
      className={cn(
        '-mx-(--gutter) scrollbar-none flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) pb-2',
        'md:mx-0 md:grid md:snap-none md:gap-x-6 md:gap-y-12 md:overflow-visible md:px-0 md:pb-0',
        columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {Children.map(children, (child) => (
        <li className="w-[78%] max-w-80 shrink-0 snap-start md:w-auto md:max-w-none">{child}</li>
      ))}
    </RailList>
  )
}
