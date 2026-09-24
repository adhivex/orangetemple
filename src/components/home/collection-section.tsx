import { Rail } from '@/components/content/rail'
import { SectionHeader } from '@/components/content/section-header'
import { Reveal } from '@/components/motion/reveal'
import { TempleCard } from '@/components/temple/temple-card'
import { collectionHref } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { getCollectionWithTemples } from '@/server/queries'

type CollectionWithTemples = NonNullable<Awaited<ReturnType<typeof getCollectionWithTemples>>>

/**
 * A collection on the homepage (PRD §5.3–4): header with a link to the canonical
 * collection page, then its temples as a swipe rail on mobile and a grid on desktop.
 * Renders nothing if the collection is missing or has no published temples.
 */
export function CollectionSection({
  collection,
  tone = 'default',
}: {
  collection: CollectionWithTemples | null
  tone?: 'default' | 'muted'
}) {
  if (!collection || collection.temples.length === 0) return null
  const id = `collection-${collection.slug}`

  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn('render-lazily', tone === 'muted' && 'bg-sand-100/60')}
    >
      <div className="container-wide section-y">
        <Reveal>
          <SectionHeader
            id={`${id}-title`}
            eyebrow="Collection"
            title={collection.name}
            description={collection.description}
            action={{ href: collectionHref(collection.slug), label: 'View collection' }}
            className="mb-10"
          />
        </Reveal>
        <Rail label={collection.name} columns={4}>
          {collection.temples.map(({ temple }) => (
            <TempleCard key={temple.slug} temple={temple} />
          ))}
        </Rail>
      </div>
    </section>
  )
}
