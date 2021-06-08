import { RefObject, useEffect, useRef } from 'react'

import cache from './cache'
import { GestureEvent } from './types'
import Session from './Session'

export interface GestureOptions {
  ref?: RefObject<HTMLElement> | HTMLElement
}

export default function useGestureEvent(
  callback: (event: GestureEvent) => void,
  { ref = document.body }: GestureOptions
) {
  const callbackRef = useRef(callback)
  const session = useRef<Session>()

  callbackRef.current = callback

  useEffect(() => {
    const node = (ref as RefObject<HTMLElement>).current || (ref as HTMLElement)

    session.current = cache.find(item => item.isNode(node))

    if (!session.current) {
      session.current = new Session(node)

      cache.push(session.current)
    }

    return session.current.subscribe(event => callbackRef.current(event))
  }, [ref])
}
