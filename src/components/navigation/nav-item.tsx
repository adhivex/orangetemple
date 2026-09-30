'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { toast } from 'sonner'

import { useConsent } from '@/components/consent/cookie-consent-provider'
import type { LinkItem } from '@/content/home'
import { isCurrentPath } from '@/lib/site-config'

/**
 * Renders a navigation entry (src/content/home.ts `LinkItem`): a link to a real page
 * (with aria-current), a button that shows a "coming soon" toast for V1 non-goals
 * (D-053), or the button that reopens the cookie preferences.
 */
export function NavItem({
  item,
  className,
  onSelect,
  children,
}: {
  item: LinkItem
  className?: string
  /** Called after a selection, for example to close the menu sheet. */
  onSelect?: () => void
  children?: ReactNode
}) {
  const pathname = usePathname()
  const { openPreferences } = useConsent()
  const content = children ?? item.label

  if ('href' in item) {
    return (
      <Link
        href={item.href}
        aria-current={isCurrentPath(pathname, item.href) ? 'page' : undefined}
        className={className}
        onClick={onSelect}
      >
        {content}
      </Link>
    )
  }
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onSelect?.()
        if ('soon' in item) toast(item.soon)
        else openPreferences()
      }}
    >
      {content}
    </button>
  )
}

/** A button that only shows a "coming soon" toast (sign-in, the map, non-goal pages). */
export function SoonButton({
  message,
  className,
  children,
  'aria-label': ariaLabel,
}: {
  message: string
  className?: string
  children: ReactNode
  'aria-label'?: string
}) {
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={() => toast(message)}
    >
      {children}
    </button>
  )
}
