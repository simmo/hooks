import calcDirection from '../calcDirection'
import { Direction } from '../types'

describe('calcDirection', () => {
  test.each([
    ['none', Direction.None, { x: 100, y: 10 }, { x: 100, y: 10 }],
    ['left', Direction.Left, { x: 50, y: 100 }, { x: 0, y: 80 }],
    ['right', Direction.Right, { x: 0, y: 80 }, { x: 50, y: 100 }],
    ['up', Direction.Up, { x: 50, y: 100 }, { x: 80, y: 50 }],
    ['down', Direction.Down, { x: 50, y: 50 }, { x: 80, y: 100 }],
  ])('returns %s', (text, direction, a, b) => {
    expect(calcDirection(a, b)).toBe(direction)
  })
})
