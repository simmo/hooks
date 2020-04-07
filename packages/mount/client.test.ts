import { renderHook } from '@testing-library/react-hooks'
import useMount from '.'

describe('useMount', () => {
  test('executes callback on initial render only', () => {
    const callback = jest.fn()

    const { rerender } = renderHook(() => {
      useMount(callback)
    })

    expect(callback).toHaveBeenCalledTimes(1)

    rerender()

    expect(callback).toHaveBeenCalledTimes(1)

    rerender()

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
