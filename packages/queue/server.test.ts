/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useQueue from '.'

describe('useQueue', () => {
  test('initalises with an empty queue', () => {
    const result = renderHookServer(() => useQueue())

    expect(result.size).toBe(0)
  })

  test('initalises with a populated queue', () => {
    const result = renderHookServer(() => useQueue(['a', 'b', 'c']))

    expect(result.size).toBe(3)
  })

  test('dequeue an item', () => {
    const result = renderHookServer(() => useQueue(['a', 'b', 'c']))

    expect(result.size).toBe(3)
    expect(result.dequeue()).toBe('a')
    expect(result.size).toBe(2)
    expect(result.peek()).toBe('b')
  })

  test('enqueue an item', () => {
    const result = renderHookServer(() => useQueue(['a', 'b', 'c']))

    expect(result.size).toBe(3)

    result.enqueue('d')

    expect(result.size).toBe(4)
    expect(result.peek()).toBe('a')
  })

  test('returns the first item in the queue', () => {
    const result = renderHookServer(() => useQueue(['a', 'b', 'c']))

    expect(result.size).toBe(3)
    expect(result.peek()).toBe('a')
    expect(result.size).toBe(3)
  })
})
