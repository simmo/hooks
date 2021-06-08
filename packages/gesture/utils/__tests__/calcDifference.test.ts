import calcDifference from '../calcDifference'

describe('calcDifference', () => {
  test('returns the differecnce netween two points', () => {
    const a = { x: 10, y: 20 }
    const b = { x: 20, y: 200 }

    expect(calcDifference(a, b)).toStrictEqual({
      x: 10,
      y: 180,
    })
  })
})
