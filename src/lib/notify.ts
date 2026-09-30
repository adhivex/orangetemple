/*
 * Toast messages without loading the toast library up front. `notify()` queues the
 * message and asks <LazyToaster> (root layout) to load Sonner; once mounted, it drains
 * the queue and shows later messages directly. Toasts only follow a visitor's action or
 * a connectivity change, so nothing needs them during the first load.
 */

type Show = (message: string) => void

const queue: string[] = []
let show: Show | null = null

export const NOTIFY_EVENT = 'ot:notify'

export function notify(message: string) {
  if (show) {
    show(message)
    return
  }
  queue.push(message)
  window.dispatchEvent(new Event(NOTIFY_EVENT))
}

/** Called by the toaster once mounted: shows queued messages, then handles new ones. */
export function attachToaster(handler: Show) {
  show = handler
  queue.splice(0).forEach(handler)
  return () => {
    show = null
  }
}
