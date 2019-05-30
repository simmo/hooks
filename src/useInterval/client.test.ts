import { renderHook } from 'react-hooks-testing-library'
import useInterval from '.'

describe('useInterval', () => {
  const callback = jest.fn().mockName('mock callback')
  const { rerender } = renderHook(interval => useInterval(callback, interval), {
    initialProps: 500,
  })

  afterEach(() => {
    callback.mockClear()
  })

  test('executes callback after delay', () => {
    expect(callback).not.toBeCalled()

    jest.advanceTimersByTime(1000)

    expect(callback).toBeCalled()
    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('pauses interval if no delay', () => {
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
