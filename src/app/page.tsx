import { notFound } from 'next/navigation'

import { Browse } from '@/components/home/browse'
import { ExploreMap } from '@/components/home/explore-map'
import { Hero } from '@/components/home/hero'
import { QuoteBand } from '@/components/home/quote-band'
import { StatsPanel } from '@/components/home/stats-panel'
import { Stories } from '@/components/home/stories'
import { TempleRailSection } from '@/components/home/temple-rail-section'
import { OmIcon, TrishulIcon } from '@/components/icons'
import { JsonLd } from '@/components/seo/json-ld'
import { homeCopy } from '@/content/home'
import { organizationJsonLd, pageMetadata, websiteJsonLd } from '@/lib/seo'
import { getCollectionWithTemples, getDeityTiles, getRegionTiles } from '@/server/queries'

export const metadata = pageMetadata({
  title: homeCopy.meta.title,
  absoluteTitle: true,
  ownImage: true,
  description: homeCopy.hero.lead,
  path: '/',
})

/**
 * Homepage (docs/design/HOMEPAGE_SPEC.md). Temples, deities and regions come from the
 * database; every read is cached and tagged, so the page is prerendered at build and
 * refreshed on demand after seeding (D-015). Copy lives in src/content/home.ts.
 */
export default async function HomePage() {
  const [jyotirlingas, charDham, deities, regions] = await Promise.all([
    getCollectionWithTemples('jyotirlingas'),
    getCollectionWithTemples('char-dham'),
    getDeityTiles(),
    getRegionTiles(),
  ])
  // Both launch collections are required content; a missing one is a data error.
  if (!jyotirlingas || !charDham) notFound()

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <Hero />
      <StatsPanel />
      <TempleRailSection
        collection={jyotirlingas}
        anchor="jyotirlingas"
        icon={<TrishulIcon />}
        aspect="portrait"
        {...homeCopy.jyotirlingas}
      />
      <TempleRailSection
        collection={charDham}
        anchor="char-dham"
        icon={<OmIcon />}
        aspect="landscape"
        {...homeCopy.charDham}
      />
      <Browse deities={deities} regions={regions} />
      <ExploreMap />
      <Stories />
      <QuoteBand />
    </>
  )
}
