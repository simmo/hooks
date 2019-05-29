/**
 * @jest-environment node
 */

import renderHookServer from '../utils/renderHookServer'
import useTitle from '.'

describe('useTitle', () => {
  test('renders', () => {
    const render = () => renderHookServer(() => useTitle('Test'))

    expect(render).not.toThrow()
  })
})
