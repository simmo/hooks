import { renderHook } from '@testing-library/react-hooks'
import useTitle from '.'

describe('useTitle', () => {
  test('updates the title', () => {
    const newTitle = 'Test'

    renderHook(() => useTitle(newTitle))

    expect(document.title).toBe(newTitle)
  })
})
