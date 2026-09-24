import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og-image'
import { getPublishedTempleSlugs, getTempleBySlug } from '@/server/temple'

/** Per-temple social image: name, location and collections, from the record. */
export const alt = 'Temple page on OrangeTemple'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export async function generateStaticParams() {
  return (await getPublishedTempleSlugs()).map((slug) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const temple = await getTempleBySlug((await params).slug)
  if (!temple) {
    return renderOgImage({ eyebrow: 'OrangeTemple', title: 'Sacred temples of Bharat' })
  }
  const collections = temple.collections.map((c) => c.collection.name)
  return renderOgImage({
    eyebrow: collections.length > 0 ? collections.join(' · ') : temple.deity.name,
    title: temple.name,
    subtitle: `${temple.city}, ${temple.state.name}`,
  })
}
