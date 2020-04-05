import { useRef } from 'react'

class Queue<Item> {
  private queue: Item[] = []

  constructor(initialState: Item[] = []) {
    this.queue = initialState
  }

  /** Removes and returns the item at the front of the queue. */
  dequeue() {
    return this.queue.shift()
  }

  /**
   * Adds the `item` to the end of the queue.
   *
   * @param item Item to add to the end of the queue.
   */
  enqueue(item: Item) {
    this.queue.push(item)
  }

  /** Returns the number of items in the queue. */
  get size() {
    return this.queue.length
  }

  /** Returns the item at the front of the queue. */
  peek() {
    return this.queue[0]
  }
}

/**
 * @param initialState Populate the queue with an array of initial values.
 */
export default function useQueue<Item>(initialState: Item[] = []) {
  const queue = useRef(new Queue(initialState))

  return queue.current
}
