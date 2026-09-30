import Link from 'next/link'

import { TempleImage } from '@/components/media/temple-image'
import { templeHref } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { TempleCardData } from '@/server/shapes'

import { TemplePlaceholder } from './temple-placeholder'

/** Rail widths (ASSETS.md): ~44–62vw on phones, a third on tablets, 230–280px on desktop. */
const SIZES = {
  portrait: '(max-width: 640px) 44vw, (max-width: 980px) 30vw, 230px',
  landscape: '(max-width: 640px) 62vw, (max-width: 980px) 42vw, 280px',
}

/**
 * Photo card for the homepage rails (DESIGN_SYSTEM.md "Image card"): the photo fills the
 * card (4:5 portrait for Jyotirlingas, 5:4 landscape for Char Dham), with a dark scrim, a
 * serif short name and an uppercase state label. The glass chip shows on phones only.
 * Without a licensed photo it shows the placeholder face. Hover zoom only on devices that
 * hover; a press scales the card slightly instead.
 */
export function TemplePhotoCard({
  temple,
  aspect,
  chipLabel,
}: {
  temple: TempleCardData
  aspect: 'portrait' | 'landscape'
  chipLabel?: string
}) {
  const image = temple.images[0]
  const hasPhoto = Boolean(image && !image.isPlaceholder)

  return (
    <Link
      href={templeHref(temple.slug)}
      className="group relative isolate block snap-start overflow-hidden rounded-[14px] bg-night shadow-soft transition-transform duration-200 ease-temple select-none [-webkit-touch-callout:none] focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-saffron-glow active:scale-[0.975] tablet:rounded-card"
    >
      <div
        className={cn(
          'relative w-full transition-transform duration-[1100ms] ease-temple group-hover:scale-[1.06]',
          aspect === 'portrait' ? 'aspect-[4/5]' : 'aspect-[5/4]',
        )}
      >
        {hasPhoto ? <TempleImage image={image} sizes={SIZES[aspect]} /> : <TemplePlaceholder />}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-card-scrim"
      />
      {chipLabel && (
        <span
          aria-hidden="true"
          className="absolute top-3.5 left-3.5 z-[2] rounded-button border border-white/30 bg-white/16 px-2.5 py-1 text-[11px] tracking-[0.6px] text-white backdrop-blur-[8px] tablet:hidden"
        >
          {chipLabel}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 z-[2] p-[18px] text-white">
        <h3 className="font-serif text-[21px] leading-[1.05] font-semibold [overflow-wrap:anywhere] tablet:text-[clamp(20px,2.3vw,24px)] desktop:text-[25px]">
          {temple.shortName}
        </h3>
        <p className="mt-1.5 text-[10px] tracking-[1.5px] text-gold-soft uppercase tablet:text-[11px] tablet:tracking-[2px]">
          {temple.state.name}
        </p>
      </div>
    </Link>
  )
}
