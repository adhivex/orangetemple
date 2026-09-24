import { MapPin } from 'lucide-react'
import type { ReactNode } from 'react'

import { NativeName } from '@/components/content/native-name'
import { TempleImage } from '@/components/media/temple-image'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/navigation/breadcrumbs'
import { cn } from '@/lib/utils'
import type { ImageData } from '@/server/shapes'

type TempleHeroProps = {
  name: string
  nameNative: string | null
  location: string
  /** Deity and collections, e.g. "Shiva · 12 Jyotirlingas". */
  eyebrow: string
  image: ImageData | null | undefined
  breadcrumbs: BreadcrumbItem[]
}

/**
 * Temple hero (DESIGN-SYSTEM.md §6): 4:5 on mobile, 16:9 on desktop. With a licensed
 * photograph, the text sits on a dark scrim that keeps it above 4.5:1 over the
 * brightest image; the photo is the LCP element and is preloaded. Without one (or with
 * a development placeholder) it becomes a typographic hero on sand.
 */
export function TempleHero({
  name,
  nameNative,
  location,
  eyebrow,
  image,
  breadcrumbs,
}: TempleHeroProps) {
  const hasPhoto = Boolean(image && !image.isPlaceholder)

  const text = (tone: 'inverse' | 'default'): ReactNode => (
    <>
      <Breadcrumbs items={breadcrumbs} tone={tone} />
      <p
        className={cn(
          'mt-4 text-label font-medium uppercase',
          tone === 'inverse' ? 'text-saffron-500' : 'text-saffron-800',
        )}
      >
        {eyebrow}
      </p>
      <h1
        className={cn(
          'mt-3 max-w-4xl text-h1',
          tone === 'inverse' ? 'text-ivory-50' : 'text-charcoal-900',
        )}
      >
        {name}
      </h1>
      {nameNative && (
        <NativeName
          variant="serif"
          className={cn(
            'mt-2 block text-h3',
            tone === 'inverse' ? 'text-sand-100' : 'text-charcoal-700',
          )}
        >
          {nameNative}
        </NativeName>
      )}
      <p
        className={cn(
          'mt-4 flex items-center gap-2',
          tone === 'inverse' ? 'text-sand-100' : 'text-charcoal-700',
        )}
      >
        <MapPin className="size-4 shrink-0" aria-hidden="true" />
        {location}
      </p>
    </>
  )

  if (!hasPhoto) {
    return (
      <header className="border-b border-border bg-sand-100/70">
        <div className="container-wide pt-6 pb-12 md:pt-8 md:pb-16">{text('default')}</div>
      </header>
    )
  }

  return (
    <header className="relative isolate">
      <div className="relative aspect-[4/5] max-h-[85svh] w-full overflow-hidden bg-charcoal-900 md:aspect-video md:max-h-[80vh]">
        <TempleImage image={image} sizes="100vw" preload />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-charcoal-900/95 via-charcoal-900/80 via-50% to-charcoal-900/10"
        />
        <div data-surface="dark" className="absolute inset-x-0 bottom-0">
          <div className="container-wide pb-8 md:pb-12">{text('inverse')}</div>
        </div>
        {image?.credit && (
          <p className="absolute top-3 right-3 max-w-[60%] truncate rounded-full bg-charcoal-900/70 px-3 py-1 text-[0.75rem] text-sand-100">
            Photo: {image.credit}
          </p>
        )}
      </div>
    </header>
  )
}
