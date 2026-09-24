'use client'

import type { ImageLoaderProps } from 'next/image'

/*
 * next/image loader (D-012). Cloudinary does the resizing and format negotiation, so
 * images are not optimised twice by Vercel. Cloudinary URLs get f_auto, c_limit, the
 * requested width and q_auto inserted after /upload/. Local files (development
 * placeholders) are served as-is; the width query keeps each srcset entry unique.
 */
const UPLOAD = '/image/upload/'

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith('https://res.cloudinary.com/') && src.includes(UPLOAD)) {
    const [base, rest] = src.split(UPLOAD) as [string, string]
    const transform = ['f_auto', 'c_limit', `w_${width}`, `q_${quality ?? 'auto'}`].join(',')
    return `${base}${UPLOAD}${transform}/${rest}`
  }
  return `${src}${src.includes('?') ? '&' : '?'}w=${width}`
}
