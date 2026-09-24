import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader } from '@/components/content/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import { collectionHref } from '@/lib/routes'
import { siteConfig } from '@/lib/site-config'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description: `About ${siteConfig.name}: a careful, mobile-first guide to the sacred temples of Bharat.`,
  path: '/about',
})

/** About (ROUTES.md). Describes how the site works; makes no claims about any temple. */
export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'About' }])} />
      <PageHeader
        eyebrow="About"
        title="About OrangeTemple"
        lede="A guide to the sacred temples and spiritual heritage of Bharat: why each place matters, what history records, the traditions that surround it, and how to plan a visit."
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'About' }]}
      />
      <div className="container-narrow space-y-12 section-y text-charcoal-700">
        <section aria-labelledby="start">
          <h2 id="start" className="text-h2 text-charcoal-900">
            Where we begin
          </h2>
          <p className="mt-4">
            OrangeTemple begins with two of the most widely followed pilgrimages: the{' '}
            <Link
              href={collectionHref('jyotirlingas')}
              className="text-saffron-800 underline underline-offset-4"
            >
              twelve Jyotirlingas
            </Link>{' '}
            and the{' '}
            <Link
              href={collectionHref('char-dham')}
              className="text-saffron-800 underline underline-offset-4"
            >
              Char Dham
            </Link>
            . More temples and collections will follow.
          </p>
        </section>

        <section aria-labelledby="principles">
          <h2 id="principles" className="text-h2 text-charcoal-900">
            How we write about sacred places
          </h2>
          <ul className="mt-4 space-y-4">
            <li>
              <strong className="text-charcoal-900">History and belief are kept apart.</strong>{' '}
              Documented history and traditional legend appear in separate sections, and legends are
              always labelled as traditional belief.
            </li>
            <li>
              <strong className="text-charcoal-900">Disputed sites are named as disputed.</strong>{' '}
              Where more than one place is associated with a temple in different traditions, the
              page says so.
            </li>
            <li>
              <strong className="text-charcoal-900">Visit details carry a date.</strong> Timings and
              access rules change, so we show them only with a source and the date they were last
              checked. Please confirm with the temple before you travel.
            </li>
            <li>
              <strong className="text-charcoal-900">Photographs are real and credited.</strong> We
              use original or licensed photography only, credit every image, and never use
              AI-generated images of temples or deities.
            </li>
            <li>
              <strong className="text-charcoal-900">We would rather leave a gap.</strong> If we
              cannot verify a fact, a timing or a location, we leave it out instead of guessing.
            </li>
          </ul>
        </section>

        <section aria-labelledby="corrections">
          <h2 id="corrections" className="text-h2 text-charcoal-900">
            Corrections
          </h2>
          <p className="mt-4">
            If something on OrangeTemple is inaccurate or out of date, please{' '}
            <Link href="/contact" className="text-saffron-800 underline underline-offset-4">
              tell us
            </Link>
            . We review every correction.
          </p>
        </section>
      </div>
    </>
  )
}
