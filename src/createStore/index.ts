import { useCallback, useEffect, useState } from 'react'
import * as shallowEqual from 'shallowequal'
import Store from './Store'

type StateUpdater<State> = (state?: State) => State

interface Options<State> {
  actions?: {
    [action: string]: (...args: any) => StateUpdater<State>
  }
  initialState?: State
}

export default function createStore<State>({
  actions,
  initialState,
}: Options<State> = {}) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <SelectedState extends State>(
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
