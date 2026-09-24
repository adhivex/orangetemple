import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { collectionHref } from '@/lib/routes'

/**
 * Homepage hero (PRD §5.1, DESIGN-SYSTEM.md §6): sacred discovery and a single strong
 * call to action. Typographic until licensed photography exists; the arch is abstract
 * geometry from the brand mark, not a depiction of any temple. Stats come from the
 * database, never hardcoded.
 */
export function HomeHero({ stats }: { stats: { temples: number; states: number } }) {
  return (
    <section
      aria-labelledby="home-title"
      className="relative isolate overflow-hidden border-b border-border"
    >
      <ArchMotif />
      <div className="relative container-wide pt-14 pb-16 md:pt-24 md:pb-28">
        <p className="flex items-center gap-3 text-label font-medium text-saffron-800 uppercase">
          <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
          Sacred temples of Bharat
        </p>
        <h1 id="home-title" className="mt-6 max-w-[14ch] text-display text-charcoal-900">
          Discover the sacred temples of Bharat
        </h1>
        <p className="mt-6 max-w-[42ch] text-charcoal-700 md:text-[1.25rem] md:leading-8">
          Why each place matters, what history records, the traditions that surround it, and how to
          plan your visit — beginning with the twelve Jyotirlingas and the Char Dham.
        </p>
        <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Button asChild size="lg">
            <Link href="/temples">
              Explore the temples
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Link
            href={collectionHref('jyotirlingas')}
            className="inline-flex min-h-11 items-center font-medium text-saffron-800 underline underline-offset-4"
          >
            Begin with the 12 Jyotirlingas
          </Link>
        </div>
        <p className="mt-12 text-small text-stone-600">
          {stats.temples} temples across {stats.states} states, and growing.
        </p>
      </div>
    </section>
  )
}

/** Large outlined doorway arch in gold hairlines — decorative only. */
function ArchMotif() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 400 520"
      className="pointer-events-none absolute -right-24 -bottom-10 -z-10 h-[26rem] w-auto opacity-30 md:right-[4%] md:bottom-0 md:h-[36rem] md:opacity-100"
    >
      <g fill="none" className="stroke-gold-500" strokeWidth="1.25" strokeLinejoin="round">
        <path d="M40 520V230C40 150 110 95 200 20C290 95 360 150 360 230V520" />
        <path d="M80 520V250C80 188 132 146 200 90C268 146 320 188 320 250V520" opacity="0.7" />
        <path d="M130 520V300C130 262 162 236 200 206C238 236 270 262 270 300V520" opacity="0.5" />
      </g>
      <path
        d="M152 520V330C152 306 172 290 200 270C228 290 248 306 248 330V520Z"
        className="fill-saffron-500"
        opacity="0.12"
      />
    </svg>
  )
}
