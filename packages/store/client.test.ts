import { act, renderHook } from '@testing-library/react-hooks'
import createStore from '.'

describe('createStore', () => {
  describe('initial state', () => {
    test('returns default state', () => {
      const useExampleStore = createStore()
      const {
        result: {
          current: [state],
        },
      } = renderHook(() => useExampleStore())

      expect(state).toBe(undefined)
    })

    test('returns provided state', () => {
      const initialState = ['a', 'b', 'c']
      const useExampleStore = createStore({ initialState })
      const {
        result: {
          current: [state],
        },
      } = renderHook(() => useExampleStore())

      expect(state).toBe(initialState)
    })
  })

  describe('provides basic state updater', () => {
    const initialState = ['a', 'b', 'c']
    const newState = ['c', 'b', 'a']
    const useExampleStore = createStore({ initialState })

    test('is a function', () => {
      const { result } = renderHook(() => useExampleStore())

      expect(typeof result.current[1]).toBe('function')
    })

    test('sets state', () => {
      const { result } = renderHook(() => useExampleStore())

      act(() => {
        result.current[1](newState)
      })

      expect(result.current[0]).toBe(newState)
    })

    test('updates states', () => {
      const { result } = renderHook(() => useExampleStore())

      act(() => {
        result.current[1]((prevState: []) => ['d', ...prevState])
      })

      expect(result.current[0]).toEqual(['d', ...newState])
    })
  })

  describe('custom actions', () => {
    test('returns defined actions', () => {
      const useExampleStore = createStore<string[]>({
        actions: {
          add: name => prevState => [...prevState, name],
          reset: () => () => [],
        },
        initialState: [],
      })
      const { result } = renderHook(() => useExampleStore())

      expect(Object.keys(result.current[1])).toEqual(['add', 'reset'])
    })

    test('action provides current state', () => {
      const useExampleStore = createStore<string[]>({
        actions: {
          add: name => prevState => [...prevState, name],
        },
        initialState: ['A'],
      })
      const { result } = renderHook(() => useExampleStore())

      expect(result.current[0]).toEqual(['A'])

      act(() => {
        result.current[1].add('B')
      })

      expect(result.current[0]).toEqual(['A', 'B'])
    })
  })

  describe('subscriptions', () => {
    interface State {
      name: string
      age: number
    }

    test('subscribes to updates', () => {
      const useExampleStore = createStore<State>({
        initialState: { age: 30, name: 'John' },
      })

      const a = renderHook(() => useExampleStore())
      const b = renderHook(() => useExampleStore())
      const c = renderHook(() => useExampleStore(({ age }) => ({ age })))

      const cInitial = c.result.current[0]

      expect(b.result.current[0]).toBe(a.result.current[0])

      act(() => {
        a.result.current[1]((prevState: State) => ({
          ...prevState,
          name: 'Dave',
        }))
      })

      expect(a.result.current[0]).toEqual({ age: 30, name: 'Dave' })
      expect(b.result.current[0]).toEqual({ age: 30, name: 'Dave' })
      expect(c.result.current[0]).toBe(cInitial)

      act(() => {
        a.result.current[1]((prevState: State) => ({
          ...prevState,
          age: 33,
        }))
      })

      expect(c.result.current[0]).toEqual({ age: 33 })
    })

    test('unsubscribes to updates', () => {
      const useExampleStore = createStore<State>({
        initialState: { age: 30, name: 'John' },
      })

      const a = renderHook(() => useExampleStore())
      const b = renderHook(() => useExampleStore())

      expect(b.result.current[0]).toBe(a.result.current[0])

      act(() => {
        b.unmount()

        a.result.current[1]((prevState: State) => ({
          ...prevState,
          age: 33,
        }))
      })

      expect(b.result.current[0]).not.toBe(a.result.current[0])
    })
  })
})
