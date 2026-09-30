'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Logo } from '@/components/brand/logo'
import { MenuIcon, SearchIcon } from '@/components/icons'
import { NavItem, SoonButton } from '@/components/navigation/nav-item'
import { soon } from '@/content/home'
import { primaryNav, searchHref } from '@/lib/site-config'
import { cn } from '@/lib/utils'

import { useShell } from './shell-context'

/** Past this, the header turns solid (HOMEPAGE_SPEC.md §1). */
const SOLID_AFTER = 40
/** Phones hide the header when scrolling down past this (MOBILE_WEBAPP.md §4). */
const HIDE_AFTER = 260
const PHONE_MAX = 640

/**
 * Site header (HOMEPAGE_SPEC.md §1, MOBILE_WEBAPP.md §4 and §6).
 * - Phone: logo, search, menu. Hides on scroll down, returns on any scroll up.
 * - Tablet portrait: the same, 72px tall; the menu opens as a right-side sheet.
 * - Tablet landscape and desktop: inline navigation and Sign In.
 * On the homepage it starts transparent over the hero and turns solid after 40px; on
 * every other page it is solid from the start and reserves its own height.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const overHero = pathname === '/'
  const { menuOpen, openMenu, prefetchMenu } = useShell()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const menuOpenRef = useRef(menuOpen)
  useEffect(() => {
    menuOpenRef.current = menuOpen
  }, [menuOpen])

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > SOLID_AFTER)
      const phone = window.innerWidth <= PHONE_MAX
      if (phone && y > HIDE_AFTER && y > lastY + 4 && !menuOpenRef.current) setHidden(true)
      else if (y < lastY - 4 || y < HIDE_AFTER || !phone) setHidden(false)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = !overHero || scrolled

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background-color,color,box-shadow,translate] duration-[400ms] ease-temple',
          solid
            ? 'bg-surface/90 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-[14px] backdrop-saturate-[1.4]'
            : 'text-white',
          hidden && !menuOpen && '-translate-y-full',
        )}
      >
        <div
          className={cn(
            'container-site flex h-[62px] items-center gap-7 transition-[height] duration-[400ms] ease-temple tablet:h-[72px] tablet-lg:gap-[18px] desktop:gap-7',
            solid ? 'tablet-lg:h-[66px]' : 'tablet-lg:h-[78px]',
          )}
        >
          <Link
            href="/"
            aria-label="OrangeTemple home"
            className="-ml-1 inline-flex min-h-11 items-center rounded-md px-1"
          >
            <Logo tone={solid ? 'onCream' : 'onPhoto'} />
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden tablet-lg:block">
            <ul className="flex items-center gap-5 text-[13.5px] tracking-[0.3px] desktop:gap-[34px] desktop:text-[14px]">
              {primaryNav.map((item) => (
                <li key={item.label}>
                  <NavItem
                    item={item}
                    className={cn(
                      'relative inline-flex min-h-11 items-center whitespace-nowrap opacity-85 transition-opacity hover:opacity-100 aria-[current=page]:font-medium aria-[current=page]:opacity-100',
                      'after:absolute after:inset-x-1/2 after:bottom-2 after:h-px after:bg-current after:transition-[left,right] after:duration-300 after:ease-temple hover:after:inset-x-0 aria-[current=page]:after:inset-x-0',
                      solid && 'aria-[current=page]:text-saffron-ink',
                    )}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-0.5 tablet-lg:ml-3.5 tablet-lg:gap-1.5 desktop:ml-[30px] desktop:gap-3">
            <Link
              href={searchHref}
              aria-label="Search temples"
              className="grid size-11 place-items-center rounded-full text-[20px] transition-colors hover:bg-current/10 pointer-coarse:size-[46px]"
            >
              <SearchIcon />
            </Link>
            <SoonButton
              message={soon.signIn}
              className={cn(
                'hidden min-h-11 items-center rounded-button border border-current px-4 text-[13.5px] font-medium whitespace-nowrap transition-colors hover:border-saffron-deep hover:bg-saffron-deep hover:text-white tablet-lg:inline-flex desktop:px-5',
                solid && 'text-saffron-ink',
              )}
            >
              Sign In
            </SoonButton>
            <button
              ref={menuButton}
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onPointerEnter={prefetchMenu}
              onFocus={prefetchMenu}
              onClick={() => openMenu(menuButton.current)}
              className="grid size-11 place-items-center rounded-full text-[20px] transition-colors hover:bg-current/10 tablet-lg:hidden pointer-coarse:size-[46px]"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      {/* Pages without a hero start below the fixed header. */}
      {!overHero && (
        <div
          aria-hidden="true"
          className="h-[calc(62px+env(safe-area-inset-top))] tablet:h-[calc(72px+env(safe-area-inset-top))] tablet-lg:h-[calc(66px+env(safe-area-inset-top))]"
        />
      )}
    </>
  )
}
