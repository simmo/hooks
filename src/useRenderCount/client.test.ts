import { useState, useEffect } from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import useRenderCount from '.'

describe('useRenderCount', () => {
  test('returns initial value', () => {
    const { result } = renderHook(() => useRenderCount())

    expect(result.current).toBe(1)
  })

  test('increments count', () => {
    const { result } = renderHook(() => {
      const [, setState] = useState(true)

      useEffect(() => {
        setTimeout(() => {
          setState(true)
        }, 500)
        setTimeout(() => {
          setState(true)
        }, 700)
        setTimeout(() => {
          setState(false)
        }, 1000)
      }, [])

      return useRenderCount()
    })

    expect(result.current).toBe(1)

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe(1)

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe(2)
  })
})
