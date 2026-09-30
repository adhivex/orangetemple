/**
 * Faint temple-skyline silhouettes (HOMEPAGE_SPEC.md §7), from the reference build.
 * Generic shapes, not any particular temple. Decorative: colour and opacity come from
 * the caller.
 */
export function Skyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        fill="currentColor"
        d="M0 200V150h40v-30l20-40 20 40v30h30v50zM130 200v-70l18-10 12-60 12 60 18 10v70zM860 200v-60l25-20 15-80 15 80 25 20v60zM960 200v-40h30v-30l18-35 18 35v30h30v40zM1080 200v-80l20-15 14-70 14 70 20 15v80z"
      />
    </svg>
  )
}
