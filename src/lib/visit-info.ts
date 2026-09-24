/**
 * Visit-information freshness (CONTENT-MODEL.md §3). Time-sensitive details are shown
 * only when they carry a verification date no older than twelve months; otherwise the
 * page shows the "confirm before you travel" notice instead.
 */

export const VISIT_INFO_MAX_AGE_MONTHS = 12

export const VISIT_INFO_NOTICE =
  'Timings and access rules change. Please confirm with the official source before you travel.'

export type VisitInfoFields = {
  timings: string | null
  entryRules: string | null
  dressCode: string | null
  photographyRules: string | null
  bestTimeToVisit: string | null
  seasonalAccess: string | null
  howToReach: string | null
  lastVerifiedAt: Date | null
  verificationSourceUrl: string | null
}

export function hasVisitDetails(info: VisitInfoFields | null | undefined): boolean {
  if (!info) return false
  return [
    info.timings,
    info.entryRules,
    info.dressCode,
    info.photographyRules,
    info.bestTimeToVisit,
    info.seasonalAccess,
    info.howToReach,
  ].some((value) => Boolean(value?.trim()))
}

/** True when lastVerifiedAt exists and is within the last twelve months of `now`. */
export function isRecentlyVerified(lastVerifiedAt: Date | null | undefined, now: Date): boolean {
  if (!lastVerifiedAt) return false
  const cutoff = new Date(now)
  cutoff.setUTCMonth(cutoff.getUTCMonth() - VISIT_INFO_MAX_AGE_MONTHS)
  return lastVerifiedAt >= cutoff && lastVerifiedAt <= now
}

/** Details are shown only when present, sourced and recently verified. */
export function shouldShowVisitDetails(
  info: VisitInfoFields | null | undefined,
  now: Date,
): info is VisitInfoFields {
  return (
    hasVisitDetails(info) &&
    Boolean(info?.verificationSourceUrl) &&
    isRecentlyVerified(info?.lastVerifiedAt, now)
  )
}

/** "March 2026" — UTC, so the month never shifts with the server's time zone. */
export function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
