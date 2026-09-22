/*
 * Generates PWA and favicon rasters from the logomark (ARCHITECTURE.md §11,
 * DESIGN-SYSTEM.md §13). Run with `pnpm icons` after changing the mark; the
 * output is committed. Hex values mirror the tokens in src/app/globals.css.
 */
import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const SAFFRON_700 = '#BF510C'
const SAFFRON_500 = '#F28C28'
const IVORY_50 = '#FBF6EC'

/** The mark drawn in ivory with a saffron-500 doorway, for use on a saffron-700 field. */
const mark = `
  <path d="M7.5 27.5V15.2C7.5 10.3 11.4 7.4 16 3.5C20.6 7.4 24.5 10.3 24.5 15.2V27.5"
        fill="none" stroke="${IVORY_50}" stroke-width="2.25" stroke-linejoin="round"/>
  <path d="M12.25 27.5V19.4C12.25 17 13.9 15.5 16 13.9C18.1 15.5 19.75 17 19.75 19.4V27.5Z" fill="${SAFFRON_500}"/>
  <path d="M4.5 27.5H27.5" stroke="${IVORY_50}" stroke-width="2.25" stroke-linecap="round"/>`

/**
 * @param {number} size    output px
 * @param {number} scale   fraction of the canvas the mark occupies
 * @param {number} radius  corner radius as a fraction of size (0 = full bleed)
 */
function svg(size, scale, radius) {
  const inner = size * scale
  const offset = (size - inner) / 2
  const r = size * radius
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${r}" fill="${SAFFRON_700}"/>
    <g transform="translate(${offset} ${offset - inner * 0.02}) scale(${inner / 32})">${mark}</g>
  </svg>`
}

const outputs = [
  // purpose "any": rounded tile, mark fills most of it
  ['public/icons/icon-192.png', svg(192, 0.72, 0.22)],
  ['public/icons/icon-512.png', svg(512, 0.72, 0.22)],
  // purpose "maskable": full bleed, mark inside the 80% safe zone
  ['public/icons/icon-maskable-512.png', svg(512, 0.52, 0)],
  // iOS applies its own mask; keep it full bleed
  ['src/app/apple-icon.png', svg(180, 0.66, 0)],
]

for (const [path, source] of outputs) {
  await sharp(Buffer.from(source)).png({ compressionLevel: 9 }).toFile(path)
  console.log('wrote', path)
}

// Vector favicon (Next.js `app/icon.svg` convention).
await writeFile('src/app/icon.svg', svg(32, 0.86, 0.22).replace(/\n\s*/g, ' '))
console.log('wrote src/app/icon.svg')
