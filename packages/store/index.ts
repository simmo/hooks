import { useCallback, useEffect, useState } from 'react'
import shallowEqual from 'shallowequal'
import Store from './Store'

type StateUpdater<State> = (state?: State) => State

interface Options<State> {
  actions?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [action: string]: (...args: any) => StateUpdater<State>
  }
  initialState?: State
}

/**
 * @param options.actions An object of state update functions.
 * @param options.initialState The initial state of the store.
 */
export default function createStore<State>(options: Options<State> = {}) {
  const { actions, initialState } = options
  const store = new Store<State>(initialState)

  const boundActions = actions
    ? Object.entries(actions).reduce(
        (acc, [action, fn]) => ({
          ...acc,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [action]: (...args: any) => {
            store.setState(fn(...args))
          },
        }),
        {}
      )
    : store.setState.bind(store)

  return <SelectedState extends State>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selector?: (state?: SelectedState) => any
  ) => {
    const calculateState = useCallback(
      newValue => (selector ? selector(newValue) : newValue),
      [selector]
    )
    const [localState, setLocalState] = useState(
      calculateState(store.getState())
    )

    useEffect(
      () =>
        store.subscribe(newValue => {
          const selectedValue = calculateState(newValue)

          if (!shallowEqual(localState, selectedValue)) {
            setLocalState(selectedValue)
          }
        }),
      [calculateState, localState]
    )

    return [localState, boundActions]
  }
}
