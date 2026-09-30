'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { homeCopy } from '@/content/home'
import type { ConsentCategory } from '@/lib/consent'

import { useConsent } from './cookie-consent-provider'

const copy = homeCopy.cookieConsent

/**
 * Cookie preferences (HOMEPAGE_SPEC.md "Cookie consent"). Opened from the banner and the
 * footer's Cookie Settings. The toggles start from the stored choice (off when none);
 * Escape or a scrim click closes without saving. Loaded on demand by the provider.
 */
export function CookiePreferencesDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { consent, save } = useConsent()
  const [choice, setChoice] = useState<Record<ConsentCategory, boolean>>({
    analytics: false,
    marketing: false,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[520px] gap-0 overflow-hidden p-0 tablet:p-0"
        // Pre-fill from the stored choice each time it opens.
        onOpenAutoFocus={() =>
          setChoice({ analytics: !!consent?.analytics, marketing: !!consent?.marketing })
        }
      >
        <DialogHeader className="px-6 pt-6 pb-1.5">
          <DialogTitle>{copy.dialogTitle}</DialogTitle>
          <DialogDescription className="text-[14px]">{copy.dialogIntro}</DialogDescription>
        </DialogHeader>

        <ul className="mt-2">
          {copy.categories.map((category) => (
            <li
              key={category.id}
              className="flex items-start justify-between gap-4 border-t border-line px-6 py-4 first:border-t-0"
            >
              <div>
                <p
                  id={`consent-${category.id}-label`}
                  className="text-[15px] font-semibold text-ink"
                >
                  {category.label}
                </p>
                <p
                  id={`consent-${category.id}-description`}
                  className="mt-[3px] text-[13px] leading-normal text-muted-ink"
                >
                  {category.description}
                </p>
              </div>
              {category.locked ? (
                <span className="mt-[3px] text-[11px] tracking-[1px] whitespace-nowrap text-muted-ink uppercase">
                  {copy.alwaysOn}
                </span>
              ) : (
                <Switch
                  aria-labelledby={`consent-${category.id}-label`}
                  aria-describedby={`consent-${category.id}-description`}
                  checked={choice[category.id as ConsentCategory]}
                  onCheckedChange={(checked) =>
                    setChoice((current) => ({ ...current, [category.id]: checked }))
                  }
                  className="mt-0.5"
                />
              )}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-surface-alt px-6 pt-4 pb-[22px]">
          <Button
            variant="outline"
            size="sm"
            className="min-h-[46px] flex-[1_1_40%] tablet:flex-none"
            onClick={() => save({ analytics: false, marketing: false })}
          >
            {copy.reject}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="min-h-[46px] flex-[1_1_40%] tablet:flex-none"
            onClick={() => save(choice)}
          >
            {copy.save}
          </Button>
          <Button
            size="sm"
            className="min-h-[46px] basis-full tablet:basis-auto"
            onClick={() => save({ analytics: true, marketing: true })}
          >
            {copy.accept}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
