import calcScale from '../calcScale'

describe('calcScale', () => {
  test('returns the distance between two points', () => {
    const pointerA = {
      id: 1,
      initialPosition: { x: 100, y: 100 },
      isPrimary: true,
      position: { x: 200, y: 200 },
      type: 'touch',
    }
    const pointerB = {
      id: 2,
      initialPosition: { x: 333, y: 333 },
      isPrimary: false,
      position: { x: 600, y: 600 },
      type: 'touch',
    }

    expect(calcScale([pointerA, pointerB])).toBe(1.7167381974248928)
  })
})
