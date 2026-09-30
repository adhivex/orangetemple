import Link from 'next/link'
import type { ComponentType, ReactNode, SVGProps } from 'react'

import { LotusIcon, MapIcon, NamasteIcon, PeopleIcon } from '@/components/icons'
import { homeCopy } from '@/content/home'

const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  namaste: NamasteIcon,
  people: PeopleIcon,
  map: MapIcon,
  lotus: LotusIcon,
}

const itemClass =
  'flex h-full flex-col items-center gap-2 rounded-[12px] px-0.5 pt-3.5 pb-3 text-center transition-colors tablet:gap-2.5 tablet:px-2.5 tablet:py-5 desktop:flex-row desktop:gap-4 desktop:px-[26px] desktop:text-left'

/**
 * Highlights panel overlapping the hero (HOMEPAGE_SPEC.md §3): four columns at every
 * width, with gold hairline dividers. Phones stack icon over label and hide subtitles,
 * except under the first item. The first item is not a link: it states that more
 * temples are coming, with no number (D-045(3)).
 */
export function StatsPanel() {
  return (
    <nav
      aria-label="Highlights"
      className="relative z-[3] -mt-[46px] px-3.5 tablet:px-8 desktop:-mt-[62px] desktop:px-0"
    >
      <ul className="mx-auto grid max-w-[calc(1200px-64px)] grid-cols-4 rounded-[16px] border border-line bg-card-surface p-1.5 shadow-lift tablet:max-w-none tablet:rounded-panel tablet:p-2.5 desktop:max-w-[calc(1200px-64px)]">
        {homeCopy.stats.map((stat, index) => {
          const Icon = icons[stat.icon]!
          const first = index === 0
          const content: ReactNode = (
            <>
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold-line bg-surface-alt text-[22px] text-saffron desktop:size-[54px] desktop:text-[28px]">
                <Icon />
              </span>
              <span>
                <span className="block text-[12.5px] leading-[1.2] font-medium text-ink tablet:font-serif tablet:text-[19px] tablet:leading-[1.1] tablet:font-semibold desktop:text-[21px]">
                  {stat.title}
                </span>
                <span
                  className={
                    first
                      ? 'mt-0.5 block text-[10.5px] leading-[1.2] text-muted-ink tablet:mt-1 tablet:text-[12.5px]'
                      : 'mt-1 hidden text-[12.5px] text-muted-ink tablet:block'
                  }
                >
                  {stat.subtitle}
                </span>
              </span>
            </>
          )
          return (
            <li
              key={stat.title}
              className="relative before:absolute before:inset-y-[18%] before:left-0 before:w-px before:bg-[linear-gradient(transparent,var(--color-gold-line),transparent)] first:before:hidden tablet:before:inset-y-[22%]"
            >
              {'href' in stat ? (
                <Link href={stat.href} className={`${itemClass} hover:bg-surface-alt`}>
                  {content}
                </Link>
              ) : (
                <div className={itemClass}>{content}</div>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
