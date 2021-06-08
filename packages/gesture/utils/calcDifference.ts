import { Point } from './types'

export default (a: Point, b: Point): Point => ({
  x: b.x - a.x,
  y: b.y - a.y,
})
