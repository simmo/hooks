import { renderHook, act } from '@testing-library/react-hooks'
import useGeolocation from '.'

const positions: Position[] = [
  [52.520007, 13.404954, 1559129501234],
  [51.507351, -0.127758, 1559129601234],
  [37.774929, -122.419416, 1559129701234],
].map(([latitude, longitude, timestamp]) => ({
  coords: {
    latitude,
    longitude,
    accuracy: 1.1,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp,
}))

const lastCallOf = (mock: jest.Mock) => {
  const [{ value }] = mock.mock.results.reverse()

  return value
}

const watchPositionMock = jest.fn(
  (
    handleSuccess: Function,
    handleError: Function,
    options: PositionOptions
  ) => ({ handleSuccess, handleError, options })
)
const clearWatchMock = jest.fn()

Object.defineProperty(window.navigator, 'geolocation', {
  value: {
    watchPosition: watchPositionMock,
    clearWatch: clearWatchMock,
  },
  writable: true,
})

describe('useGeolocation', () => {
  beforeEach(() => {
    watchPositionMock.mockClear()
    clearWatchMock.mockClear()
  })

  test('returns initial null state', () => {
    const { result } = renderHook(() => useGeolocation())

    expect(result.current[0]).toBeNull()
    expect(result.current[1]).toBeNull()
  })

  test('returns current location', () => {
    const { result } = renderHook(() => useGeolocation())
    const { handleSuccess } = lastCallOf(watchPositionMock)

    act(() => {
      handleSuccess(positions[0])
    })

    expect(result.current[0]).toBe(positions[0])
    expect(result.current[1]).toBeNull()
  })

  test('passes options to watch', () => {
    const options = {
      enableHighAccuracy: true,
    }

    renderHook(() => useGeolocation(options))

    const { options: returnedOptions } = lastCallOf(watchPositionMock)

    expect(returnedOptions).toBe(options)
  })

  test('option change should invalidate effect', () => {
    const initialProps = { enableHighAccuracy: true }
    const { rerender } = renderHook(options => useGeolocation(options), {
      initialProps,
    })

    rerender(initialProps)

    expect(clearWatchMock).not.toHaveBeenCalled()

    rerender({ enableHighAccuracy: false })

    expect(clearWatchMock).toHaveBeenCalled()
  })

  test('handles a new position', () => {
    const { result } = renderHook(() => useGeolocation())
    const { handleSuccess } = lastCallOf(watchPositionMock)

    act(() => {
      handleSuccess(positions[0])
    })

    expect(result.current[0]).toBe(positions[0])

    act(() => {
      handleSuccess(positions[1])
    })

    expect(result.current[0]).toBe(positions[1])
  })

  test('handles error', () => {
    const { result } = renderHook(() => useGeolocation())
    const { handleError } = lastCallOf(watchPositionMock)
    const error = { code: 3, message: 'Timeout' }

    expect(result.current[1]).toBeNull()

    act(() => {
      handleError(error)
    })

    expect(result.current[1]).toBe(error)
  })
})
