import { act, renderHook } from '@testing-library/react-hooks'
import useMediaQuery from '.'

describe('useMediaQuery', () => {
  const addListener = jest.fn()
  const removeListener = jest.fn()

  if ('window' in global) {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      addListener,
      matches: false,
      media: query,
      onchange: null,
      removeListener,
    }))
  }

  afterEach(() => {
    addListener.mockClear()
    removeListener.mockClear()
  })

  test('returns the current match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 300px)'))

    expect(result.current).toBe(false)
  })

  test('listens for changes', () => {
    renderHook(() => useMediaQuery('(min-width: 300px)'))

    expect(addListener).toBeCalled()
  })

  test('responds to changes', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 300px)'))

    act(() => {
      addListener.mock.calls[0][0]({ matches: true })
    })

    expect(result.current).toBe(true)

    act(() => {
      addListener.mock.calls[0][0]({ matches: true })
    })

    expect(result.current).toBe(true)
  })

  test('removes the listener', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 300px)'))

    unmount()

    expect(removeListener).toBeCalled()
  })
})
