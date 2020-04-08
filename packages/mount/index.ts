import { DependencyList, EffectCallback, useEffect } from 'react'

/**
 * @param callback Function to execute.
 * @param hook Hook to use, defaults to useEffect.
 */
export default function useMount(
  callback: () => void,
  hook: (effect: EffectCallback, deps?: DependencyList) => void = useEffect
) {
  return hook(callback, [])
}
