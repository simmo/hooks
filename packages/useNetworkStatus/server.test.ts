/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useNetworkStatus from '.'

describe('useNetworkStatus', () => {
  test('returns undefined', () => {
    const result = renderHookServer(() => useNetworkStatus())

    expect(result).toEqual({ online: undefined })
  })
})
