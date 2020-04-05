import { renderHook } from '@testing-library/react-hooks'
import useStack from '.'
import Stack from './Stack'

describe('useStack', () => {
  test('initalises with an empty stack', () => {
    const { result } = renderHook(() => useStack())

    expect(result.current).toBeInstanceOf(Stack)
    expect(result.current.size).toBe(0)
  })

  test('initalises with a populated stack', () => {
    const { result } = renderHook(() => useStack(['a', 'b', 'c']))

    expect(result.current).toBeInstanceOf(Stack)
    expect(result.current.size).toBe(3)
  })
})
