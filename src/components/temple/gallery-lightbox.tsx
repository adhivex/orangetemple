'use client'

import { ChevronLeft, ChevronRight, XIcon } from 'lucide-react'
import Image from 'next/image'
import { Dialog } from 'radix-ui'
import { useRef, type KeyboardEvent, type TouchEvent } from 'react'

import type { ImageData } from '@/server/shapes'

/**
 * Full-screen lightbox. Radix Dialog provides the focus trap, Escape to close, scroll
 * lock and focus return. Arrow keys and horizontal swipes move between images.
 * No animation beyond a fade, which the global reduced-motion rule collapses.
 */
export default function GalleryLightbox({
  images,
  index,
  onIndexChange,
  templeName,
}: {
  images: ImageData[]
  index: number | null
  onIndexChange: (index: number | null) => void
  templeName: string
}) {
  const touchStartX = useRef<number | null>(null)
  const open = index !== null
  const current = index ?? 0
  const image = images[current]

  const go = (delta: number) => onIndexChange((current + delta + images.length) % images.length)

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') go(1)
    if (event.key === 'ArrowLeft') go(-1)
  }
  function onTouchStart(event: TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }
  function onTouchEnd(event: TouchEvent) {
    const start = touchStartX.current
    const end = event.changedTouches[0]?.clientX
    touchStartX.current = null
    if (start === null || end === undefined || Math.abs(end - start) < 50) return
    go(end < start ? 1 : -1)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onIndexChange(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal-900/95 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          data-surface="dark"
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="fixed inset-0 z-50 flex flex-col text-ivory-50 outline-none"
        >
          <div className="flex items-center justify-between gap-4 px-4 pt-[max(env(safe-area-inset-top),0.75rem)]">
            <Dialog.Title className="text-small text-sand-100">
              {templeName} · {current + 1} of {images.length}
            </Dialog.Title>
            <Dialog.Close
              className="inline-flex size-11 items-center justify-center rounded-full hover:bg-ivory-50/10"
              aria-label="Close gallery"
            >
              <XIcon className="size-6" aria-hidden="true" />
            </Dialog.Close>
          </div>

          {image && (
            <figure className="relative flex min-h-0 flex-1 flex-col px-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
              <div className="relative min-h-0 flex-1">
                <Image
                  key={image.url}
                  src={image.url}
                  alt={image.altText}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <Dialog.Description asChild>
                <figcaption className="mx-auto mt-3 max-w-3xl text-center text-small text-sand-100">
                  {image.caption && <span className="text-ivory-50">{image.caption} · </span>}
                  {image.credit}
                </figcaption>
              </Dialog.Description>
            </figure>
          )}

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photograph"
                className="absolute top-1/2 left-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal-900/60 hover:bg-charcoal-900/80"
              >
                <ChevronLeft className="size-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photograph"
                className="absolute top-1/2 right-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal-900/60 hover:bg-charcoal-900/80"
              >
                <ChevronRight className="size-6" aria-hidden="true" />
              </button>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
