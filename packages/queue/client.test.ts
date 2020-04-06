import { renderHook } from '@testing-library/react-hooks'
import useQueue from '.'
import Queue from './Queue'

describe('useQueue', () => {
  test('initalises with an empty queue', () => {
    const { result } = renderHook(() => useQueue())

    expect(result.current).toBeInstanceOf(Queue)
    expect(result.current.size).toBe(0)
  })

  test('initalises with a populated queue', () => {
    const { result } = renderHook(() => useQueue(['a', 'b', 'c']))

    expect(result.current).toBeInstanceOf(Queue)
    expect(result.current.size).toBe(3)
  })
})
