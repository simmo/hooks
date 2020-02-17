import { useLayoutEffect, useRef } from 'react'

export default function useRaf<C extends (timeElapsed: number) => void, D>(
  callback: C,
  deps?: readonly D[]
): void {
  const savedCallback = useRef(callback)

  useLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useLayoutEffect(() => {
    function tick(timestamp: number) {
      savedCallback.current(timestamp)
    }

    const id = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
