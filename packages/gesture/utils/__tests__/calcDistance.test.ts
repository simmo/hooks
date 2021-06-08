import calcDistance from '../calcDistance'

describe('calcDistance', () => {
  test('returns the distance between two points', () => {
    const a = { x: 100, y: 200 }
    const b = { x: 150, y: 300 }

    expect(calcDistance(a, b)).toBe(111.80339887498948)
  })
})
