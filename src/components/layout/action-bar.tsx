'use client'

import { Navigation, Share2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ActionBarProps = {
  /** Temple name, used as the share title. */
  title: string
  /** Verified coordinates only. When absent, Directions is hidden (CONTENT-MODEL.md §3). */
  latitude?: number | null
  longitude?: number | null
  /** `fixed` pins the bar above the safe area on mobile; `inline` is for previews. */
  placement?: 'fixed' | 'inline'
}

/**
 * Temple-page action bar (D-010): replaces the bottom tab bar on temple pages.
 * Directions opens the device's maps app from coordinates; Share uses the Web Share
 * API and falls back to copying the link.
 */
export function ActionBar({ title, latitude, longitude, placement = 'fixed' }: ActionBarProps) {
  const [status, setStatus] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const hasCoordinates = typeof latitude === 'number' && typeof longitude === 'number'
  // Google Maps universal link: opens the installed maps app on Android and iOS, the web elsewhere.
  const directionsHref = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : undefined

  function announce(message: string) {
    setStatus(message)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus(''), 2500)
  }

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      announce('Link copied')
    } catch {
      announce('Could not copy the link')
    }
  }

  return (
    <div
      className={cn(
        placement === 'fixed' &&
          'fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ivory-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden',
        placement === 'inline' && 'relative rounded-card border border-border bg-ivory-50',
      )}
    >
      <div className="flex min-h-(--bottom-nav-height) items-center gap-3 px-4 py-2">
        {directionsHref && (
          <Button asChild className="h-11 flex-1">
            <a href={directionsHref} target="_blank" rel="noopener noreferrer">
              <Navigation aria-hidden="true" />
              Directions
              <span className="sr-only"> (opens your maps app)</span>
            </a>
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={share}
          className={cn('h-11', directionsHref ? 'flex-1' : 'w-full')}
        >
          <Share2 aria-hidden="true" />
          Share
        </Button>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>
      {status && (
        <p
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-12 mx-auto w-fit rounded-full bg-charcoal-900 px-4 py-2 text-small text-ivory-50 shadow-card"
        >
          {status}
        </p>
      )}
    </div>
  )
}
