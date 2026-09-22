'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Desktop header link with aria-current and an underline bar as the non-colour active cue. */
export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(`${href}/`)
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative inline-flex h-11 items-center px-1 text-[0.9375rem] font-medium transition-colors',
        'after:absolute after:inset-x-1 after:bottom-1.5 after:h-0.5 after:origin-left after:rounded-full after:bg-saffron-500 after:transition-transform after:duration-300',
        active
          ? 'text-charcoal-900 after:scale-x-100'
          : 'text-charcoal-700 after:scale-x-0 hover:text-charcoal-900 hover:after:scale-x-100',
      )}
    >
      {children}
    </Link>
  )
}
