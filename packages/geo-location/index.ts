import { useEffect, useState } from 'react'

export default function useGeoLocation(
  options?: PositionOptions
): [Position, PositionError] {
  const [position, setPosition] = useState<Position>(null)
  const [error, setError] = useState<PositionError>(null)

  useEffect(() => {
    const handleSuccess = (newPosition: Position) => {
      setPosition(newPosition)
      setError(null)
    }
    const handleError = (error: PositionError) => {
      setError(error)
    }

    const id = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    )

    return () => {
      navigator.geolocation.clearWatch(id)
    }
  }, [options])

  return [position, error]
}
