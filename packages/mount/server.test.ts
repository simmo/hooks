/**
 * @jest-environment node
 */

import renderHookServer from '../../utils/renderHookServer'
import useMount from '.'

describe('useMount', () => {
  test('callback is not executed', () => {
    const callback = jest.fn()

    renderHookServer(() => {
      useMount(callback)
    })

    expect(callback).not.toHaveBeenCalled()
  })

  test('renders without error', () => {
    const callback = jest.fn()

    const render = () =>
      renderHookServer(() => {
        useMount(callback)
      })

    expect(render).not.toThrow()
  })
})
