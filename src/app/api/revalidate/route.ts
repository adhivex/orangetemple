import { timingSafeEqual } from 'node:crypto'

import { revalidateTag } from 'next/cache'

import { CONTENT_TAG } from '@/server/queries'

/*
 * On-demand revalidation (D-015, ARCHITECTURE.md §2). Called after `pnpm db:seed`
 * (see `pnpm revalidate`). Protected by REVALIDATE_SECRET, sent as a Bearer token;
 * disabled when the secret is not configured. Never linked; never indexed.
 */
const headers = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' }

function authorized(request: Request, secret: string) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const a = Buffer.from(token)
  const b = Buffer.from(secret)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || secret.length < 16) {
    return Response.json({ error: 'Revalidation is not configured.' }, { status: 503, headers })
  }
  if (!authorized(request, secret)) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401, headers })
  }
  revalidateTag(CONTENT_TAG, 'max')
  return Response.json({ revalidated: [CONTENT_TAG] }, { headers })
}
