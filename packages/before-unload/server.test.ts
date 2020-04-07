/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useBeforeUnload from '.'

describe('useBeforeUnload', () => {
  test('renders without error', () => {
    const result = () =>
      renderHookServer(() => useBeforeUnload('Do you want to save?'))

    expect(result).not.toThrow()
  })
})
