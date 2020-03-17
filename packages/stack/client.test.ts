import { renderHook } from '@testing-library/react-hooks'
import useStack from '.'

describe('useStack', () => {
  test('initalises with an empty stack', () => {
    const { result } = renderHook(() => useStack())

    expect(result.current.size).toBe(0)
  })

  test('initalises with a populated stack', () => {
    const { result } = renderHook(() => useStack(['a', 'b', 'c']))

    expect(result.current.size).toBe(3)
  })

  test('removes and returns the item from the top of the stack', () => {
    const { result } = renderHook(() => useStack(['a', 'b', 'c']))

    expect(result.current.size).toBe(3)
    expect(result.current.pop()).toBe('c')
    expect(result.current.size).toBe(2)
    expect(result.current.peek()).toBe('b')
  })

  test('adds the item to the top of the stack', () => {
    const { result } = renderHook(() => useStack(['a', 'b', 'c']))

    expect(result.current.size).toBe(3)

    result.current.push('d')

    expect(result.current.size).toBe(4)
    expect(result.current.peek()).toBe('d')
  })

  test('returns the item at the top of the stack', () => {
    const { result } = renderHook(() => useStack(['a', 'b', 'c']))

    expect(result.current.size).toBe(3)
    expect(result.current.peek()).toBe('c')
    expect(result.current.size).toBe(3)
  })
})
