import useGestureEvent, { GestureOptions } from '../utils/useGestureEvent'
import { Direction, Interval, GestureType, InputType } from '../utils/types'

export type Options = GestureOptions & {
  direction?: Direction
  pointers?: number
  threshold?: number
  velocity?: number
}

export interface SwipeGesture extends Interval {
  type: GestureType.Swipe
}

export default function useSwipe(
  callback: (event: SwipeGesture) => void,
  {
    ref,
    direction = Direction.All,
    pointers = 1,
    threshold = 10,
    velocity = 0.3,
  }: Options
) {
  useGestureEvent(
    event => {
      let eventVelocity

      if (direction === Direction.All) {
        eventVelocity = Math.max(event.velocity.x, event.velocity.y)
      } else if (direction & Direction.Horizontal) {
        eventVelocity = event.velocity.x
      } else if (direction & Direction.Vertical) {
        eventVelocity = event.velocity.y
      }

      if (
        event.type & InputType.End &&
        event.pointers.length === pointers &&
        event.direction & direction &&
        event.distance > threshold &&
        typeof eventVelocity !== 'undefined' &&
        eventVelocity > velocity
      )
        callback({ ...event, type: GestureType.Swipe })
    },
    { ref }
  )
}
