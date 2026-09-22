'use client'

import { Compass, House, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { isTempleDetailPath, searchHref } from '@/lib/site-config'
import { cn } from '@/lib/utils'

import { TempleArchIcon } from './icons'

const tabs = [
  { href: '/', label: 'Home', Icon: House, match: (p: string) => p === '/' },
  {
    href: '/temples',
    label: 'Temples',
    Icon: TempleArchIcon,
    match: (p: string) => p === '/temples' || p.startsWith('/temples/'),
  },
  {
    href: '/explore-bharat',
    label: 'Explore',
    Icon: Compass,
    match: (p: string) => p.startsWith('/explore-bharat'),
  },
  // Search is an action, never the "current page".
  { href: searchHref, label: 'Search', Icon: SearchIcon, match: () => false },
] as const

/**
 * Mobile bottom tab bar (D-010). Hidden at md and up, and on temple detail pages,
 * where the action bar takes its place. 56px tall plus the safe-area inset.
 */
export function BottomNav() {
  const pathname = usePathname()
  if (isTempleDetailPath(pathname)) return null

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ivory-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="grid h-(--bottom-nav-height) grid-cols-4">
        {tabs.map(({ href, label, Icon, match }) => {
          const active = match(pathname)
          return (
            <li key={label} className="flex">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-1 flex-col items-center justify-center gap-0.5 text-[0.75rem] leading-4 font-medium transition-colors',
                  active ? 'text-saffron-800' : 'text-charcoal-700 hover:text-charcoal-900',
                )}
              >
                <Icon className="size-6" strokeWidth={active ? 2.25 : 1.75} aria-hidden="true" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
