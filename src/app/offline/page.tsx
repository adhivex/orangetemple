import type { Metadata } from 'next'

import { LogoMark } from '@/components/brand/logo'
import { buttonVariants } from '@/components/ui/button'

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false },
}

/**
 * Offline fallback (MOBILE_WEBAPP.md §2, D-050). The service worker precaches this page
 * and shows it, at the address that was requested, for any page that is neither
 * reachable nor saved. It renders inside the normal layout, so the header, tab bar and
 * footer stay available. "Try again" is a plain form that reloads the current address,
 * so it works even when the page's JavaScript is not cached.
 */
export default function OfflinePage() {
  return (
    <section className="container-site py-20 text-center tablet:py-28">
      <LogoMark className="mx-auto size-14" />
      <h1 className="mt-8 font-serif text-[40px] leading-none font-medium text-ink tablet:text-[52px]">
        You&rsquo;re offline
      </h1>
      <p className="mx-auto mt-4 max-w-[28em] text-ink-2">
        We can&rsquo;t reach OrangeTemple right now. Pages you have already opened are saved on this
        device, so you can still read them. When you&rsquo;re back in signal, try again.
      </p>
      <form className="mt-8">
        <button type="submit" className={buttonVariants()}>
          Try again
        </button>
      </form>
    </section>
  )
}
