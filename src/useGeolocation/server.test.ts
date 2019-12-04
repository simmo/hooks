/**
 * @jest-environment node
 */

import renderHookServer from '../utils/renderHookServer'
import useGeolocation from '.'

describe('useGeolocation', () => {
  test('should render', () => {
    const result = renderHookServer(() => useGeolocation())

    expect(result[0]).toBeNull()
    expect(result[1]).toBeNull()
  })
})
