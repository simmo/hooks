/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useRaf from '.'

describe('useRaf', () => {
  test('renders with error', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      return null
    })
    const callback = jest.fn().mockName('mock callback')

    renderHookServer(() => useRaf(callback))

    expect(errorSpy).toHaveBeenCalled()
    expect(callback).not.toHaveBeenCalled()
  })
})
