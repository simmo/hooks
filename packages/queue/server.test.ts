/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useQueue from '.'
import Queue from './Queue'

describe('useQueue', () => {
  test('initalises with an empty queue', () => {
    const result = renderHookServer(() => useQueue())

    expect(result).toBeInstanceOf(Queue)
    expect(result.size).toBe(0)
  })

  test('initalises with a populated queue', () => {
    const result = renderHookServer(() => useQueue(['a', 'b', 'c']))

    expect(result).toBeInstanceOf(Queue)
    expect(result.size).toBe(3)
  })
})
