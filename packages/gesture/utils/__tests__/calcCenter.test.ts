import calcCenter from '../calcCenter'

describe('calcCenter', () => {
  test('returns the mean average point', () => {
    expect(
      calcCenter([
        { x: 3, y: 2 },
        { x: 123, y: 10 },
        { x: 7, y: 2 },
      ])
    ).toStrictEqual({ x: 44, y: 5 })
  })
})
