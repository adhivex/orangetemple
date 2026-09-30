/**
 * The newsletter form's instant email check (no dependencies, so nothing heavy reaches
 * the browser). Deliberately loose: it catches typing mistakes, and the server action's
 * zod rule (src/lib/newsletter.ts) decides.
 */
export function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
