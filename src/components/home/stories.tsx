import type { ComponentType, SVGProps } from 'react'

import { ArrowRightIcon, BookIcon, LotusIcon, MapIcon, PeopleIcon } from '@/components/icons'
import { SoonButton } from '@/components/navigation/nav-item'
import { Rail } from '@/components/ui/rail'
import { SectionHeader } from '@/components/ui/section-header'
import { homeCopy, soon } from '@/content/home'

const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  people: PeopleIcon,
  lotus: LotusIcon,
  map: MapIcon,
  book: BookIcon,
}

/**
 * The "#stories" block (HOMEPAGE_SPEC.md §8). Stories, festivals, yatra planning and
 * knowledge are V1 non-goals (D-005), so every entry shows a "coming soon" toast. Photos
 * are not used (D-045): explore cards show an icon panel, story cards the placeholder.
 * Tablet and up: four explore cards (2×2 on tablet portrait). Phones: a Latest Stories
 * rail instead.
 */
export function Stories() {
  const stories = homeCopy.latestStories
  return (
    <div id="stories" className="render-lazily">
      <section
        aria-label="More to explore"
        className="hidden bg-surface py-16 tablet:block desktop:py-20"
      >
        <ul className="container-site grid grid-cols-2 gap-[26px] tablet-lg:grid-cols-4">
          {homeCopy.explore.map((item) => {
            const Icon = icons[item.icon]!
            return (
              <li key={item.title}>
                <SoonButton
                  message={item.soon}
                  className="group flex h-full w-full items-center gap-[18px] rounded-card border border-line bg-card-surface p-3.5 text-left transition-[border-color,box-shadow] duration-300 select-none hover:border-gold-line hover:shadow-soft active:scale-[0.975]"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-[100px] w-[84px] shrink-0 place-items-center rounded-[10px] border border-gold-line bg-surface-alt text-[34px] text-saffron"
                  >
                    <Icon />
                  </span>
                  <span>
                    <span className="block font-serif text-[22px] leading-[1.1] font-semibold text-ink">
                      {item.title}
                    </span>
                    <span className="mt-1 mb-2.5 block text-[13px] text-muted-ink">
                      {item.text}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-saffron-ink">
                      {item.cta}
                      <ArrowRightIcon className="transition-transform duration-300 ease-temple group-hover:translate-x-[3px]" />
                    </span>
                  </span>
                </SoonButton>
              </li>
            )
          })}
        </ul>
      </section>

      <section
        aria-labelledby="latest-stories-title"
        className="bg-surface pt-14 pb-[50px] tablet:hidden"
      >
        <div className="container-site">
          <SectionHeader
            id="latest-stories-title"
            title={stories.title}
            subtitle={stories.subtitle}
          />
          <Rail label={stories.title} columnsClassName="[--rail-col:56%]">
            {stories.items.map((title) => (
              <li key={title} className="snap-start">
                <SoonButton
                  message={soon.stories}
                  className="relative block aspect-[4/5] w-full overflow-hidden rounded-[14px] text-left shadow-soft select-none bg-photo-placeholder active:scale-[0.975]"
                >
                  <LotusIcon
                    aria-hidden="true"
                    className="absolute top-[30%] left-1/2 size-12 -translate-x-1/2 text-saffron-glow opacity-45"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-card-scrim" />
                  <span className="absolute inset-x-0 bottom-0 z-[1] p-[18px] text-white">
                    <span className="block font-serif text-[21px] leading-[1.05] font-semibold">
                      {title}
                    </span>
                    <span className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-medium text-saffron-glow">
                      {stories.readMore}
                      <ArrowRightIcon />
                    </span>
                  </span>
                </SoonButton>
              </li>
            ))}
          </Rail>
        </div>
      </section>
    </div>
  )
}
