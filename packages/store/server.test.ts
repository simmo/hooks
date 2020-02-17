/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import createStore from '.'

describe('createStore', () => {
  describe('initial state', () => {
    test('returns default state', () => {
      const useExampleStore = createStore()
      const result = renderHookServer(() => useExampleStore())

      expect(result[0]).toBe(undefined)
    })

    test('returns provided state', () => {
      const initialState = ['a', 'b', 'c']
      const useExampleStore = createStore({ initialState })
      const result = renderHookServer(() => useExampleStore())

      expect(result[0]).toBe(initialState)
    })
  })
})
