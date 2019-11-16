import { act, renderHook } from '@testing-library/react-hooks'
import useBoolean from '.'

describe('useBoolean', () => {
  test('returns initial value', () => {
    const { result } = renderHook(() => useBoolean(true))

    expect(result.current[0]).toBe(true)
  })

  test('updates value', () => {
    const { result } = renderHook(() => useBoolean(true))

    act(() => {
      result.current[1](false)
    })

    expect(result.current[0]).toBe(false)
  })

  test('toggles value', () => {
    const { result } = renderHook(() => useBoolean(true))

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(true)
  })
})
