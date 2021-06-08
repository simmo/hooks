import calcVelocity from '../calcVelocity'

describe('calcVelocity', () => {
  test('returns the expected velocity', () => {
    expect(calcVelocity({ x: -123, y: 678 }, 300)).toStrictEqual({
      x: 0.41,
      y: 2.26,
    })
  })
})
