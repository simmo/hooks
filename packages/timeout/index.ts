import { useEffect, useRef } from 'react'

/**
 * @param callback Will be executed when the `delay` elapses.
 * @param delay Length of time in milliseconds before the `callback` is executed. Providing `null` will clear the timeout.
 */
export default function useTimeout(callback: Function, delay?: number): void {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay !== null) {
      const id = setTimeout(tick, delay)

      return () => {
        clearTimeout(id)
      }
    }
  }, [delay])
}
