import type { Region } from '@/generated/prisma/enums'

/** Region enum ↔ URL value (lowercase, ROUTES.md §3) ↔ display label, in display order. */
export const REGIONS: { value: Region; param: string; label: string }[] = [
  { value: 'NORTH', param: 'north', label: 'North' },
  { value: 'SOUTH', param: 'south', label: 'South' },
  { value: 'EAST', param: 'east', label: 'East' },
  { value: 'WEST', param: 'west', label: 'West' },
  { value: 'CENTRAL', param: 'central', label: 'Central' },
  { value: 'NORTHEAST', param: 'northeast', label: 'Northeast' },
]

export function regionFromParam(param: string | undefined): Region | undefined {
  return REGIONS.find((r) => r.param === param)?.value
}

export function regionLabel(region: Region) {
  return REGIONS.find((r) => r.value === region)?.label ?? region
}

export function regionParam(region: Region) {
  return REGIONS.find((r) => r.value === region)!.param
}
