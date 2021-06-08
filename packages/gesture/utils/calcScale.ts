import { Pointer } from './types'
import calcDistance from './calcDistance'

export default function calcScale([first, second]: Pointer[]) {
  return (
    calcDistance(first.position, second.position) /
    calcDistance(first.initialPosition, second.initialPosition)
  )
}
