import { useRef, useEffect } from 'react'
import useGestureEvent, { GestureOptions } from '../utils/useGestureEvent'
import { GestureType, Interval, InputType } from '../utils/types'

export type Options = GestureOptions & {
  pointers?: number
  threshold?: number
  time?: number
}

export interface HoldGesture extends Interval {
  type: GestureType.Hold
}

/**
 * @param callback Executed when the hold gesture is recognised
 * @param options.ref HTMLElement or React reference
 * @param options.pointers Number or pointer required
 * @param options.threshold Allowed movement while held
 * @param options.time Number of milliseconds before hold is recognised
 */
export default function useHold(
  callback: (event: HoldGesture) => void,
  { ref, pointers = 1, threshold = 10, time = 250 }: Options
) {
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(timer.current), [])

  useGestureEvent(
    event => {
      clearTimeout(timer.current)

      if (
        event.type & (InputType.Start | InputType.Move) &&
        event.pointers.length === pointers &&
        event.distance < threshold &&
        event.delta.time < time
      ) {
        timer.current = setTimeout(() => {
          callback({ ...event, type: GestureType.Hold })
        }, time)
      }
    },
    { ref }
  )
}
