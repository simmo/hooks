import * as exportedHooks from '.'

const expectedHooks = ['useHold', 'usePan', 'usePinch', 'useSwipe', 'useTap']

describe.each(Object.entries(exportedHooks))('%s', (key, value) => {
  test('export is expected', () => {
    expect(expectedHooks).toContain(key)
  })

  test('export is a function', () => {
    expect(value).toBeInstanceOf(Function)
  })

  test('follows hook naming convention', () => {
    expect(key.startsWith('use')).toBeTruthy()
    expect(key[3] == key[3].toUpperCase()).toBeTruthy()
  })
})
