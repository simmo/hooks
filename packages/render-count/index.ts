import { useRef, useEffect } from 'react'

/**
 * @returns Returns the number of times the hook has been called.
 */
export default function useRenderCount(): number {
  const renderCount = useRef(1)

  useEffect(() => {
    renderCount.current += 1
  })

  return renderCount.current
}
