import { renderMarkdown } from '@/lib/markdown'
import { cn } from '@/lib/utils'

/**
 * Renders a Markdown content field (D-003). The HTML comes from our own renderer with
 * raw HTML disabled, so injecting it is safe. Server Component: no client JavaScript.
 */
export function Markdown({ source, className }: { source: string; className?: string }) {
  return (
    <div
      className={cn('prose-ot', className)}
      // Safe: renderMarkdown escapes raw HTML and rejects unsafe link protocols.
      dangerouslySetInnerHTML={{ __html: renderMarkdown(source) }}
    />
  )
}
