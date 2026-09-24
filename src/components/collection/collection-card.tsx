import Image from 'next/image'

import { EditorialCard } from '@/components/content/editorial-card'
import { MediaPlaceholder } from '@/components/content/media-placeholder'
import { collectionHref } from '@/lib/routes'
import type { CollectionCardData } from '@/server/shapes'

/** Collection card: cover image (or fallback), name, temple count, short description. */
export function CollectionCard({ collection }: { collection: CollectionCardData }) {
  const count = collection._count.temples
  return (
    <EditorialCard
      href={collectionHref(collection.slug)}
      title={collection.name}
      label={`${count} ${count === 1 ? 'temple' : 'temples'}`}
      description={collection.description}
      aspect="3/2"
      media={
        collection.imageUrl ? (
          <Image
            src={collection.imageUrl}
            alt={collection.imageAlt ?? ''}
            fill
            sizes="(min-width: 768px) 50vw, 90vw"
            className="object-cover"
          />
        ) : (
          <MediaPlaceholder />
        )
      }
    />
  )
}
