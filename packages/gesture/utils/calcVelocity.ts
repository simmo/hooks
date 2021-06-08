import { Point } from './types'

export default ({ x, y }: Point, time: number) => ({
  x: Math.abs(x) / time,
  y: Math.abs(y) / time,
})
