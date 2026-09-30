import Link from 'next/link'
import type { ComponentType, ReactNode, SVGProps } from 'react'

import {
  BowIcon,
  ChakraIcon,
  GadaIcon,
  GridIcon,
  LeafIcon,
  LotusFilledIcon,
  MountainIcon,
  OmIcon,
  PalmIcon,
  PeacockFeatherIcon,
  SunIcon,
  TempleIcon,
  TrishulIcon,
  WaveIcon,
} from '@/components/icons'
import { SoonButton } from '@/components/navigation/nav-item'
import { ScrollList } from '@/components/ui/rail'
import { homeCopy, soon } from '@/content/home'
import { directoryHref } from '@/lib/routes'
import { searchHref } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import type { Tile } from '@/server/queries'

type Icon = ComponentType<SVGProps<SVGSVGElement>>

/** Medallion icon and colour per deity slug; unknown deities fall back to the temple mark. */
const deityIcons: Record<string, { Icon: Icon; className?: string }> = {
  shiva: { Icon: TrishulIcon, className: 'text-saffron' },
  vishnu: { Icon: ChakraIcon, className: 'text-leaf' },
  devi: { Icon: LotusFilledIcon },
  krishna: { Icon: PeacockFeatherIcon },
  rama: { Icon: BowIcon, className: 'text-saffron' },
  hanuman: { Icon: GadaIcon, className: 'text-saffron' },
  ganesha: { Icon: OmIcon, className: 'text-saffron' },
}

const regionStyles: Record<string, { Icon: Icon; className: string }> = {
  north: { Icon: MountainIcon, className: 'bg-region-north' },
  south: { Icon: PalmIcon, className: 'bg-region-south' },
  east: { Icon: SunIcon, className: 'bg-region-east' },
  west: { Icon: WaveIcon, className: 'bg-region-west' },
  central: { Icon: TempleIcon, className: 'bg-region-central text-saffron-glow' },
  northeast: { Icon: LeafIcon, className: 'bg-region-northeast' },
}

const tileClass =
  'group flex min-h-11 flex-col items-center gap-2.5 text-center text-[12.5px] text-ink-2 select-none [-webkit-touch-callout:none] tablet:text-[13.5px]'

function Medallion({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-[66px] place-items-center rounded-full border border-gold-line bg-surface text-[28px] shadow-[inset_0_0_0_5px_var(--color-surface),inset_0_0_0_6px_var(--color-line)] transition-[translate,scale,border-color,box-shadow] duration-[400ms] ease-temple group-hover:-translate-y-1 group-hover:border-saffron group-hover:shadow-[inset_0_0_0_5px_var(--color-surface),inset_0_0_0_6px_var(--color-saffron-soft),0_12px_24px_-12px_rgb(217_107_34/0.5)] group-active:scale-[0.94] tablet:size-[68px] desktop:size-[74px] desktop:text-[32px]">
      {children}
    </span>
  )
}

const regionTileClass =
  'relative block aspect-[0.7] overflow-hidden rounded-tile select-none [-webkit-touch-callout:none] transition-transform duration-200 ease-temple active:scale-[0.975] tablet:aspect-[1.35]'

function RegionFace({ slug, name }: { slug: string; name: string }) {
  const style = regionStyles[slug] ?? regionStyles.central!
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 grid place-items-center pb-6 transition-transform duration-[1100ms] ease-temple group-hover:scale-[1.07]',
          style.className,
        )}
      >
        <style.Icon className="size-11 opacity-80" />
      </span>
      <span aria-hidden="true" className="absolute inset-0 bg-card-scrim" />
      <span className="absolute bottom-[11px] left-2.5 z-[1] font-serif text-[19px] font-semibold text-white tablet:left-3.5 tablet:text-[22px]">
        {name}
      </span>
    </>
  )
}

/**
 * Browse by deity and by region (HOMEPAGE_SPEC.md §6, D-049). Every tile shows; tiles
 * with published temples link to the filtered directory, the others show a "coming soon"
 * toast. "All" opens search. Regions have no photographs yet (D-045): each tile is a deep
 * tone with its icon. Phone: a 4×2 medallion grid and a region rail. Tablet portrait: 8
 * medallions in a row, 3×2 regions, stacked. Tablet landscape and up: side by side.
 */
export function Browse({ deities, regions }: { deities: Tile[]; regions: Tile[] }) {
  const copy = homeCopy
  return (
    <section
      aria-label="Browse temples"
      className="bg-surface pt-14 pb-[60px] render-lazily tablet:pt-[88px] tablet:pb-24"
    >
      <div className="container-site grid gap-14 tablet:gap-12 tablet-lg:grid-cols-2 tablet-lg:gap-16">
        <div>
          <h2 className="font-serif text-[31px] leading-[1.05] font-medium text-ink tablet:text-[clamp(30px,3vw,38px)]">
            {copy.deities.title}
          </h2>
          <p className="mt-2 mb-7 text-[15px] text-muted-ink">{copy.deities.subtitle}</p>
          <ul className="grid grid-cols-4 gap-x-1.5 gap-y-[18px] tablet:grid-cols-8 tablet:gap-y-3 tablet-lg:grid-cols-4 tablet-lg:gap-x-2.5 tablet-lg:gap-y-[22px]">
            {deities.map((deity) => {
              const icon = deityIcons[deity.slug] ?? { Icon: TempleIcon, className: 'text-saffron' }
              const face = (
                <>
                  <Medallion>
                    <icon.Icon className={icon.className} />
                  </Medallion>
                  {deity.name}
                </>
              )
              return (
                <li key={deity.slug}>
                  {deity.count > 0 ? (
                    <Link href={directoryHref({ deity: deity.slug })} className={tileClass}>
                      {face}
                    </Link>
                  ) : (
                    <SoonButton
                      message={soon.deity(deity.name)}
                      className={cn(tileClass, 'w-full')}
                    >
                      {face}
                    </SoonButton>
                  )}
                </li>
              )
            })}
            <li>
              <Link href={searchHref} className={tileClass}>
                <Medallion>
                  <GridIcon />
                </Medallion>
                {copy.deities.allLabel}
              </Link>
            </li>
          </ul>
        </div>

        <div className="tablet-lg:border-l tablet-lg:border-line tablet-lg:pl-16">
          <h2 className="font-serif text-[31px] leading-[1.05] font-medium text-ink tablet:text-[clamp(30px,3vw,38px)]">
            {copy.regions.title}
          </h2>
          <p className="mt-2 mb-7 text-[15px] text-muted-ink">{copy.regions.subtitle}</p>
          <ScrollList className="-mr-[max(20px,env(safe-area-inset-right))] scrollbar-none grid auto-cols-[30%] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain pr-[max(20px,env(safe-area-inset-right))] tablet:mr-0 tablet:grid-flow-row tablet:grid-cols-3 tablet:overflow-visible tablet:pr-0">
            {regions.map((region) => (
              <li key={region.slug} className="snap-start">
                {region.count > 0 ? (
                  <Link
                    href={directoryHref({ region: region.slug })}
                    className={cn('group', regionTileClass)}
                  >
                    <RegionFace slug={region.slug} name={region.name} />
                  </Link>
                ) : (
                  <SoonButton
                    message={soon.region(region.name)}
                    className={cn('group w-full text-left', regionTileClass)}
                  >
                    <RegionFace slug={region.slug} name={region.name} />
                  </SoonButton>
                )}
              </li>
            ))}
          </ScrollList>
        </div>
      </div>
    </section>
  )
}
