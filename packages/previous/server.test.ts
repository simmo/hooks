/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import usePrevious from '.'

describe('usePrevious', () => {
  test('returns undefined', () => {
    const result = renderHookServer(() => usePrevious('test'))

    expect(result).toBeUndefined()
  })
})
