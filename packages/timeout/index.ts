import { useEffect, useRef } from 'react'

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
