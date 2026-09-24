import { EditorialCard } from '@/components/content/editorial-card'
import { NativeName } from '@/components/content/native-name'
import { TempleImage } from '@/components/media/temple-image'
import { templeHref } from '@/lib/routes'
import type { TempleCardData } from '@/server/shapes'

/** Card sizes: ~78vw in the mobile rail, a third or quarter of the container on desktop. */
const CARD_SIZES = '(min-width: 1280px) 22rem, (min-width: 768px) 33vw, 78vw'

/**
 * Temple card (DESIGN-SYSTEM.md §7). Links to the canonical temple URL only (ROUTES.md).
 * Label: the temple's collections, falling back to its deity.
 */
export function TempleCard({
  temple,
  aspect = 'responsive',
}: {
  temple: TempleCardData
  aspect?: 'responsive' | '4/5' | '3/2'
}) {
  const collections = temple.collections.map((c) => c.collection.name)
  return (
    <EditorialCard
      href={templeHref(temple.slug)}
      title={temple.name}
      label={collections.length > 0 ? collections.join(' · ') : temple.deity.name}
      location={`${temple.city}, ${temple.state.name}`}
      description={temple.shortDescription}
      aspect={aspect}
      media={<TempleImage image={temple.images[0]} sizes={CARD_SIZES} />}
    >
      {temple.nameNative && (
        <NativeName className="mt-0.5 text-small text-stone-600">{temple.nameNative}</NativeName>
      )}
    </EditorialCard>
  )
}
