import { useEffect, useRef } from 'react'

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
