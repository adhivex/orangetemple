import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'

import { Markdown } from '@/components/content/markdown'
import { ActionBar } from '@/components/layout/action-bar'
import { JsonLd } from '@/components/seo/json-ld'
import { Gallery } from '@/components/temple/gallery'
import { QuickFacts } from '@/components/temple/quick-facts'
import { RelatedTemples } from '@/components/temple/related-temples'
import { TempleHero } from '@/components/temple/temple-hero'
import {
  FestivalsList,
  LocationCard,
  NearbyPlaces,
  ReferencesList,
  RitualsList,
  TempleSection,
} from '@/components/temple/temple-sections'
import { VisitInformation } from '@/components/temple/visit-information'
import { templeHref } from '@/lib/routes'
import { breadcrumbJsonLd, pageMetadata, templeJsonLd } from '@/lib/seo'
import { shouldShowVisitDetails } from '@/lib/visit-info'
import {
  getPublishedTempleSlugs,
  getRedirectSlug,
  getRelatedTemples,
  getTempleBySlug,
  getToday,
} from '@/server/temple'

type Params = Promise<{ slug: string }>

/** Every published temple is prerendered; the one template renders them all (PRD §7). */
export async function generateStaticParams() {
  const slugs = await getPublishedTempleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const temple = await getTempleBySlug(slug)
  if (!temple) return { title: 'Temple not found', robots: { index: false } }
  return pageMetadata({
    title: temple.metaTitle ?? temple.name,
    description: temple.metaDescription ?? temple.shortDescription,
    path: templeHref(temple.slug),
    ownImage: true,
  })
}

export default async function TemplePage({ params }: { params: Params }) {
  const { slug } = await params
  const temple = await getTempleBySlug(slug)

  // Resolved before anything streams, so these are real 308 / 404 responses (ROUTES.md §4.5).
  if (!temple) {
    const current = await getRedirectSlug(slug)
    if (current) permanentRedirect(templeHref(current))
    notFound()
  }

  const [related, today] = await Promise.all([getRelatedTemples(temple.slug), getToday()])
  const hero = temple.images.find((image) => image.imageType === 'HERO')
  const gallery = temple.images.filter((i) => i.imageType === 'GALLERY' && !i.isPlaceholder)
  const collections = temple.collections.map((c) => c.collection.name)
  const location = `${temple.city}, ${temple.state.name}`
  const verifiedVisit = shouldShowVisitDetails(temple.visitInfo, today) ? temple.visitInfo : null

  return (
    <>
      <JsonLd
        data={[
          templeJsonLd({
            ...temple,
            heroImageUrl: hero && !hero.isPlaceholder ? hero.url : null,
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Temples', path: '/temples' },
            { name: temple.name },
          ]),
        ]}
      />
      <TempleHero
        name={temple.name}
        nameNative={temple.nameNative}
        location={location}
        eyebrow={[temple.deity.name, ...collections].join(' · ')}
        image={hero}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Temples', href: '/temples' },
          { name: temple.name },
        ]}
      />

      <div className="container-wide section-y lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-16">
        <aside aria-label="Quick facts" className="mb-14 lg:sticky lg:top-24 lg:order-2 lg:mb-0">
          <QuickFacts temple={temple} verifiedVisit={verifiedVisit} className="lg:grid-cols-1" />
          {address(temple.address)}
          <div className="mt-6 hidden md:block">
            <ActionBar
              placement="inline"
              title={temple.name}
              latitude={temple.latitude}
              longitude={temple.longitude}
            />
          </div>
        </aside>

        <div className="space-y-16 lg:order-1">
          <TempleSection id="about" title={`About ${temple.name}`}>
            <Markdown source={temple.overview} />
            {temple.locationNote && (
              <div className="mt-6 max-w-[65ch] rounded-card border-l-2 border-gold-500 bg-sand-100/60 p-5">
                <p className="text-label font-medium text-stone-600 uppercase">About the site</p>
                <Markdown source={temple.locationNote} className="mt-2" />
              </div>
            )}
          </TempleSection>

          <TempleSection id="significance" title="Spiritual significance">
            <Markdown source={temple.significance} />
          </TempleSection>

          {temple.history && (
            <TempleSection id="history" title="History">
              <Markdown source={temple.history} />
            </TempleSection>
          )}

          {temple.legend && (
            <TempleSection
              id="legends"
              title="Traditional legends"
              note="Traditional belief, shared as it is told — not documented history."
            >
              <Markdown source={temple.legend} />
            </TempleSection>
          )}

          {temple.architecture && (
            <TempleSection id="architecture" title="Architecture">
              <Markdown source={temple.architecture} />
            </TempleSection>
          )}

          {temple.rituals.length > 0 && (
            <TempleSection id="rituals" title="Rituals">
              <RitualsList rituals={temple.rituals} />
            </TempleSection>
          )}

          {temple.festivals.length > 0 && (
            <TempleSection id="festivals" title="Festivals">
              <FestivalsList festivals={temple.festivals} />
            </TempleSection>
          )}

          <TempleSection id="visit" title="Plan your visit">
            <VisitInformation
              visitInfo={temple.visitInfo}
              officialWebsite={temple.officialWebsite}
              now={today}
            />
            <div className="mt-8 empty:hidden">
              <LocationCard
                name={temple.name}
                latitude={temple.latitude}
                longitude={temple.longitude}
                coordinatesSource={temple.coordinatesSource}
                location={location}
              />
            </div>
          </TempleSection>

          {gallery.length > 0 && (
            <TempleSection id="gallery" title="Gallery">
              <Gallery images={gallery} templeName={temple.name} />
            </TempleSection>
          )}

          {temple.nearbyPlaces.length > 0 && (
            <TempleSection id="nearby" title="Nearby sacred places">
              <NearbyPlaces places={temple.nearbyPlaces} />
            </TempleSection>
          )}

          {temple.references.length > 0 && (
            <TempleSection id="references" title="References">
              <ReferencesList references={temple.references} />
            </TempleSection>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-border bg-sand-100/60">
          <div className="container-wide section-y">
            <RelatedTemples temples={related} />
          </div>
        </div>
      )}

      <ActionBar title={temple.name} latitude={temple.latitude} longitude={temple.longitude} />
    </>
  )
}

function address(value: string | null) {
  if (!value) return null
  return (
    <p className="mt-5 border-t border-border pt-3 text-small text-charcoal-700">
      <span className="block text-label font-medium text-stone-600 uppercase">Address</span>
      <span className="mt-1.5 block">{value}</span>
    </p>
  )
}
