'use client'

import { useState, useSyncExternalStore } from 'react'
import { toast } from 'sonner'

import { TempleIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import { useInstallPrompt } from './install-prompt'

type Platform = 'prompt' | 'ios' | null

function isIos() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPadOS reports itself as a Mac with touch.
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

const STANDALONE = '(display-mode: standalone)'

function subscribeStandalone(callback: () => void) {
  const query = window.matchMedia(STANDALONE)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

const noSubscription = () => () => {}

function isStandalone() {
  return (
    window.matchMedia(STANDALONE).matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

/**
 * "Install OrangeTemple" card in the menu sheet (MOBILE_WEBAPP.md §1). Android/Chrome:
 * shown once the browser offers installation, and Install opens its prompt. iOS Safari:
 * Install reveals the Add to Home Screen tip. Hidden when already installed.
 */
export function InstallCard() {
  const { prompt, installed, install } = useInstallPrompt()
  // Browser facts, read after hydration; the server render shows no card.
  const ios = useSyncExternalStore(noSubscription, isIos, () => false)
  const standalone = useSyncExternalStore(subscribeStandalone, isStandalone, () => true)
  const [showTip, setShowTip] = useState(false)

  const platform: Platform = prompt ? 'prompt' : ios ? 'ios' : null
  if (standalone || installed || !platform) return null

  return (
    <div className="mt-[18px] flex flex-wrap items-center gap-3 rounded-card border border-line bg-surface-alt p-4 tablet:mt-6">
      <span className="grid size-12 shrink-0 place-items-center rounded-[12px] bg-linear-to-b from-saffron-deep to-saffron-ink text-[26px] text-white">
        <TempleIcon />
      </span>
      <div className="min-w-[150px] flex-1">
        <p className="text-[15px] font-semibold text-ink">Install OrangeTemple</p>
        <p className="mt-0.5 text-[13px] leading-[1.45] text-muted-ink">
          Add it to your home screen for quick, app-like access.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="bg-card-surface"
        onClick={async () => {
          if (platform === 'ios') {
            setShowTip(true)
            return
          }
          const outcome = await install()
          if (outcome === 'accepted') toast('OrangeTemple installed.')
        }}
      >
        Install
      </Button>
      {showTip && (
        <p
          role="status"
          className="w-full rounded-[10px] bg-card-surface px-3 py-2.5 text-[13px] leading-normal text-ink-2"
        >
          On iPhone and iPad: tap <b>Share</b>, then <b>Add to Home Screen</b>.
        </p>
      )}
    </div>
  )
}
