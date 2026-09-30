import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { cacheLife } from 'next/cache'
import { ImageResponse } from 'next/og'

/*
 * Social preview images (ARCHITECTURE.md §9): 1200×630, typographic and on-brand, with
 * no temple imagery until licensed photography exists. Centred so that WhatsApp's square
 * centre-crop still shows the title. The image renderer cannot read CSS variables, so the
 * colours below mirror the tokens in src/app/globals.css.
 */
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const BG = '#FBF1E5'
const CARD = '#EDE2CF'
const INK = '#2B2118'
const INK_2 = '#5A4332'
const SAFFRON = '#D96B22'
const SAFFRON_INK = '#A34C14'
const GOLD = '#8B5E3C'

/** Cached so the image routes can be prerendered: uncached file reads would make them dynamic. */
async function loadFontData() {
  'use cache'
  cacheLife('max')
  const dir = join(process.cwd(), 'src/assets/fonts')
  // Cormorant Garamond and DM Sans, the site's type pair (D-046), from Fontsource (OFL).
  const [cormorant, dmSans] = await Promise.all([
    readFile(join(dir, 'cormorant-garamond-latin-600-normal.woff')),
    readFile(join(dir, 'dm-sans-latin-500-normal.woff')),
  ])
  // ArrayBuffers: serialisable by the cache and accepted by ImageResponse.
  const toArrayBuffer = (b: Buffer) =>
    b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer
  return { cormorant: toArrayBuffer(cormorant), dmSans: toArrayBuffer(dmSans) }
}

async function loadFonts() {
  const { cormorant, dmSans } = await loadFontData()
  return [
    { name: 'Cormorant Garamond', data: cormorant, weight: 600 as const, style: 'normal' as const },
    { name: 'DM Sans', data: dmSans, weight: 500 as const, style: 'normal' as const },
  ]
}

/** TempleIcon's path; the image renderer cannot use React components from the icon set. */
const TEMPLE_MARK =
  'M20 0l.9 3.2 5.1 1.3-5.3 1.1V8c2.6 1.5 4.2 4.3 4.8 7.2 2.3 1.2 3.5 3.5 3.8 6.1 2.2 1 3.3 3.2 3.5 5.6H36v2.5h-2v12.1h4V44H2v-2.5h4V29.4H4v-2.5h3.2c.2-2.4 1.3-4.6 3.5-5.6.3-2.6 1.5-4.9 3.8-6.1.6-2.9 2.2-5.7 4.8-7.2V3.2L20 0zm-3 30.5v11h6v-11c0-1.7-1.3-3-3-3s-3 1.3-3 3zM9 29.4v12.1h5V29.4H9zm17 0v12.1h5V29.4h-5z'

/** Text stays inside this centred column so WhatsApp's 630px centre-square crop keeps it all. */
const COLUMN = 560

export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string | null
}) {
  const titleSize = title.length > 30 ? 58 : title.length > 18 ? 66 : 80

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: `radial-gradient(120% 90% at 50% 0%, ${BG} 45%, ${CARD} 100%)`,
        fontFamily: 'DM Sans',
      }}
    >
      {/* Brand: mark and wordmark together at the top. */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 56 }}>
        {/* The design's temple mark (src/components/icons TempleIcon). */}
        <svg width="46" height="52" viewBox="0 0 40 44">
          <path fill={SAFFRON} d={TEMPLE_MARK} />
        </svg>
        <div
          style={{
            display: 'flex',
            marginLeft: 14,
            fontFamily: 'Cormorant Garamond',
            fontSize: 34,
            color: INK,
          }}
        >
          <span style={{ color: SAFFRON_INK }}>Orange</span>Temple
        </div>
      </div>

      {/* Message, centred in the remaining space. */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: COLUMN,
          paddingBottom: 40,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 20,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: SAFFRON_INK,
            textAlign: 'center',
          }}
        >
          <div style={{ width: 28, height: 2, background: GOLD, marginRight: 14 }} />
          {eyebrow}
          <div style={{ width: 28, height: 2, background: GOLD, marginLeft: 14 }} />
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: 'Cormorant Garamond',
            fontSize: titleSize,
            lineHeight: 1.08,
            letterSpacing: -1,
            color: INK,
            textAlign: 'center',
            width: COLUMN,
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              marginTop: 20,
              fontSize: 28,
              lineHeight: 1.3,
              color: INK_2,
              textAlign: 'center',
              width: COLUMN,
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ width: '100%', height: 14, background: SAFFRON }} />
    </div>,
    { ...OG_SIZE, fonts: await loadFonts() },
  )
}
