import { useRef } from 'react'
import Stack from './Stack'

/**
 * @param initialState Populate the stack with an array of initial values.
 */
export default function useStack<Item>(initialState: Item[] = []) {
  const stack = useRef(new Stack(initialState))

  return stack.current
}
