import { describe, expect, it } from 'vitest'

import {
  CONSENT_COOKIE,
  CONSENT_VERSION,
  consentCookie,
  createConsent,
  readConsent,
} from '@/lib/consent'

const now = new Date('2026-09-30T10:00:00.000Z')

/** The name=value part of a Set-Cookie style string, as document.cookie would return it. */
const asDocumentCookie = (cookie: string) => cookie.split(';')[0]!

describe('cookie consent record (D-051)', () => {
  it('round-trips a choice through the cookie', () => {
    const consent = createConsent({ analytics: true, marketing: false }, now)
    const header = `theme=x; ${asDocumentCookie(consentCookie(consent, true))}; other=1`
    expect(readConsent(header)).toEqual({
      v: CONSENT_VERSION,
      essential: true,
      analytics: true,
      marketing: false,
      ts: '2026-09-30T10:00:00.000Z',
    })
  })

  it('treats a missing, malformed or outdated cookie as no choice', () => {
    expect(readConsent('')).toBeNull()
    expect(readConsent(`${CONSENT_COOKIE}=not-json`)).toBeNull()
    const outdated = encodeURIComponent(
      JSON.stringify({ v: CONSENT_VERSION + 1, analytics: true, marketing: true, ts: 'x' }),
    )
    expect(readConsent(`${CONSENT_COOKIE}=${outdated}`)).toBeNull()
    const wrongType = encodeURIComponent(
      JSON.stringify({ v: CONSENT_VERSION, analytics: 'yes', marketing: false, ts: 'x' }),
    )
    expect(readConsent(`${CONSENT_COOKIE}=${wrongType}`)).toBeNull()
  })

  it('keeps essential cookies on whatever the cookie says', () => {
    const tampered = encodeURIComponent(
      JSON.stringify({
        v: CONSENT_VERSION,
        essential: false,
        analytics: false,
        marketing: false,
        ts: 'x',
      }),
    )
    expect(readConsent(`${CONSENT_COOKIE}=${tampered}`)?.essential).toBe(true)
  })

  it('writes a first-party, year-long, Lax cookie that is Secure over HTTPS', () => {
    const consent = createConsent({ analytics: false, marketing: false }, now)
    const secure = consentCookie(consent, true)
    expect(secure).toMatch(/; Max-Age=31536000; Path=\/; SameSite=Lax; Secure$/)
    expect(consentCookie(consent, false)).not.toContain('Secure')
  })
})
