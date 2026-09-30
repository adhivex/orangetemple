'use client'

import Link from 'next/link'

import { LotusIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { homeCopy } from '@/content/home'
import { cn } from '@/lib/utils'

import { useConsent } from './cookie-consent-provider'

const copy = homeCopy.cookieConsent

/**
 * First-visit cookie banner (HOMEPAGE_SPEC.md "Cookie consent"). A non-blocking region:
 * the page stays usable. Rejecting is exactly as easy as accepting, and there is no
 * close button, so the visitor makes a choice. Phones: full width above the tab bar.
 * Tablets: 400px card bottom-left. Desktop: 420px.
 */
export function CookieBanner({ visible }: { visible: boolean }) {
  const { save, openPreferences } = useConsent()

  return (
    <section
      aria-labelledby="cookie-banner-title"
      hidden={!visible}
      className={cn(
        'fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+82px)] z-[65] rounded-panel border border-line bg-card-surface px-[18px] pt-[18px] pb-3.5 text-ink shadow-[0_24px_60px_-18px_rgb(43_33_24/0.45)]',
        'tablet:right-auto tablet:bottom-[calc(env(safe-area-inset-bottom)+24px)] tablet:left-6 tablet:w-[400px] tablet:px-[22px] tablet:pt-[22px] tablet:pb-[18px] desktop:w-[420px]',
        visible && 'animate-in duration-500 ease-temple fade-in-0 slide-in-from-bottom-5',
      )}
    >
      <div className="mb-2 flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold-line bg-surface-alt text-[20px] text-saffron">
          <LotusIcon />
        </span>
        <h2
          id="cookie-banner-title"
          className="font-serif text-[23px] leading-[1.1] font-semibold text-ink"
        >
          {copy.title}
        </h2>
      </div>
      <p className="mb-4 text-[13.5px] leading-[1.6] text-ink-2">
        {copy.text}{' '}
        <Link
          href="/privacy"
          className="text-saffron-ink underline underline-offset-2 hover:text-saffron-deep"
        >
          {copy.policyLink}
        </Link>
        .
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="min-h-[46px] bg-card-surface px-3.5 text-[14px] hover:border-saffron-ink hover:text-saffron-ink"
          onClick={() => save({ analytics: false, marketing: false })}
        >
          {copy.reject}
        </Button>
        <Button
          size="sm"
          className="min-h-[46px] px-3.5 text-[14px]"
          onClick={() => save({ analytics: true, marketing: true })}
        >
          {copy.accept}
        </Button>
      </div>
      <button
        type="button"
        onClick={openPreferences}
        className="mt-1 block min-h-11 w-full text-[13px] text-muted-ink underline underline-offset-[3px] hover:text-saffron-ink"
      >
        {copy.customise}
      </button>
    </section>
  )
}
