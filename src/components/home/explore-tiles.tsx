import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { SectionHeader } from '@/components/content/section-header'
import { Reveal } from '@/components/motion/reveal'
import { visibleTiles } from '@/lib/tiles'
import type { Tile } from '@/server/queries'

/**
 * "Explore by deity" / "Explore by region" (PRD §5.5–6). Each tile links to the
 * filtered directory. Empty tiles are hidden, and the whole section is hidden when
 * fewer than three remain (D-007).
 */
export function ExploreTiles({
  id,
  eyebrow,
  title,
  tiles,
  hrefFor,
}: {
  id: string
  eyebrow: string
  title: string
  tiles: Tile[]
  hrefFor: (slug: string) => string
}) {
  const shown = visibleTiles(tiles)
  if (shown.length === 0) return null

  return (
    <section aria-labelledby={`${id}-title`} className="container-wide section-y render-lazily">
      <Reveal>
        <SectionHeader id={`${id}-title`} eyebrow={eyebrow} title={title} className="mb-10" />
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
          {shown.map((tile) => (
            <li key={tile.slug}>
              <Link
                href={hrefFor(tile.slug)}
                className="group flex h-full min-h-28 flex-col justify-between rounded-card border border-border bg-sand-100/70 p-4 transition-colors hover:border-gold-500 hover:bg-sand-100 sm:p-5"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="font-display text-h3 text-charcoal-900">{tile.name}</span>
                  <ArrowUpRight
                    className="mt-1 size-5 shrink-0 text-saffron-800 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-4 text-small text-stone-600">
                  {tile.count} {tile.count === 1 ? 'temple' : 'temples'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
