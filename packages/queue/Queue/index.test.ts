import Queue from '.'

describe('Queue', () => {
  test('initalises with an empty queue', () => {
    const queue = new Queue()

    expect(queue.size).toBe(0)
  })

  test('initalises with a populated queue', () => {
    const queue = new Queue(['a', 'b', 'c'])

    expect(queue.size).toBe(3)
  })

  test('dequeue an item', () => {
    const queue = new Queue(['a', 'b', 'c'])

    expect(queue.size).toBe(3)
    expect(queue.dequeue()).toBe('a')
    expect(queue.size).toBe(2)
    expect(queue.peek()).toBe('b')
  })

  test('enqueue an item', () => {
    const queue = new Queue(['a', 'b', 'c'])

    expect(queue.size).toBe(3)

    queue.enqueue('d')

    expect(queue.size).toBe(4)
    expect(queue.peek()).toBe('a')
  })

  test('returns the first item in the queue', () => {
    const queue = new Queue(['a', 'b', 'c'])

    expect(queue.size).toBe(3)
    expect(queue.peek()).toBe('a')
    expect(queue.size).toBe(3)
  })
})
