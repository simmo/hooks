import { useEffect } from 'react'
import useBoolean from '../boolean'

function expandHeight(elem: HTMLElement): void {
  elem.style.height = 'auto'

  const height = elem.clientHeight + 'px'

  // setting height to 0 and setTimeout are needed
  // for css transition to trigger
  elem.style.height = '0px'
  setTimeout(() => (elem.style.height = height), 0)
}

function collapseHeight(elem: HTMLElement): void {
  elem.style.height = '0px'
}

/**
 * @param ref The ref of the element.
 * @param initialState The initial state for the height value.
 * @returns Returns an array containing the status of the element and a function to update it.
 */
export default function useToggleHeight(
  ref: React.MutableRefObject<HTMLElement>,
  initialState = false
): [boolean, () => void] {
  const [isExpanded, toggle] = useBoolean(initialState)

  useEffect(() => {
    if (isExpanded) {
      expandHeight(ref.current)
      return
    }

    collapseHeight(ref.current)
  }, [ref, isExpanded])

  return [isExpanded, toggle]
}
