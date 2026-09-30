/*
 * Cookie consent record (HOMEPAGE_SPEC.md "Cookie consent", D-051). Stored in a
 * first-party cookie so the server could read it too:
 *   ot_consent = {"v":1,"essential":true,"analytics":…,"marketing":…,"ts":"…"}
 * Raising CONSENT_VERSION (for a new policy) makes every stored choice invalid, so the
 * banner shows again.
 */

export const CONSENT_COOKIE = 'ot_consent'
export const CONSENT_VERSION = 1
const MAX_AGE_SECONDS = 365 * 24 * 60 * 60

export type ConsentCategory = 'analytics' | 'marketing'

export type Consent = {
  v: number
  essential: true
  analytics: boolean
  marketing: boolean
  ts: string
}

export function createConsent(
  choice: Record<ConsentCategory, boolean>,
  now: Date = new Date(),
): Consent {
  return {
    v: CONSENT_VERSION,
    essential: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    ts: now.toISOString(),
  }
}

/** The stored choice from a `document.cookie` string, or null if absent, invalid or outdated. */
export function readConsent(cookieHeader: string): Consent | null {
  const raw = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1)
  if (!raw) return null
  try {
    const value: unknown = JSON.parse(decodeURIComponent(raw))
    if (
      typeof value === 'object' &&
      value !== null &&
      'v' in value &&
      value.v === CONSENT_VERSION &&
      'analytics' in value &&
      typeof value.analytics === 'boolean' &&
      'marketing' in value &&
      typeof value.marketing === 'boolean' &&
      'ts' in value &&
      typeof value.ts === 'string'
    ) {
      return {
        v: CONSENT_VERSION,
        essential: true,
        analytics: value.analytics,
        marketing: value.marketing,
        ts: value.ts,
      }
    }
  } catch {
    // Malformed cookie: treat as no choice.
  }
  return null
}

/** A `document.cookie` assignment for the choice: 365 days, SameSite=Lax, Secure over HTTPS. */
export function consentCookie(consent: Consent, secure: boolean): string {
  const value = encodeURIComponent(JSON.stringify(consent))
  return `${CONSENT_COOKIE}=${value}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure ? '; Secure' : ''}`
}
