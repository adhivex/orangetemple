'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, type ComponentType, type SVGProps } from 'react'

import { HomeIcon, MapIcon, MoreIcon, SearchIcon, TempleIcon } from '@/components/icons'
import { SearchButton } from '@/components/search/search-button'
import { isCurrentPath, isTempleDetailPath } from '@/lib/site-config'
import { cn } from '@/lib/utils'

import { useShell } from './shell-context'

type Tab = { label: string; href: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }

/** D-047: every tab leads somewhere real in V1. Search and More are actions, never "current". */
const tabs: Tab[] = [
  { label: 'Home', href: '/', Icon: HomeIcon },
  { label: 'Temples', href: '/temples', Icon: TempleIcon },
  { label: 'Explore', href: '/explore-bharat', Icon: MapIcon },
]

const itemClass =
  'flex min-h-14 flex-col items-center justify-center gap-[3px] text-[10.5px] tracking-[0.3px] text-muted-ink transition-colors select-none active:scale-[0.97] aria-[current=page]:text-saffron-ink [&_svg]:text-[21px]'

/**
 * Floating bottom tab bar on phones (HOMEPAGE_SPEC.md §12, MOBILE_WEBAPP.md §4, D-047):
 * frosted panel 10px from the sides and 8px above the safe area. "More" opens the menu
 * sheet. Hidden from tablet up, and on temple pages, where the action bar replaces it.
 */
export function MobileTabBar() {
  const pathname = usePathname()
  const { menuOpen, openMenu, prefetchMenu } = useShell()
  const more = useRef<HTMLButtonElement>(null)
  if (isTempleDetailPath(pathname)) return null

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-2.5 bottom-[calc(env(safe-area-inset-bottom)+8px)] z-[45] rounded-[20px] border border-line bg-surface/92 shadow-[0_12px_30px_-10px_rgb(43_33_24/0.3)] backdrop-blur-[16px] backdrop-saturate-[1.4] tablet:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map(({ label, href, Icon }) => (
          <li key={label}>
            <Link
              href={href}
              aria-current={isCurrentPath(pathname, href) ? 'page' : undefined}
              className={itemClass}
            >
              <Icon />
              {label}
            </Link>
          </li>
        ))}
        <li>
          <SearchButton className={cn(itemClass, 'w-full')}>
            <SearchIcon />
            Search
          </SearchButton>
        </li>
        <li>
          <button
            ref={more}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onPointerDown={prefetchMenu}
            onClick={() => openMenu(more.current)}
            className={cn(itemClass, 'w-full')}
          >
            <MoreIcon />
            More
          </button>
        </li>
      </ul>
    </nav>
  )
}
