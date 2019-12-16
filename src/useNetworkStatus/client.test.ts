import { renderHook } from '@testing-library/react-hooks'
import useNetworkStatus from '.'

const addEventListener = jest.spyOn(window, 'addEventListener')
const removeEventListener = jest.spyOn(window, 'removeEventListener')

describe('useNetworkStatus', () => {
  beforeEach(() => {
    addEventListener.mockClear()
    removeEventListener.mockClear()
  })

  test('online undefined', () => {
    Object.defineProperty(window, 'navigator', {
      value: {},
      writable: true,
    })

    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current).toEqual({ online: undefined })
  })

  test('online is true', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true,
    })

    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current).toEqual({ online: true })
  })

  test('online is false', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true,
    })

    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current).toEqual({ online: false })
  })

  test('adds listeners', () => {
    renderHook(() => useNetworkStatus())

    const onlineEvents = addEventListener.mock.calls.filter(
      ([call]) => call === 'online'
    )
    const offlineEvents = addEventListener.mock.calls.filter(
      ([call]) => call === 'offline'
    )

    expect(onlineEvents.length).toBe(1)
    expect(offlineEvents.length).toBe(1)
  })

  test('removes listeners', () => {
    const { unmount } = renderHook(() => useNetworkStatus())

    unmount()

    const onlineEvents = removeEventListener.mock.calls.filter(
      ([call]) => call === 'online'
    )
    const offlineEvents = removeEventListener.mock.calls.filter(
      ([call]) => call === 'offline'
    )

    expect(onlineEvents.length).toBe(1)
    expect(offlineEvents.length).toBe(1)
  })
})
