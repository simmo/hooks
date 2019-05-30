import { renderHook } from 'react-hooks-testing-library'
import useTimeout from '.'

describe('useTimeout', () => {
  const callback = jest.fn().mockName('mock callback')
  const { rerender } = renderHook(delay => useTimeout(callback, delay), {
    initialProps: 500,
  })

  afterEach(() => {
    callback.mockClear()
  })

  test('executes callback after delay', () => {
    expect(callback).not.toBeCalled()

    jest.advanceTimersByTime(500)

    expect(callback).toBeCalled()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('cancels timeout if no delay', () => {
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
