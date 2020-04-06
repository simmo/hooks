import Stack from '.'

describe('Stack', () => {
  test('initalises with an empty stack', () => {
    const stack = new Stack()

    expect(stack.size).toBe(0)
  })

  test('initalises with a populated stack', () => {
    const stack = new Stack(['a', 'b', 'c'])

    expect(stack.size).toBe(3)
  })

  test('removes and returns the item from the top of the stack', () => {
    const stack = new Stack(['a', 'b', 'c'])

    expect(stack.size).toBe(3)
    expect(stack.pop()).toBe('c')
    expect(stack.size).toBe(2)
    expect(stack.peek()).toBe('b')
  })

  test('adds the item to the top of the stack', () => {
    const stack = new Stack(['a', 'b', 'c'])

    expect(stack.size).toBe(3)

    stack.push('d')

    expect(stack.size).toBe(4)
    expect(stack.peek()).toBe('d')
  })

  test('returns the item at the top of the stack', () => {
    const stack = new Stack(['a', 'b', 'c'])

    expect(stack.size).toBe(3)
    expect(stack.peek()).toBe('c')
    expect(stack.size).toBe(3)
  })
})
