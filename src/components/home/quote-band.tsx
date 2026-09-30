import { LotusIcon } from '@/components/icons'
import { homeCopy } from '@/content/home'

import { Skyline } from './skyline'

const copy = homeCopy.band

/**
 * Quote band (HOMEPAGE_SPEC.md §9), fading into the footer's `night`. The design's
 * mountain photograph is not used (D-045): a dusk glow and skyline stand in.
 */
export function QuoteBand() {
  return (
    <section
      aria-label="A thought from OrangeTemple"
      className="relative isolate overflow-hidden px-6 pt-[100px] pb-10 text-center text-white render-lazily bg-band-dusk tablet:pt-[150px] tablet:pb-16"
    >
      <Skyline className="pointer-events-none absolute inset-x-0 top-6 -z-10 h-24 text-night opacity-40" />
      <div
        aria-hidden="true"
        className="mb-[22px] flex items-center justify-center gap-3.5 text-[22px] text-gold-soft before:h-px before:w-[60px] before:bg-gold-soft/40 after:h-px after:w-[60px] after:bg-gold-soft/40"
      >
        <LotusIcon />
      </div>
      <blockquote>
        <p className="mx-auto max-w-[22em] font-serif text-[25px] leading-[1.3] font-normal italic tablet:text-[clamp(24px,3vw,38px)]">
          {copy.quote}
        </p>
        <footer className="mt-[22px] text-[10.5px] tracking-[5px] text-gold-soft uppercase">
          — {copy.attribution}
        </footer>
      </blockquote>
    </section>
  )
}
