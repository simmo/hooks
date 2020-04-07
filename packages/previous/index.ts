import { useEffect, useRef } from 'react'

/**
 * @param value The value to be returned on the next render.
 * @returns Returns the last value, undefined for initial render.
 */
export default function usePrevious<T>(value: T): T {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
