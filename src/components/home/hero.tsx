import Link from 'next/link'

import { ArrowRightIcon, TempleIcon } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'
import { homeCopy } from '@/content/home'
import { cn } from '@/lib/utils'

import { Skyline } from './skyline'

const copy = homeCopy.hero

/**
 * Homepage hero (HOMEPAGE_SPEC.md §2). The design's photograph is not used until a
 * licensed one exists (D-045, D-046): the dusk gradient carries the section, with a
 * temple silhouette and a skyline that settle in once on load (the page's single
 * orchestrated motion, off under reduced motion).
 * Phone: auto height, 112/110px padding. Tablet portrait: 72svh. Desktop: 90svh.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        'relative isolate flex items-start overflow-hidden text-white bg-hero-dusk',
        'tablet:min-h-[clamp(560px,72svh,720px)] tablet:items-center tablet-lg:min-h-[clamp(600px,90svh,760px)]',
        '[@media(orientation:landscape)_and_(max-height:520px)]:min-h-0',
      )}
    >
      {/* Decorative: a large temple silhouette on the right and a skyline along the base. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 animate-settle">
        <TempleIcon className="absolute -right-10 bottom-16 h-[340px] w-[310px] text-gold-soft opacity-[0.08] tablet:right-[4%] tablet:bottom-20 tablet:h-[460px] tablet:w-[420px] desktop:right-[8%] desktop:h-[540px] desktop:w-[490px]" />
        <Skyline className="absolute inset-x-0 bottom-0 h-[38%] text-night opacity-45" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(18_12_14/0.55)_0%,transparent_30%)]"
      />

      <div className="relative container-site pt-[calc(env(safe-area-inset-top)+112px)] pb-[110px] tablet:pt-[120px] tablet:pb-[120px] tablet-lg:pt-[110px] tablet-lg:pb-[110px] [@media(orientation:landscape)_and_(max-height:520px)]:py-24">
        <p className="mb-[18px] flex items-center gap-3.5 text-[9.5px] tracking-[2.6px] whitespace-nowrap text-gold-soft uppercase before:h-px before:w-6 before:bg-gold-soft tablet:mb-[26px] tablet:text-[11.5px] tablet:tracking-[5px] tablet:before:w-[42px]">
          {copy.kicker.join('  ·  ')}
        </p>
        <h1
          id="hero-title"
          className="max-w-[8em] font-serif text-[47px] leading-[0.98] font-medium tracking-[-0.8px] tablet:max-w-[9.5em] tablet:text-[clamp(50px,7vw,64px)] tablet-lg:text-[clamp(48px,6.4vw,84px)] [@media(orientation:landscape)_and_(max-height:520px)]:text-[42px]"
        >
          {copy.title}
        </h1>
        <p className="mt-[18px] mb-[26px] max-w-[19em] text-[15.5px] leading-[1.65] font-light text-white/82 tablet:mt-[26px] tablet:mb-9 tablet:max-w-[28em] tablet:text-[18px]">
          {copy.lead}
        </p>
        <div className="flex flex-col items-start gap-3 tablet:flex-row tablet:flex-wrap tablet:gap-3.5">
          <Link
            href={copy.primaryCta.href}
            className={cn(
              buttonVariants(),
              'h-auto min-w-[210px] px-6 py-3.5 text-[15.5px] tablet:min-w-0 tablet:px-7 tablet:py-[15px]',
            )}
          >
            {copy.primaryCta.label}
            <ArrowRightIcon />
          </Link>
          <Link
            href={copy.secondaryCta.href}
            className={cn(
              buttonVariants({ variant: 'ghost-light' }),
              'h-auto min-w-[210px] px-6 py-3.5 text-[15.5px] tablet:min-w-0 tablet:px-7 tablet:py-[15px]',
            )}
          >
            {copy.secondaryCta.label}
          </Link>
        </div>
        <blockquote className="mt-[34px] max-w-[13em] border-l border-gold-soft/40 pl-[18px] font-serif text-[18px] text-white/80 italic tablet:mt-[46px] tablet:max-w-none tablet:text-[21px]">
          “{copy.quote}”
        </blockquote>
      </div>
    </section>
  )
}
