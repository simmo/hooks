import { useEffect } from 'react'

/**
 * @param message If provided, will cause the message to be shown before the page is unloaded.
 */
export default function useBeforeUnload(message?: string) {
  useEffect(() => {
    if (!message) return

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()

      event.returnValue = message

      return message
    }

    window.addEventListener('beforeunload', handler)

    return () => window.removeEventListener('beforeunload', handler)
  }, [message])
}
