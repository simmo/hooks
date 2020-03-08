import { useEffect } from 'react'
import useBoolean from '@hooks/boolean'

/**
 * @param query A string representing the media query to parse.
 * @param fallback The initial match state, defaults to `false`.
 * @returns Returns `true` if the document currently matches the media query list, `false` if not.
 */
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
