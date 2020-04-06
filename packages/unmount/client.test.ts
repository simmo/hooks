import { renderHook } from '@testing-library/react-hooks'
import useUnmount from '.'

describe('useUnmount', () => {
  test('executes callback on unmount', () => {
    const callback = jest.fn()

    const { unmount } = renderHook(() => {
      useUnmount(callback)
    })

    expect(callback).not.toHaveBeenCalled()

    unmount()

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
