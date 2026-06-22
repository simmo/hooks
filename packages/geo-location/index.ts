import { useEffect, useState } from 'react';

/**
 * @param options Passes PositionOptions through to the geolocation API - https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
 * @returns Returns an array containing the position and any position error.
 */
export function useGeoLocation(
  options?: PositionOptions,
): [GeolocationPosition | null, GeolocationPositionError | null] {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  useEffect(() => {
    const handleSuccess: PositionCallback = newPosition => {
      setPosition(newPosition);
      setError(null);
    };
    const handleError: PositionErrorCallback = error => {
      setError(error);
    };

    const id = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options,
    );

    return () => {
      navigator.geolocation.clearWatch(id);
    };
  }, [options]);

  return [position, error];
}
