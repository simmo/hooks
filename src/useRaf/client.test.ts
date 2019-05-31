import { renderHook } from 'react-hooks-testing-library'
import useRaf from '.'

describe('useRaf', () => {
  const mockedTimestamp = 123456
  const requestAnimationFrameSpy = jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation(tick => {
      tick(mockedTimestamp)
      return mockedTimestamp
    })
  const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame')

  beforeEach(() => {
    requestAnimationFrameSpy.mockClear()
    cancelAnimationFrameSpy.mockClear()
  })

  test('registers raf callback', () => {
    renderHook(() => useRaf(() => {}))

    expect(requestAnimationFrameSpy).toHaveBeenCalled()
  })

  test('executes callback', () => {
    const callback = jest.fn()

    renderHook(() => useRaf(callback, []))

    expect(callback).toHaveBeenCalledWith(mockedTimestamp)
  })

  test('only calls callback when dependencies change', () => {
    const callback = jest.fn()
    const { rerender } = renderHook(({ deps }) => useRaf(callback, deps), {
      initialProps: { deps: [true] },
    })

    rerender({ deps: [false] })
    rerender({ deps: [true] })
    rerender({ deps: [true] })
    rerender({ deps: [false] })

    expect(callback).toHaveBeenCalledTimes(4)
  })

  test('updates callback', () => {
    const firstCallback = jest.fn()
    const secondCallback = jest.fn()
    const { rerender } = renderHook(
      ({ callback, deps }) => useRaf(callback, deps),
      {
        initialProps: { callback: firstCallback, deps: [true] },
      }
    )

    rerender({ callback: secondCallback, deps: [true] })
    expect(secondCallback).not.toHaveBeenCalled()

    rerender({ callback: secondCallback, deps: [false] })
    expect(secondCallback).toHaveBeenCalled()
  })

  test('cancels raf callback', () => {
    const { unmount } = renderHook(() => useRaf(() => {}))

    unmount()

    expect(cancelAnimationFrame).toHaveBeenCalled()
  })

  // test('executes callback when request animation frame is called', () => {
  //   const callback = (timeElapsed: number) => timeElapsed
  //   const mockedTimes = [1000, 2000]

  //   const { rerender } = renderHook(deps => useRaf(callback, deps), {
  //     initialProps: [1],
  //   })

  //   rerender([2])

  //   console.log(
  //     requestAnimationFrameSpy.mock.calls.map(([callback], index) =>
  //       callback(mockedTimes[index])
  //     )
  //   )

  //   expect(callback).toHaveBeenCalled()
  // })
})

// const callback = jest.fn()
// const { rerender } = renderHook(deps => useRaf(callback, deps), {
//   initialProps: [true],
// })

// test('executes callback after delay', () => {
//   expect(callback).not.toBeCalled()

//   jest.advanceTimersByTime(1000)

//   expect(callback).toBeCalled()
//   expect(callback).toHaveBeenCalledTimes(2)
// })

// test('pauses interval if no delay', () => {
//   rerender([false])
//   jest.advanceTimersByTime(500)
//   expect(callback).toHaveBeenCalledTimes(2)
//   rerender([true])
//   jest.advanceTimersByTime(500)
//   expect(callback).toHaveBeenCalledTimes(3)
// })
