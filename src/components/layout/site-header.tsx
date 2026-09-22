import { SearchIcon } from 'lucide-react'
import Link from 'next/link'

import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { primaryNav, searchHref } from '@/lib/site-config'

import { MenuSheet } from './menu-sheet'
import { NavLink } from './nav-link'

/**
 * Site header (D-010, DESIGN-SYSTEM.md §4).
 * Mobile: logo, search icon, menu button. Desktop (md+): logo, primary nav, search.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ivory-50/90 backdrop-blur-md">
      <div className="container-wide flex h-(--top-bar-height) items-center justify-between gap-4 md:h-18">
        <Link
          href="/"
          aria-label="OrangeTemple home"
          className="-ml-1 inline-flex min-h-11 items-center rounded-md px-1"
        >
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-5 lg:gap-8">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" className="md:hidden">
            <Link href={searchHref} aria-label="Search temples">
              <SearchIcon aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm" className="hidden md:inline-flex">
            <Link href={searchHref}>
              <SearchIcon aria-hidden="true" />
              Search
            </Link>
          </Button>
          <div className="md:hidden">
            <MenuSheet />
          </div>
        </div>
      </div>
    </header>
  )
}
