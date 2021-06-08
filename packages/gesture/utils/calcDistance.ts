import { Point } from './types'
import calcDifference from './calcDifference'

export default (a: Point, b: Point) => {
  const { x, y } = calcDifference(a, b)

  return Math.sqrt(x * x + y * y)
}
