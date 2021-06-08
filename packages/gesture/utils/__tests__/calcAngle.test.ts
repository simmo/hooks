import calcAngle from '../calcAngle'

describe('calcAngle', () => {
  test.each([
    [0, { x: 0, y: 0 }, { x: 0, y: 0 }],
    [45, { x: 0, y: 0 }, { x: 20, y: 20 }],
    [90, { x: 0, y: 0 }, { x: 0, y: 20 }],
    [180, { x: 0, y: 0 }, { x: -20, y: 0 }],
  ])('returns %s° angle', (angle, a, b) => {
    expect(calcAngle(a, b)).toBe(angle)
  })
})
