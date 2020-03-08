import { useLayoutEffect, useRef } from 'react'

/**
 * @param callback Will be executed before the each repaint.
 * @param deps An array of values that, when modified, will clear and reset the callback effect. See https://reactjs.org/docs/hooks-reference.html#uselayouteffect.
 */
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
