import { Rail } from '@/components/content/rail'
import { SectionHeader } from '@/components/content/section-header'
import type { TempleCardData } from '@/server/shapes'

import { TempleCard } from './temple-card'

/** Related temples (derived; DATABASE-SCHEMA.md §5). Renders nothing when empty. */
export function RelatedTemples({ temples }: { temples: TempleCardData[] }) {
  if (temples.length === 0) return null
  return (
    <section aria-labelledby="related-title">
      <SectionHeader id="related-title" title="Related temples" className="mb-8" />
      <Rail label="Related temples" columns={4}>
        {temples.map((temple) => (
          <TempleCard key={temple.slug} temple={temple} />
        ))}
      </Rail>
    </section>
  )
}
