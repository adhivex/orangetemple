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

const IVORY_50 = '#FBF6EC'
const SAND_100 = '#EFE6D6'
const CHARCOAL_900 = '#1F1B16'
const CHARCOAL_700 = '#3A342D'
const SAFFRON_500 = '#F28C28'
const SAFFRON_700 = '#BF510C'
const SAFFRON_800 = '#A63F08'
const GOLD_500 = '#B08D3C'

/** Cached so the image routes can be prerendered: uncached file reads would make them dynamic. */
async function loadFontData() {
  'use cache'
  cacheLife('max')
  const dir = join(process.cwd(), 'src/assets/fonts')
  const [fraunces, inter] = await Promise.all([
    readFile(join(dir, 'fraunces-latin-600-normal.woff')),
    readFile(join(dir, 'inter-latin-500-normal.woff')),
  ])
  // ArrayBuffers: serialisable by the cache and accepted by ImageResponse.
  const toArrayBuffer = (b: Buffer) =>
    b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer
  return { fraunces: toArrayBuffer(fraunces), inter: toArrayBuffer(inter) }
}

async function loadFonts() {
  const { fraunces, inter } = await loadFontData()
  return [
    { name: 'Fraunces', data: fraunces, weight: 600 as const, style: 'normal' as const },
    { name: 'Inter', data: inter, weight: 500 as const, style: 'normal' as const },
  ]
}

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
        background: `radial-gradient(120% 90% at 50% 0%, ${IVORY_50} 45%, ${SAND_100} 100%)`,
        fontFamily: 'Inter',
      }}
    >
      {/* Brand: mark and wordmark together at the top. */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 56 }}>
        <svg width="52" height="52" viewBox="0 0 32 32">
          <path
            d="M7.5 27.5V15.2C7.5 10.3 11.4 7.4 16 3.5C20.6 7.4 24.5 10.3 24.5 15.2V27.5"
            fill="none"
            stroke={SAFFRON_700}
            strokeWidth="2.25"
            strokeLinejoin="round"
          />
          <path
            d="M12.25 27.5V19.4C12.25 17 13.9 15.5 16 13.9C18.1 15.5 19.75 17 19.75 19.4V27.5Z"
            fill={SAFFRON_500}
          />
          <path d="M4.5 27.5H27.5" stroke={SAFFRON_700} strokeWidth="2.25" strokeLinecap="round" />
        </svg>
        <div
          style={{
            display: 'flex',
            marginLeft: 14,
            fontFamily: 'Fraunces',
            fontSize: 34,
            color: CHARCOAL_900,
          }}
        >
          Orange<span style={{ color: SAFFRON_800 }}>Temple</span>
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
            color: SAFFRON_800,
            textAlign: 'center',
          }}
        >
          <div style={{ width: 28, height: 2, background: GOLD_500, marginRight: 14 }} />
          {eyebrow}
          <div style={{ width: 28, height: 2, background: GOLD_500, marginLeft: 14 }} />
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: 'Fraunces',
            fontSize: titleSize,
            lineHeight: 1.08,
            letterSpacing: -1,
            color: CHARCOAL_900,
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
              color: CHARCOAL_700,
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
      <div style={{ width: '100%', height: 14, background: SAFFRON_500 }} />
    </div>,
    { ...OG_SIZE, fonts: await loadFonts() },
  )
}
