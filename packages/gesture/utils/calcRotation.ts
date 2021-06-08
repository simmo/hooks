import { Pointer } from './types'
import calcAngle from './calcAngle'

export default function getRotation([first, second]: Pointer[]) {
  return (
    calcAngle(second.position, first.position) +
    calcAngle(second.initialPosition, first.initialPosition)
  )
}
