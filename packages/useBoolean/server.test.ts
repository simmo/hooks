/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useBoolean from '.'

describe('useBoolean', () => {
  test('returns initial value', () => {
    const initialValue = true
    const [result] = renderHookServer(() => useBoolean(initialValue))

    expect(result).toBe(initialValue)
  })
})
