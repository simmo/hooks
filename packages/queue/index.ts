import { useRef } from 'react'
import Queue from './Queue'

/**
 * @param initialState Populate the queue with an array of initial values.
 */
export default function useQueue<Item>(initialState: Item[] = []) {
  const queue = useRef(new Queue(initialState))

  return queue.current
}
