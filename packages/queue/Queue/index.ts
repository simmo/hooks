export default class Queue<Item> {
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
