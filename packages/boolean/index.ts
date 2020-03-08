import { useState, useCallback } from 'react'

/**
 * @param initialValue The initial state for the value.
 * @returns Returns an array containing the value and a function to update it.
 */
export default function useBoolean(
  initialValue: boolean
): [boolean, (nextValue?: boolean) => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback((nextValue?: boolean) => {
    if (typeof nextValue === 'boolean') {
      setValue(nextValue)
    } else {
      setValue(currentValue => !currentValue)
    }
  }, [])

  return [value, toggle]
}
