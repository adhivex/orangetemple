import { Compass } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

/**
 * "Sacred Bharat" entry point (PRD §5.7, D-006): leads to the state-by-region browse
 * page. Saffron-500 band with charcoal text (6.98:1).
 */
export function SacredBharat() {
  return (
    <section aria-labelledby="sacred-bharat-title" className="bg-saffron-500 render-lazily">
      <div className="container-wide flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <div className="max-w-2xl">
          <p className="text-label font-medium text-charcoal-900 uppercase">Sacred Bharat</p>
          <h2 id="sacred-bharat-title" className="mt-3 text-h2 text-charcoal-900">
            Explore Bharat, state by state
          </h2>
          <p className="mt-3 text-charcoal-900">
            Browse the temples of each region and state, from the Himalaya to the southern coast.
          </p>
        </div>
        <Button asChild variant="dark" size="lg" className="self-start md:self-auto">
          <Link href="/explore-bharat">
            <Compass aria-hidden="true" />
            Explore Bharat
          </Link>
        </Button>
      </div>
    </section>
  )
}
