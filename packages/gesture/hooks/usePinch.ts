import useGestureEvent, { GestureOptions } from '../utils/useGestureEvent'
import { GestureType, Interval, InputType } from '../utils/types'

export type Options = GestureOptions & {
  pointers?: number
  threshold?: number
}

export interface PinchGesture extends Interval {
  type: GestureType.Pinch
}

export default function usePinch<PinchOptions>(
  callback: (event: PinchGesture) => void,
  { ref, pointers = 2, threshold = 10 }: Options
) {
  useGestureEvent(
    event => {
      if (pointers < 2) {
        console.warn(
          'You need at least 2 points are required to match a pinch.'
        )
        pointers = 2
      }

      if (
        event.type & InputType.Move &&
        event.pointers.length === pointers &&
        event.scale > threshold
      ) {
        callback({ ...event, type: GestureType.Pinch })
      }
    },
    { ref }
  )
}
