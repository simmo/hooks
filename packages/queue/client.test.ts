import { renderHook } from '@testing-library/react-hooks'
import useQueue from '.'

describe('useQueue', () => {
  test('initalises with an empty queue', () => {
    const { result } = renderHook(() => useQueue())

    expect(result.current.size).toBe(0)
  })

  test('initalises with a populated queue', () => {
    const { result } = renderHook(() => useQueue(['a', 'b', 'c']))

    expect(result.current.size).toBe(3)
  })

  test('dequeue an item', () => {
    const { result } = renderHook(() => useQueue(['a', 'b', 'c']))

    expect(result.current.size).toBe(3)
    expect(result.current.dequeue()).toBe('a')
    expect(result.current.size).toBe(2)
    expect(result.current.peek()).toBe('b')
  })

  test('enqueue an item', () => {
    const { result } = renderHook(() => useQueue(['a', 'b', 'c']))

    expect(result.current.size).toBe(3)

    result.current.enqueue('d')

    expect(result.current.size).toBe(4)
    expect(result.current.peek()).toBe('a')
  })

  test('returns the first item in the queue', () => {
    const { result } = renderHook(() => useQueue(['a', 'b', 'c']))

    expect(result.current.size).toBe(3)
    expect(result.current.peek()).toBe('a')
    expect(result.current.size).toBe(3)
  })
})
