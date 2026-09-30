import type { ReactNode } from 'react'

import { TemplePhotoCard } from '@/components/temple/temple-photo-card'
import { Rail } from '@/components/ui/rail'
import { SectionHeader } from '@/components/ui/section-header'
import { collectionHref } from '@/lib/routes'
import type { CollectionWithTemples } from '@/server/queries'

/** Visible cards per breakpoint (HOMEPAGE_SPEC.md §4–5, MOBILE_WEBAPP.md §6). */
const COLUMNS = {
  portrait:
    '[--rail-col:44%] tablet:[--rail-col:calc((100%_-_2*16px)/3.3)] tablet-lg:[--rail-col:calc((100%_-_3*20px)/4.3)] desktop:[--rail-col:calc((100%_-_4*20px)/5)]',
  landscape:
    '[--rail-col:62%] tablet:[--rail-col:calc((100%_-_16px)/2.4)] tablet-lg:[--rail-col:calc((100%_-_3*20px)/4)]',
}

/**
 * A collection as a homepage rail (HOMEPAGE_SPEC.md §4 Jyotirlingas, §5 Char Dham):
 * section head with emblem and "Explore All" link, then the collection's published
 * temples in collection order, from the database.
 */
export function TempleRailSection({
  collection,
  anchor,
  icon,
  title,
  subtitle,
  moreLabel,
  moreLabelMobile,
  chip,
  aspect,
}: {
  collection: CollectionWithTemples
  /** The section's id, used by in-page links (#jyotirlingas, #char-dham). */
  anchor: string
  icon: ReactNode
  title: string
  subtitle: string
  moreLabel: string
  moreLabelMobile: string
  chip: string
  aspect: 'portrait' | 'landscape'
}) {
  const titleId = `${anchor}-title`
  return (
    <section
      id={anchor}
      aria-labelledby={titleId}
      className="bg-surface pt-14 pb-1.5 tablet:pt-20 tablet:pb-5 desktop:pt-24 [&+&]:pt-10 tablet:[&+&]:pt-14 desktop:[&+&]:pt-[72px]"
    >
      <div className="container-site">
        <SectionHeader
          id={titleId}
          icon={icon}
          title={title}
          subtitle={subtitle}
          moreHref={collectionHref(collection.slug)}
          moreLabel={moreLabel}
          moreLabelMobile={moreLabelMobile}
        />
        <Rail label={title} columnsClassName={COLUMNS[aspect]}>
          {collection.temples.map(({ temple }) => (
            <li key={temple.slug} className="snap-start">
              <TemplePhotoCard temple={temple} aspect={aspect} chipLabel={chip} />
            </li>
          ))}
        </Rail>
      </div>
    </section>
  )
}
