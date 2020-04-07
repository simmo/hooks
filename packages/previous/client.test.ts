import { renderHook } from '@testing-library/react-hooks'
import usePrevious from '.'

describe('usePrevious', () => {
  test('returns value from last render', () => {
    const initialValue = 'a'
    const { rerender, result } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: initialValue },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: 'b' })

    expect(result.current).toBe('a')

    rerender({ value: 'c' })

    expect(result.current).toBe('b')
  })
})
