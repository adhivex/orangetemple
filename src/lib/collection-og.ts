import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og-image'
import { getCollectionPage } from '@/server/queries'

/** Shared social image for collection routes. */
export const collectionOg = {
  size: OG_SIZE,
  contentType: OG_CONTENT_TYPE,
  async render(slug: string) {
    const collection = await getCollectionPage(slug)
    return renderOgImage({
      eyebrow: collection ? `${collection._count.temples} temples` : 'Collection',
      title: collection?.name ?? 'OrangeTemple',
      subtitle: collection?.subtitle,
    })
  },
}
