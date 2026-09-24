import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader } from '@/components/content/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import { directoryHref } from '@/lib/routes'
import { getStatesByRegion } from '@/server/queries'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Explore Bharat',
  description: 'Browse the sacred temples of Bharat region by region and state by state.',
  path: '/explore-bharat',
})

/**
 * Explore Bharat (D-006): a state-by-region browse page. Each region and state opens the
 * directory filtered to it. Only regions and states with published temples appear.
 */
export default async function ExploreBharatPage() {
  const regions = await getStatesByRegion()

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Explore Bharat' }])} />
      <PageHeader
        eyebrow="Sacred Bharat"
        title="Explore Bharat"
        lede="Browse temples region by region and state by state. Each state opens the directory, filtered to its temples."
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Explore Bharat' }]}
      />
      <div className="container-wide space-y-16 section-y">
        {regions.map((region) => (
          <section key={region.param} aria-labelledby={`region-${region.param}`}>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
              <h2 id={`region-${region.param}`} className="text-h2 text-charcoal-900">
                {region.label}
              </h2>
              <Link
                href={directoryHref({ region: region.param })}
                className="inline-flex min-h-11 items-center gap-1.5 font-medium text-saffron-800 underline-offset-4 hover:underline"
              >
                View all {region.count}
                <span className="sr-only">
                  {' '}
                  {region.count === 1 ? 'temple' : 'temples'} in the {region.label} region
                </span>
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {region.states.map((state) => (
                <li key={state.slug}>
                  <Link
                    href={directoryHref({ state: state.slug })}
                    className="group flex min-h-20 items-center justify-between gap-4 rounded-card border border-border bg-sand-100/60 px-5 py-4 transition-colors hover:border-gold-500 hover:bg-sand-100"
                  >
                    <span>
                      <span className="block font-display text-h3 text-charcoal-900">
                        {state.name}
                      </span>
                      <span className="text-small text-stone-600">
                        {state.count} {state.count === 1 ? 'temple' : 'temples'}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="size-5 shrink-0 text-saffron-800 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
