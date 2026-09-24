import { serializeJsonLd } from '@/lib/seo'

/** Renders one or more JSON-LD objects (ARCHITECTURE.md §9). Server Component. */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          // Safe: serializeJsonLd escapes "<", and the data comes from our own records.
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
        />
      ))}
    </>
  )
}
