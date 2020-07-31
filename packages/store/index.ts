import { useCallback, useEffect, useState } from 'react'
import shallowEqual from 'shallowequal'
import Store from './Store'

type StateUpdater<State> = (state?: State) => State

interface Options<State> {
  initialState?: State
}

/**
 * @param options.initialState The initial state of the store.
 */
export default function createStore<State>(options: Options<State> = {}) {
  const { initialState } = options
  const store = new Store<State>(initialState)

  return <SelectedState extends State>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selector?: (state?: SelectedState) => any
  ): [SelectedState, typeof store.setState] => {
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

    return [localState, store.setState.bind(store)]
  }
}
