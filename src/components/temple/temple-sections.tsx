import { ExternalLink, MapPin, Navigation } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Markdown } from '@/components/content/markdown'
import { env } from '@/env'
import { templeHref } from '@/lib/routes'
import { formatMonthYear } from '@/lib/visit-info'
import type { TempleDetail } from '@/server/shapes'

/** A titled section of the temple page. Callers render it only when it has content. */
export function TempleSection({
  id,
  title,
  note,
  children,
}: {
  id: string
  title: string
  /** Short line under the title, e.g. the traditional-belief label. */
  note?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <h2 id={`${id}-title`} className="text-h2 text-charcoal-900">
        {title}
      </h2>
      {note && <p className="mt-2 text-small text-stone-600">{note}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

export function RitualsList({ rituals }: { rituals: TempleDetail['rituals'] }) {
  return (
    <ul className="space-y-5">
      {rituals.map((ritual) => (
        <li key={ritual.name} className="border-l-2 border-gold-500 pl-4">
          <h3 className="text-h3 text-charcoal-900">{ritual.name}</h3>
          {ritual.description && <Markdown source={ritual.description} className="mt-1" />}
        </li>
      ))}
    </ul>
  )
}

/** Festivals: recurrence is described in words — dates follow the lunar calendar. */
export function FestivalsList({ festivals }: { festivals: TempleDetail['festivals'] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {festivals.map(({ festival, description }) => (
        <li key={festival.slug} className="rounded-card border border-border p-5">
          <h3 className="text-h3 text-charcoal-900">{festival.name}</h3>
          {festival.recurrenceNote && (
            <p className="mt-1 text-small text-stone-600">{festival.recurrenceNote}</p>
          )}
          {description && <Markdown source={description} className="mt-3" />}
        </li>
      ))}
    </ul>
  )
}

const NEARBY_TYPE: Record<TempleDetail['nearbyPlaces'][number]['type'], string> = {
  TEMPLE: 'Temple',
  SHRINE: 'Shrine',
  GHAT: 'Ghat',
  NATURAL: 'Natural site',
  HERITAGE: 'Heritage site',
  OTHER: 'Place',
}

/** Nearby sacred places; links internally when the related temple is published. */
export function NearbyPlaces({ places }: { places: TempleDetail['nearbyPlaces'] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {places.map((place) => {
        const internal =
          place.relatedTemple?.status === 'PUBLISHED' ? templeHref(place.relatedTemple.slug) : null
        return (
          <li key={place.name} className="py-4">
            <p className="text-label font-medium text-stone-600 uppercase">
              {NEARBY_TYPE[place.type]}
            </p>
            <h3 className="mt-1 text-h3 text-charcoal-900">
              {internal ? (
                <Link
                  href={internal}
                  className="underline decoration-saffron-500 underline-offset-4"
                >
                  {place.name}
                </Link>
              ) : place.url ? (
                <a
                  href={place.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-saffron-500 underline-offset-4"
                >
                  {place.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                place.name
              )}
            </h3>
            {place.description && <Markdown source={place.description} className="mt-1" />}
          </li>
        )
      })}
    </ul>
  )
}

const SOURCE_TYPE: Record<TempleDetail['references'][number]['sourceType'], string> = {
  OFFICIAL_TEMPLE: 'Official temple source',
  GOVERNMENT: 'Government source',
  ACADEMIC: 'Academic source',
  TRADITIONAL_TEXT: 'Traditional text',
  NEWS: 'News',
  OTHER: 'Source',
}

export function ReferencesList({ references }: { references: TempleDetail['references'] }) {
  return (
    <ol className="list-decimal space-y-3 pl-5 text-small text-charcoal-700 marker:text-stone-600">
      {references.map((ref, index) => (
        <li key={`${ref.title}-${index}`}>
          {ref.url ? (
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-saffron-800 underline underline-offset-4"
            >
              {ref.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <span className="font-medium text-charcoal-900">{ref.title}</span>
          )}
          {ref.citation && <span>. {ref.citation}</span>}
          <span className="text-stone-600">
            {' '}
            · {SOURCE_TYPE[ref.sourceType]}
            {ref.accessedAt && `, accessed ${formatMonthYear(ref.accessedAt)}`}
          </span>
        </li>
      ))}
    </ol>
  )
}

/** Mapbox pin colour: --saffron-700. The Static Images API needs a literal hex. */
const MAP_PIN = 'bf510c'

/**
 * Location card (D-013): a Mapbox static map when a public token is configured, and an
 * "Open in Maps" link. Rendered only with verified coordinates; otherwise the page
 * shows the address and location text alone (CONTENT-MODEL.md §3).
 */
export function LocationCard({
  name,
  latitude,
  longitude,
  coordinatesSource,
  location,
}: {
  name: string
  latitude: number | null
  longitude: number | null
  coordinatesSource: string | null
  location: string
}) {
  if (latitude === null || longitude === null) return null
  const token = env.NEXT_PUBLIC_MAPBOX_TOKEN
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
  const staticMap = token
    ? `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+${MAP_PIN}(${longitude},${latitude})/${longitude},${latitude},13,0/640x360@2x?access_token=${token}&attribution=true&logo=true`
    : null

  return (
    <div className="overflow-hidden rounded-card border border-border">
      {staticMap && (
        // A static map image; Mapbox serves the right size, so next/image adds nothing here.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={staticMap}
          alt={`Map showing the location of ${name}`}
          width={640}
          height={360}
          loading="lazy"
          className="aspect-video w-full bg-sand-100 object-cover"
        />
      )}
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-charcoal-700">
          <MapPin className="mt-1 size-4 shrink-0 text-saffron-800" aria-hidden="true" />
          <span>
            {location}
            {coordinatesSource && (
              <span className="block text-small text-stone-600">
                Coordinates: {coordinatesSource}
              </span>
            )}
          </span>
        </p>
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 font-medium text-saffron-800 underline underline-offset-4"
        >
          <Navigation className="size-4" aria-hidden="true" />
          Open in Maps
          <ExternalLink className="size-3.5" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  )
}
