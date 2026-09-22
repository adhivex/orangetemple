import type { SVGProps } from 'react'

/** Outline doorway-arch icon for the "Temples" tab, matching the brand mark and lucide's 24px grid. */
export function TempleArchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M5.5 20.5v-9c0-3.6 2.9-5.8 6.5-8.5 3.6 2.7 6.5 4.9 6.5 8.5v9" />
      <path d="M9.5 20.5v-5c0-1.6 1.1-2.6 2.5-3.6 1.4 1 2.5 2 2.5 3.6v5" />
      <path d="M3 20.5h18" />
    </svg>
  )
}
