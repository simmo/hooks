import { renderHook } from '@testing-library/react-hooks'
import useTimeout from '.'

describe('useTimeout', () => {
  const callback = jest.fn().mockName('mock callback')

  afterEach(() => {
    callback.mockClear()
  })

  test('executes callback after delay', () => {
    renderHook(delay => useTimeout(callback, delay), {
      initialProps: 500,
    })

    expect(callback).not.toBeCalled()

    jest.advanceTimersByTime(500)

    expect(callback).toBeCalled()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('cancels timeout if no delay', () => {
    const { rerender } = renderHook(delay => useTimeout(callback, delay), {
      initialProps: 500,
    })

    expect(callback).not.toBeCalled()

    rerender(null)
    jest.advanceTimersByTime(500)

    expect(callback).not.toBeCalled()

    rerender(500)
    jest.advanceTimersByTime(500)

    expect(callback).toBeCalled()
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
