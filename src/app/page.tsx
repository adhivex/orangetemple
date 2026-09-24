import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { CollectionSection } from '@/components/home/collection-section'
import { ExploreTiles } from '@/components/home/explore-tiles'
import { HomeHero } from '@/components/home/home-hero'
import { SacredBharat } from '@/components/home/sacred-bharat'
import { directoryHref } from '@/lib/routes'
import {
  getCatalogueStats,
  getCollectionWithTemples,
  getDeityTiles,
  getRegionTiles,
} from '@/server/queries'

/**
 * Homepage (PRD §5), fully database-driven. Every read is cached and tagged, so the
 * page is prerendered at build and refreshed on demand after seeding (D-015).
 */
export default async function HomePage() {
  const [stats, jyotirlingas, charDham, deityTiles, regionTiles] = await Promise.all([
    getCatalogueStats(),
    getCollectionWithTemples('jyotirlingas'),
    getCollectionWithTemples('char-dham'),
    getDeityTiles(),
    getRegionTiles(),
  ])

  return (
    <>
      <HomeHero stats={stats} />

      <section aria-labelledby="intro-title" className="container-narrow section-y">
        <h2 id="intro-title" className="text-h2 text-charcoal-900">
          A careful guide to sacred places
        </h2>
        <div className="mt-5 space-y-4 text-charcoal-700">
          <p>
            OrangeTemple brings together the significance, history and traditions of the temples of
            Bharat, with practical guidance for visiting them.
          </p>
          <p>
            We keep documented history and traditional belief clearly apart, credit every
            photograph, and mark visit details with the date they were last checked, so you know
            what to confirm before you travel.
          </p>
        </div>
        <Link
          href="/about"
          className="group mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-saffron-800"
        >
          About OrangeTemple
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </section>

      <CollectionSection collection={jyotirlingas} tone="muted" />
      <CollectionSection collection={charDham} />

      <div className="bg-sand-100/60">
        <ExploreTiles
          id="deity"
          eyebrow="Explore by deity"
          title="Temples by presiding deity"
          tiles={deityTiles}
          hrefFor={(slug) => directoryHref({ deity: slug })}
        />
      </div>
      <ExploreTiles
        id="region"
        eyebrow="Explore by region"
        title="Temples across Bharat"
        tiles={regionTiles}
        hrefFor={(slug) => directoryHref({ region: slug })}
      />

      <SacredBharat />
    </>
  )
}
