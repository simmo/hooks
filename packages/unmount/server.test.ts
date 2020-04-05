/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useUnmount from '.'

describe('useUnmount', () => {
  test('callback is not executed', () => {
    const callback = jest.fn()

    renderHookServer(() => {
      useUnmount(callback)
    })

    expect(callback).not.toHaveBeenCalled()
  })

  test('renders without error', () => {
    const callback = jest.fn()

    const render = () =>
      renderHookServer(() => {
        useUnmount(callback)
      })

    expect(render).not.toThrow()
  })
})
