import { useRef } from 'react'

class Stack<Item> {
  private stack: Item[] = []

  constructor(initialState: Item[] = []) {
    this.stack = initialState
  }

  /** Removes and returns the item at the top of the stack. */
  pop() {
    return this.stack.pop()
  }

  /**
   * Adds the `item` to the top of the stack.
   *
   * @param item Item to add to the top of the stack.
   */
  push(item: Item) {
    this.stack.push(item)
  }

  /** Returns the number of items in the stack. */
  get size() {
    return this.stack.length
  }

  /** Returns the item at the top of the stack. */
  peek() {
    return this.stack[this.stack.length - 1]
  }
}

/**
 * @param initialState Populate the stack with an array of initial values.
 */
export default function useStack<Item>(initialState: Item[] = []) {
  const stack = useRef(new Stack(initialState))

  return stack.current
}
