import { act, renderHook } from 'react-hooks-testing-library'
import useMediaQuery from '.'

describe('useMediaQuery', () => {
  const addListener = jest.fn()
  const removeListener = jest.fn()

  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener,
    removeListener,
  }))

  const { result, unmount } = renderHook(() =>
    useMediaQuery('(min-width: 300px)')
  )

  test('returns the current match', () => {
    expect(result.current).toBe(false)
  })

  test('listens for changes', () => {
    expect(addListener).toBeCalled()
  })

  test('responds to changes', () => {
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
    unmount()

    expect(removeListener).toBeCalled()
  })
})
