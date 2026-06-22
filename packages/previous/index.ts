import { useEffect, useRef } from 'react';

/**
 * @param value The value to be returned on the next render.
 * @returns Returns the last value, undefined for initial render.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
