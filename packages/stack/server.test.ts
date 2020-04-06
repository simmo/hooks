/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useStack from '.'
import Stack from './Stack'

describe('useStack', () => {
  test('initalises with an empty stack', () => {
    const result = renderHookServer(() => useStack())

    expect(result).toBeInstanceOf(Stack)
    expect(result.size).toBe(0)
  })

  test('initalises with a populated stack', () => {
    const result = renderHookServer(() => useStack(['a', 'b', 'c']))

    expect(result).toBeInstanceOf(Stack)
    expect(result.size).toBe(3)
  })
})
