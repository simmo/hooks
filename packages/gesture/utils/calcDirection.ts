import { Direction, Point } from './types'
import calcDifference from './calcDifference'

export default (a: Point, b: Point) => {
  const { x, y } = calcDifference(a, b)

  if (x === y) return Direction.None

  if (Math.abs(x) >= Math.abs(y)) {
    return x < 0 ? Direction.Left : Direction.Right
  }

  return y < 0 ? Direction.Up : Direction.Down
}
