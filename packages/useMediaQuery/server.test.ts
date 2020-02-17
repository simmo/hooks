/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useMediaQuery from '.'

describe('useMediaQuery', () => {
  const testQuery = '(min-width: 300px)'

  test('uses a default fallback', () => {
    const result = renderHookServer(() => useMediaQuery(testQuery))

    expect(result).toBe(false)
  })

  test('uses a specific fallback', () => {
    const result = renderHookServer(() => useMediaQuery(testQuery, true))

    expect(result).toBe(true)
  })
})
