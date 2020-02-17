/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useGeoLocation from '.'

describe('useGeoLocation', () => {
  test('should render', () => {
    const result = renderHookServer(() => useGeoLocation())

    expect(result[0]).toBeNull()
    expect(result[1]).toBeNull()
  })
})
