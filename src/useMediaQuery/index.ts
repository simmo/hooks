import { useEffect } from 'react'
import useBoolean from '../useBoolean'

export default function useMediaQuery(
  query: string,
  fallback = false
): boolean {
  const [state, setState] = useBoolean(fallback)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handleChange = ({ matches }: MediaQueryListEvent) => {
      setState(matches)
    }

    mediaQuery.addListener(handleChange)

    return () => {
      mediaQuery.removeListener(handleChange)
    }
  }, [query, setState])

  return state
}
