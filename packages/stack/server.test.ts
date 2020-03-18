/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useStack from '.'

describe('useStack', () => {
  test('initalises with an empty stack', () => {
    const result = renderHookServer(() => useStack())

    expect(result.size).toBe(0)
  })

  test('initalises with a populated stack', () => {
    const result = renderHookServer(() => useStack(['a', 'b', 'c']))

    expect(result.size).toBe(3)
  })

  test('removes and returns the item from the top of the stack', () => {
    const result = renderHookServer(() => useStack(['a', 'b', 'c']))

    expect(result.size).toBe(3)
    expect(result.pop()).toBe('c')
    expect(result.size).toBe(2)
    expect(result.peek()).toBe('b')
  })

  test('adds the item to the top of the stack', () => {
    const result = renderHookServer(() => useStack(['a', 'b', 'c']))

    expect(result.size).toBe(3)

    result.push('d')

    expect(result.size).toBe(4)
    expect(result.peek()).toBe('d')
  })

  test('returns the item at the top of the stack', () => {
    const result = renderHookServer(() => useStack(['a', 'b', 'c']))

    expect(result.size).toBe(3)
    expect(result.peek()).toBe('c')
    expect(result.size).toBe(3)
  })
})
