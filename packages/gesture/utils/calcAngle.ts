import { Point } from './types'
import calcDifference from './calcDifference'

export default (a: Point, b: Point) => {
  const { x, y } = calcDifference(a, b)

  return (Math.atan2(y, x) * 180) / Math.PI
}
