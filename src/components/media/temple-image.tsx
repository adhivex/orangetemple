import Image from 'next/image'

import { MediaPlaceholder } from '@/components/content/media-placeholder'
import { cn } from '@/lib/utils'
import type { ImageData } from '@/server/shapes'

/**
 * A temple photograph, or the neutral fallback (DESIGN-SYSTEM.md §11) when there is no
 * image or it is a development placeholder. Fills its parent, which sets the aspect
 * ratio, so there is no layout shift. URLs go through the Cloudinary loader (D-012).
 */
export function TempleImage({
  image,
  sizes,
  preload = false,
  className,
}: {
  image: ImageData | null | undefined
  /** Accurate `sizes` for this slot, e.g. "(min-width: 1024px) 33vw, 80vw". */
  sizes: string
  /** Only for the page's single LCP image (Next.js 16 `preload`). */
  preload?: boolean
  className?: string
}) {
  if (!image || image.isPlaceholder) return <MediaPlaceholder className={className} />

  return (
    <Image
      src={image.url}
      alt={image.altText}
      fill
      sizes={sizes}
      preload={preload}
      placeholder={image.blurDataUrl ? 'blur' : 'empty'}
      blurDataURL={image.blurDataUrl ?? undefined}
      className={cn('object-cover', className)}
    />
  )
}
