/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useTimeout from '.'

describe('useTimeout', () => {
  test('should render', () => {
    const callback = jest.fn().mockName('mock callback')

    renderHookServer(() => useTimeout(callback, 1000))

    expect(callback).not.toHaveBeenCalled()
  })
})
