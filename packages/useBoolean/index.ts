import { useState, useCallback } from 'react'

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
