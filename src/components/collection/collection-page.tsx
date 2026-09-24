import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Markdown } from '@/components/content/markdown'
import { PageHeader } from '@/components/content/page-header'
import { SectionHeader } from '@/components/content/section-header'
import { JsonLd } from '@/components/seo/json-ld'
import { TempleCard } from '@/components/temple/temple-card'
import { collectionHref } from '@/lib/routes'
import { breadcrumbJsonLd, collectionJsonLd, pageMetadata } from '@/lib/seo'
import { getCollectionPage } from '@/server/queries'

import { CollectionCard } from './collection-card'

/**
 * The one collection template (D-008, PRD §8). /jyotirlingas, /char-dham and
 * /collections/[slug] all render this with a slug. Temple cards link only to canonical
 * /temples/[slug] URLs; temple pages are never duplicated here.
 */
export async function CollectionPage({ slug }: { slug: string }) {
  const collection = await getCollectionPage(slug)
  if (!collection) notFound()
  const count = collection.temples.length

  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd({
            name: collection.name,
            description: collection.description,
            path: collectionHref(collection.slug),
            temples: collection.temples.map(({ temple }) => temple),
          }),
          breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: collection.name }]),
        ]}
      />
      <PageHeader
        eyebrow="Collection"
        title={collection.name}
        lede={collection.subtitle}
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: collection.name }]}
      >
        <p className="mt-6 text-small text-stone-600">
          {count} {count === 1 ? 'temple' : 'temples'}
        </p>
      </PageHeader>

      {collection.introduction && (
        <section aria-label="Introduction" className="container-narrow section-y">
          <Markdown
            source={collection.introduction}
            className="text-[1.0625rem] md:text-[1.125rem]"
          />
        </section>
      )}

      <section aria-labelledby="temples-title" className="border-t border-border bg-sand-100/40">
        <div className="container-wide section-y">
          <SectionHeader id="temples-title" title={`The ${collection.name}`} className="mb-10" />
          <ol className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collection.temples.map(({ temple }, index) => (
              <li key={temple.slug}>
                <p aria-hidden="true" className="mb-3 font-display text-h3 text-saffron-800">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <TempleCard temple={temple} aspect="3/2" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {collection.related.length > 0 && (
        <section
          aria-labelledby="related-collections-title"
          className="container-wide section-y render-lazily"
        >
          <SectionHeader
            id="related-collections-title"
            eyebrow="Continue exploring"
            title="Related collections"
            className="mb-10"
          />
          <ul className="grid gap-6 sm:grid-cols-2">
            {collection.related.map(({ relatedCollection }) => (
              <li key={relatedCollection.slug}>
                <CollectionCard collection={relatedCollection} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

/** Shared metadata for every collection route; canonical is always the vanity or /collections URL. */
export async function collectionMetadata(slug: string): Promise<Metadata> {
  const collection = await getCollectionPage(slug)
  if (!collection) return { title: 'Collection not found', robots: { index: false } }
  return pageMetadata({
    title: collection.name,
    description: collection.description,
    path: collectionHref(collection.slug),
    ownImage: true,
  })
}
