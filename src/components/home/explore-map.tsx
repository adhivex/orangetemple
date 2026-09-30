import Link from 'next/link'

import { ArrowRightIcon, MapIcon, PinIcon } from '@/components/icons'
import { SoonButton } from '@/components/navigation/nav-item'
import { buttonVariants } from '@/components/ui/button'
import { homeCopy, soon } from '@/content/home'
import { cn } from '@/lib/utils'

import { Skyline } from './skyline'

const copy = homeCopy.map

/**
 * Explore Sacred Bharat (HOMEPAGE_SPEC.md §7). The interactive map is a V1 non-goal, so
 * its button shows a "coming soon" toast; a text link leads to the state-by-region page
 * (D-006). The design's map image is not used (D-045); a medallion with pins stands in.
 * Desktop: text | medallion | quote. Tablet: two columns, quote below. Phone: text at
 * 64% width with the medallion beside it and the quote right-aligned underneath.
 */
export function ExploreMap() {
  return (
    <section
      id="explore-bharat"
      aria-labelledby="explore-bharat-title"
      className="relative isolate overflow-hidden render-lazily bg-map-glow"
    >
      <Skyline className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] text-gold opacity-10" />
      <div className="relative container-site pt-12 pb-11 tablet:grid tablet:min-h-[340px] tablet:grid-cols-2 tablet:items-center tablet:gap-10 tablet:py-10 desktop:min-h-[380px] desktop:grid-cols-[1.1fr_1fr_0.9fr]">
        <div className="relative z-[1] max-w-[64%] tablet:max-w-none">
          <h2
            id="explore-bharat-title"
            className="max-w-[6.5em] font-serif text-[34px] leading-none font-medium text-ink tablet:max-w-none tablet:text-[clamp(34px,3.8vw,48px)]"
          >
            {copy.title}
          </h2>
          <p className="mt-3.5 mb-[30px] max-w-[22em] text-[14.5px] text-ink-2 tablet:text-[16px]">
            {copy.subtitle}
          </p>
          <SoonButton
            message={soon.map}
            className={cn(buttonVariants(), 'h-auto px-[26px] py-3.5 whitespace-nowrap')}
          >
            {copy.cta}
            <ArrowRightIcon />
          </SoonButton>
          <Link
            href="/explore-bharat"
            className="mt-3 flex min-h-11 items-center text-[14px] font-medium text-saffron-ink underline decoration-gold-line underline-offset-4 hover:decoration-saffron-ink"
          >
            {copy.browse}
          </Link>
        </div>

        <div
          aria-hidden="true"
          className="absolute top-[190px] right-[-8px] w-[48%] max-w-[240px] tablet:static tablet:mx-auto tablet:w-full tablet:max-w-[300px]"
        >
          <div className="relative mx-auto grid aspect-square w-full place-items-center rounded-full border border-gold-line bg-surface/60 shadow-[0_20px_30px_rgb(139_94_60/0.2)]">
            <div className="absolute inset-[12%] rounded-full border border-gold-line" />
            <div className="absolute inset-[26%] rounded-full border border-dashed border-gold-line" />
            <MapIcon className="size-[34%] text-saffron" />
            <PinIcon className="absolute top-[18%] left-[34%] size-[9%] text-saffron-deep" />
            <PinIcon className="absolute top-[44%] right-[16%] size-[8%] text-saffron" />
            <PinIcon className="absolute bottom-[20%] left-[24%] size-[7%] text-saffron-deep" />
          </div>
        </div>

        <blockquote className="relative z-[1] mt-[130px] ml-auto max-w-[10em] text-right font-serif text-[21px] leading-[1.4] text-ink-2 italic after:mt-4 after:ml-auto after:block after:h-px after:w-14 after:bg-gold tablet:col-span-full tablet:mt-0 tablet:justify-self-center tablet:text-center tablet:after:mx-auto desktop:col-span-1 desktop:max-w-[11em] desktop:text-[25px] desktop:after:mt-[22px]">
          “{copy.quote}”
        </blockquote>
      </div>
    </section>
  )
}
