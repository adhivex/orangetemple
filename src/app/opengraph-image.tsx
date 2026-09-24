import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og-image'
import { siteConfig } from '@/lib/site-config'

/** Default social image for every page without its own. */
export const alt = `${siteConfig.name}: ${siteConfig.tagline}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: 'Sacred temples of Bharat',
    title: 'Discover the sacred temples of Bharat',
    subtitle: 'Significance, history, traditions and how to visit',
  })
}
