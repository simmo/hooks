import { useEffect, useRef } from 'react'

/**
 * @param callback Will be executed each time the `interval` elapses.
 * @param interval Length of time in milliseconds before the `callback` is executed. Providing `null` will clear the interval.
 */
export default function useInterval(
  callback: Function,
  interval?: number | null
): void {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (interval !== null) {
      const id = setInterval(tick, interval)

      return () => {
        clearInterval(id)
      }
    }
  }, [interval])
}
