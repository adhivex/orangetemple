import { notoSansDevanagari, notoSerifDevanagari } from '@/lib/fonts/devanagari'
import { cn } from '@/lib/utils'

/**
 * Native-script (Devanagari) text, marked lang="hi" (D-016, D-022). Importing this
 * component is what loads the Devanagari fonts, so only pages that render
 * native-script text pay for them.
 */
export function NativeName({
  children,
  variant = 'sans',
  className,
}: {
  children: string
  variant?: 'serif' | 'sans'
  className?: string
}) {
  const font = variant === 'serif' ? notoSerifDevanagari : notoSansDevanagari
  return (
    <span lang="hi" className={cn(font.className, className)}>
      {children}
    </span>
  )
}
