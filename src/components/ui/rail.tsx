'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

const arrowClass =
  'absolute top-[calc(50%-30px)] z-[3] grid size-11 place-items-center rounded-full border border-line bg-card-surface text-[17px] text-ink shadow-soft transition-colors hover:border-saffron-deep hover:bg-saffron-deep hover:text-white tablet:size-[46px] pointer-coarse:size-12'

/**
 * Keyboard focus in a horizontal list: scrolls the focused item to the list's start when
 * it is not fully in view (minus `clearance` at the end, for an overlaid arrow). Browsers
 * do not always scroll nested horizontal scrollers on focus, and scroll-snap can pull a
 * focused card back off-screen, so this keeps focus visible (WCAG 2.4.11).
 */
function revealFocusedItem(list: HTMLElement, target: EventTarget, clearance: number) {
  const item = target instanceof Element ? target.closest('li') : null
  if (!item) return
  const box = list.getBoundingClientRect()
  const card = item.getBoundingClientRect()
  if (card.left >= box.left && card.right <= box.right - clearance) return
  list.scrollBy({
    left: card.left - box.left - (parseFloat(getComputedStyle(list).paddingLeft) || 0),
  })
}

/** A horizontally scrolling <ul> that keeps keyboard focus in view (see revealFocusedItem). */
export function ScrollList({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      className={className}
      onFocus={(event) => revealFocusedItem(event.currentTarget, event.target, 0)}
      {...props}
    />
  )
}

/**
 * Horizontal card rail (DESIGN_SYSTEM.md "Accessibility baseline", HOMEPAGE_SPEC.md §4):
 * native scroll with scroll-snap, so touch, trackpad and keyboard (Tab to a card) all
 * work without JavaScript. The arrows are an enhancement: they scroll one card on phones
 * and two from tablet landscape up, and are hidden (not just disabled) at either end.
 * Phones show only the next arrow. The track bleeds off the right edge so the next card
 * peeks. `columnsClassName` sets how many cards are visible per breakpoint.
 */
export function Rail({
  label,
  columnsClassName,
  showPrevOnMobile = false,
  children,
}: {
  /** Names the arrows, e.g. "Jyotirlingas" → "Next Jyotirlingas". */
  label: string
  columnsClassName: string
  showPrevOnMobile?: boolean
  children: ReactNode
}) {
  const track = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    setAtStart(el.scrollLeft < 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [update])

  const scroll = (direction: 1 | -1) => {
    const el = track.current
    const first = el?.firstElementChild
    if (!el || !first) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    const cards = window.innerWidth > 980 ? 2 : 1
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({
      left: direction * cards * (first.getBoundingClientRect().width + gap),
      behavior: reduce ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Previous ${label}`}
        hidden={atStart}
        onClick={() => scroll(-1)}
        className={cn(
          arrowClass,
          '-left-2 tablet:-left-2.5 desktop:-left-2 min-[1320px]:-left-[23px]',
          !showPrevOnMobile && 'max-tablet:hidden',
        )}
      >
        <ChevronLeftIcon />
      </button>
      <ul
        ref={track}
        // 64px clearance keeps the focused card out from under the Next arrow.
        onFocus={(event) => revealFocusedItem(event.currentTarget, event.target, 64)}
        className={cn(
          'scrollbar-none grid snap-x snap-mandatory auto-cols-[var(--rail-col)] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain px-0.5 pt-1 pb-[18px]',
          '-mr-[max(20px,env(safe-area-inset-right))] pr-[max(20px,env(safe-area-inset-right))] tablet:-mr-8 tablet:gap-4 tablet:pr-8 tablet-lg:gap-5 desktop:mr-0 desktop:pr-0.5',
          columnsClassName,
        )}
      >
        {children}
      </ul>
      <button
        type="button"
        aria-label={`Next ${label}`}
        hidden={atEnd}
        onClick={() => scroll(1)}
        className={cn(arrowClass, 'right-1.5 desktop:-right-2 min-[1320px]:-right-[23px]')}
      >
        <ChevronRightIcon />
      </button>
    </div>
  )
}
