/*
 * OrangeTemple custom icon set (docs/design/code/icons.tsx, extracted from the reference build).
 * Usage: <TrishulIcon className="size-9 text-saffron" />
 * Line icons use currentColor. Multi-colour deity and region icons keep their fixed colours
 * by design: they are illustrations, so the no-hex rule for components does not apply here.
 */
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function TempleIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 40 44"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="currentColor"
        d="M20 0l.9 3.2 5.1 1.3-5.3 1.1V8c2.6 1.5 4.2 4.3 4.8 7.2 2.3 1.2 3.5 3.5 3.8 6.1 2.2 1 3.3 3.2 3.5 5.6H36v2.5h-2v12.1h4V44H2v-2.5h4V29.4H4v-2.5h3.2c.2-2.4 1.3-4.6 3.5-5.6.3-2.6 1.5-4.9 3.8-6.1.6-2.9 2.2-5.7 4.8-7.2V3.2L20 0zm-3 30.5v11h6v-11c0-1.7-1.3-3-3-3s-3 1.3-3 3zM9 29.4v12.1h5V29.4H9zm17 0v12.1h5V29.4h-5z"
      />
    </svg>
  )
}

export function TrishulIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M24 4v40M24 4l-3 6h6l-3-6M10 10c0 9 5 14 14 14s14-5 14-14M10 10l-3 4M10 10l3 4M38 10l-3 4M38 10l3 4M19 30h10M20 36h8" />
      </g>
    </svg>
  )
}

export function OmIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <text
        x="24"
        y="38"
        textAnchor="middle"
        fontSize="40"
        fill="currentColor"
        fontFamily="'Noto Sans Devanagari', 'Nirmala UI', Mangal, sans-serif"
      >
        ॐ
      </text>
    </svg>
  )
}

export function NamasteIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M22.5 6c-1.5 0-2.5 1.2-2.5 3v16l-5 6-5 3-6 8M25.5 6c1.5 0 2.5 1.2 2.5 3v16l5 6 5 3 6 8M22.5 6v24M25.5 6v24M20 18l-4 7M28 18l4 7" />
      </g>
    </svg>
  )
}

export function PeopleIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="24" cy="15" r="6" />
        <circle cx="11" cy="18" r="4.5" />
        <circle cx="37" cy="18" r="4.5" />
        <path d="M13 38c0-6 5-11 11-11s11 5 11 11zM3 34c0-4.5 3.5-8 8-8 2 0 3.6.6 5 1.6M45 34c0-4.5-3.5-8-8-8-2 0-3.6.6-5 1.6" />
      </g>
    </svg>
  )
}

export function MapIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        d="M4 10l12-5 16 5 12-5v33l-12 5-16-5-12 5zM16 5v33M32 10v33"
      />
    </svg>
  )
}

export function LotusIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
        <path d="M24 8c5 5 6 13 0 26-6-13-5-21 0-26z" />
        <path d="M24 34c-2-8-7-14-14-15 0 8 5 14 14 15zM24 34c2-8 7-14 14-15 0 8-5 14-14 15z" />
        <path d="M24 34C18 31 9 28 3 30c4 5 12 6 21 4zM24 34c6-3 15-6 21-4-4 5-12 6-21 4z" />
        <path d="M12 40h24" />
      </g>
    </svg>
  )
}

export function ChakraIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="24" cy="24" r="18" />
        <circle cx="24" cy="24" r="12" />
        <circle cx="24" cy="24" r="3.5" fill="currentColor" />
        <path d="M24 6v36M6 24h36M11.3 11.3l25.4 25.4M36.7 11.3L11.3 36.7" />
      </g>
    </svg>
  )
}

export function PeacockFeatherIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g fill="none" strokeWidth="2.2" strokeLinecap="round">
        <path stroke="#2E7D4F" d="M10 44L30 12" />
        <path
          stroke="#3E9C62"
          d="M30 12c-8 2-14 9-15 20 10-1 17-7 18-16 3-4 5-8 4-12-3 1-6 4-7 8z"
          fill="#CDE8C9"
        />
        <ellipse cx="26.5" cy="21" rx="4.2" ry="5.5" fill="#2A5DA8" stroke="#2A5DA8" />
        <circle cx="26.5" cy="21" r="2" fill="#D39A1E" stroke="none" />
      </g>
    </svg>
  )
}

export function BowIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M10 6c20 4 30 14 32 32" />
        <path d="M10 6l32 32M6 42L38 10M38 10l-6 1M38 10l-1 6M6 42l2-6M6 42l6-2" />
      </g>
    </svg>
  )
}

export function GadaIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M8 42l20-20" />
        <path
          d="M26 10c3-3 10-3 12 0s3 9 0 12-9 3-12 0-3-9 0-12z"
          fill="currentColor"
          fillOpacity=".18"
        />
        <path d="M28 12l8 8M32 8l8 8M24 18l8 8M6 44l4-4" />
      </g>
    </svg>
  )
}

export function LotusFilledIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g fill="#E0433B">
        <path d="M24 7c5 5 6 14 0 27-6-13-5-22 0-27z" />
        <path
          d="M24 34c-2-8-7-14-15-15 0 8 6 14 15 15zM24 34c2-8 7-14 15-15 0 8-6 14-15 15z"
          fill="#EF5B4A"
        />
        <path
          d="M24 34C18 31 8 28 2 31c4 5 13 6 22 3zM24 34c6-3 16-6 22-3-4 5-13 6-22 3z"
          fill="#F07A5E"
        />
      </g>
    </svg>
  )
}

export function MountainIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path fill="#5E8FB8" d="M2 40l15-24 7 10 6-8 16 22z" />
      <path
        fill="#fff"
        d="M17 16l4.5 7-3-1-2.5 3-2-2.5-2.5 1.5zM30 18l3.5 5-2.5-.5-1.5 2-1.5-2.5z"
        opacity=".9"
      />
    </svg>
  )
}

export function PalmIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path fill="none" stroke="#8B5A2B" strokeWidth="2.6" d="M24 20c-1 9 0 17 2 24" />
      <path
        fill="#2E9A4F"
        d="M24 20C19 12 10 11 5 15c6-1 12 1 19 5zM24 20c5-8 14-9 19-5-6-1-12 1-19 5zM24 20C22 11 16 5 10 5c5 3 10 8 14 15zM24 20c2-9 8-15 14-15-5 3-10 8-14 15z"
      />
      <path fill="#F2C94C" d="M8 44h32c-3-3-9-4-16-4s-13 1-16 4z" />
    </svg>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle cx="24" cy="24" r="9" fill="#F5A623" />
      <g stroke="#F5A623" strokeWidth="3" strokeLinecap="round">
        <path d="M24 3v6M24 39v6M3 24h6M39 24h6M9 9l4 4M35 35l4 4M39 9l-4 4M13 35l-4 4" />
      </g>
    </svg>
  )
}

export function WaveIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="#1E78C8"
        d="M4 30c4-12 16-20 27-16 7 3 9 10 5 14-3 3-9 2-9-3 0-3 3-4 5-3-2-4-9-4-13 1-4 4-4 10 0 13H4z"
      />
      <path
        fill="none"
        stroke="#1E78C8"
        strokeWidth="2.6"
        strokeLinecap="round"
        d="M4 42c4-3 8-3 12 0s8 3 12 0 8-3 12 0"
      />
    </svg>
  )
}

export function LeafIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path fill="#3F9F4E" d="M40 6C22 6 8 16 10 36c18 2 30-12 30-30z" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M12 38L34 14M18 30h8M22 24l1-7"
      />
    </svg>
  )
}

export function GridIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g fill="#6E6259">
        <circle cx="12" cy="12" r="3" />
        <circle cx="24" cy="12" r="3" />
        <circle cx="36" cy="12" r="3" />
        <circle cx="12" cy="24" r="3" />
        <circle cx="24" cy="24" r="3" />
        <circle cx="36" cy="24" r="3" />
        <circle cx="12" cy="36" r="3" />
        <circle cx="24" cy="36" r="3" />
        <circle cx="36" cy="36" r="3" />
      </g>
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M15.5 15.5L21 21" />
      </g>
    </svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M3 6h18M3 12h18M3 18h18"
      />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M5 5l14 14M19 5L5 19"
      />
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 12h15M13 6l6 6-6 6"
      />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5l7 7-7 7"
      />
    </svg>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 5l-7 7 7 7"
      />
    </svg>
  )
}

export function PinIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"
      />
    </svg>
  )
}

export function HomeIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path fill="currentColor" d="M12 3l9 8h-3v9h-4.5v-6h-3v6H6v-9H3z" />
    </svg>
  )
}

export function BookIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1zM12 6v14"
      />
    </svg>
  )
}

export function MoreIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g fill="currentColor">
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
      </g>
    </svg>
  )
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19V5M6 11l6-6 6 6"
      />
    </svg>
  )
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="currentColor"
        d="M22 8.2c-.2-1.6-1-2.7-2.6-2.9C17 5 12 5 12 5s-5 0-7.4.3C3 5.5 2.2 6.6 2 8.2 1.8 10 1.8 12 1.8 12s0 2 .2 3.8c.2 1.6 1 2.7 2.6 2.9C7 19 12 19 12 19s5 0 7.4-.3c1.6-.2 2.4-1.3 2.6-2.9.2-1.8.2-3.8.2-3.8s0-2-.2-3.8zM10 15V9l5.2 3z"
      />
    </svg>
  )
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
      </g>
      <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
    </svg>
  )
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 2a10 10 0 00-1.6 19.9V14.9H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0012 2z"
      />
    </svg>
  )
}

export function XIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="currentColor"
        d="M17.8 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.9zm-1.1 16.2h1.7L7.4 4.7H5.6z"
      />
    </svg>
  )
}

export function PinterestIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 2a10 10 0 00-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.5-1.8-4.3-4.4-4.3-3 0-4.8 2.3-4.8 4.6 0 .9.3 1.9.8 2.4.1.1.1.2.1.3l-.3 1.2c0 .2-.2.3-.4.2-1.4-.6-2.2-2.6-2.2-4.2 0-3.4 2.5-6.6 7.2-6.6 3.8 0 6.7 2.7 6.7 6.3 0 3.8-2.4 6.8-5.7 6.8-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.2 1-.9 2.2-1.4 2.9A10 10 0 1012 2z"
      />
    </svg>
  )
}
