import { Point } from './types'

export default (points: Point[]): Point => {
  const count = points.length

  if (count === 1) {
    const [point] = points

    return {
      x: Math.round(point.x),
      y: Math.round(point.y),
    }
  }

  const sum = { x: 0, y: 0 }

  for (let i = 0; i < points.length; i++) {
    const { x, y } = points[i]

    sum.x += x
    sum.y += y
  }

  return {
    x: Math.round(sum.x / count),
    y: Math.round(sum.y / count),
  }
}
