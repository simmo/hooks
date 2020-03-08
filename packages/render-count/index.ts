import { useRef, useEffect } from 'react'

/**
 * @returns Returns the number of times the the hooks has been called.
 */
export default function useRenderCount() {
  const renderCount = useRef(1)

  useEffect(() => {
    renderCount.current += 1
  })

  return renderCount.current
}
