import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader } from '@/components/content/page-header'
import type { LicenseType } from '@/generated/prisma/enums'
import { templeHref } from '@/lib/routes'
import { getCredits } from '@/server/queries'

export const metadata: Metadata = {
  title: 'Credits',
  description: 'Photography credits, sources and the typefaces and software behind OrangeTemple.',
  alternates: { canonical: '/credits' },
}

const LICENSE: Record<LicenseType, string> = {
  OWNED: 'Owned by OrangeTemple',
  CC0: 'CC0',
  CC_BY: 'CC BY',
  CC_BY_SA: 'CC BY-SA',
  PUBLIC_DOMAIN: 'Public domain',
  LICENSED: 'Used under licence',
  OTHER: 'See source',
}

/** Credits (CONTENT-MODEL.md §7): built from the database, so it is always complete. */
export default async function CreditsPage() {
  const temples = await getCredits()
  const withImages = temples.filter((t) => t.images.length > 0)
  const withReferences = temples.filter((t) => t.references.length > 0)

  return (
    <>
      <PageHeader
        eyebrow="Credits"
        title="Credits"
        lede="Every photograph on OrangeTemple is credited where it appears and listed here, with the sources behind each temple page."
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Credits' }]}
      />
      <div className="container-narrow space-y-14 section-y text-charcoal-700">
        <section aria-labelledby="photography">
          <h2 id="photography" className="text-h2 text-charcoal-900">
            Photography
          </h2>
          {withImages.length === 0 ? (
            <p className="mt-4">No photographs are published on OrangeTemple at present.</p>
          ) : (
            <div className="mt-6 space-y-8">
              {withImages.map((temple) => (
                <div key={temple.slug}>
                  <h3 className="text-h3">
                    <Link
                      href={templeHref(temple.slug)}
                      className="text-charcoal-900 underline decoration-saffron-500 underline-offset-4"
                    >
                      {temple.name}
                    </Link>
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-small">
                    {temple.images.map((image) => (
                      <li key={image.publicId}>
                        {image.altText}. {image.credit} · {LICENSE[image.licenseType]}
                        {image.sourceUrl && (
                          <>
                            {' · '}
                            <a
                              href={image.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-saffron-800 underline underline-offset-4"
                            >
                              Source
                              <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="sources">
          <h2 id="sources" className="text-h2 text-charcoal-900">
            Sources
          </h2>
          {withReferences.length === 0 ? (
            <p className="mt-4">
              Sources are listed on each temple page and here once that page has been reviewed.
            </p>
          ) : (
            <div className="mt-6 space-y-8">
              {withReferences.map((temple) => (
                <div key={temple.slug}>
                  <h3 className="text-h3">
                    <Link
                      href={templeHref(temple.slug)}
                      className="text-charcoal-900 underline decoration-saffron-500 underline-offset-4"
                    >
                      {temple.name}
                    </Link>
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-small">
                    {temple.references.map((ref, i) => (
                      <li key={`${ref.title}-${i}`}>
                        {ref.url ? (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-saffron-800 underline underline-offset-4"
                          >
                            {ref.title}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        ) : (
                          ref.title
                        )}
                        {ref.citation && `. ${ref.citation}`}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="type">
          <h2 id="type" className="text-h2 text-charcoal-900">
            Typefaces and icons
          </h2>
          <ul className="mt-4 space-y-2">
            <li>
              Fraunces, Inter, Noto Serif Devanagari and Noto Sans Devanagari — SIL Open Font
              License.
            </li>
            <li>Lucide icons — ISC License.</li>
          </ul>
        </section>
      </div>
    </>
  )
}
