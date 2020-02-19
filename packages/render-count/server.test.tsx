/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useRenderCount from '.'

describe('useRenderCount', () => {
  test('returns initial value', () => {
    const result = renderHookServer(() => useRenderCount())

    expect(result).toBe(1)
  })
})
