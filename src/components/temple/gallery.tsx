'use client'

import { Expand } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import type { ImageData } from '@/server/shapes'

const loadLightbox = () => import('./gallery-lightbox')
const GalleryLightbox = dynamic(loadLightbox, { ssr: false })

/**
 * Temple gallery (DESIGN-SYSTEM.md §5): a 3:2 swipe rail on mobile, a grid from md up.
 * Each image opens a lightbox, which is loaded on first hover, focus or tap.
 * Callers pass licensed images only (no placeholders); renders nothing when empty.
 */
export function Gallery({ images, templeName }: { images: ImageData[]; templeName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  if (images.length === 0) return null

  return (
    <>
      <ul
        aria-label={`Photographs of ${templeName}`}
        className="-mx-(--gutter) scrollbar-none flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto px-(--gutter) md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0"
      >
        {images.map((image, index) => (
          <li key={image.url} className="w-[85%] shrink-0 snap-start md:w-auto">
            <figure>
              <button
                type="button"
                onPointerEnter={() => void loadLightbox()}
                onFocus={() => void loadLightbox()}
                onClick={() => {
                  setMounted(true)
                  setOpenIndex(index)
                }}
                className="group relative block aspect-[3/2] w-full overflow-hidden rounded-card bg-sand-100"
                aria-label={`Open photograph ${index + 1} of ${images.length}: ${image.altText}`}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 85vw"
                  placeholder={image.blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={image.blurDataUrl ?? undefined}
                  className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                />
                <span className="absolute right-2 bottom-2 inline-flex size-9 items-center justify-center rounded-full bg-charcoal-900/70 text-ivory-50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand className="size-4" aria-hidden="true" />
                </span>
              </button>
              <figcaption className="mt-2 text-small text-stone-600">
                {image.caption && <span className="text-charcoal-700">{image.caption} · </span>}
                {image.credit}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {mounted && (
        <GalleryLightbox
          images={images}
          index={openIndex}
          onIndexChange={setOpenIndex}
          templeName={templeName}
        />
      )}
    </>
  )
}
