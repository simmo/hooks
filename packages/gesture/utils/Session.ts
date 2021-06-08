import { Direction, GestureEvent, Interval, Pointer, InputType } from './types'
import calcAngle from './calcAngle'
import calcCenter from './calcCenter'
import calcDifference from './calcDifference'
import calcDirection from './calcDirection'
import calcDistance from './calcDistance'
import calcRotation from './calcRotation'
import calcScale from './calcScale'
import calcVelocity from './calcVelocity'

type Listener = (event: GestureEvent) => void

export default class Session {
  private listeners: Listener[] = []
  private node: HTMLElement
  private firstInterval: Interval | null = null
  private interval: Interval | null = null
  private pointers: Pointer[] = []

  constructor(node: HTMLElement) {
    this.node = node
    this.handleStart = this.handleStart.bind(this)
    this.handleMove = this.handleMove.bind(this)
    this.handleEnd = this.handleEnd.bind(this)
  }

  public isNode(node: HTMLElement) {
    return this.node === node
  }

  private update(pointers: Pointer[]) {
    const center = calcCenter(pointers.map(({ position }) => position))
    const time = Date.now()
    const previous = this.interval

    if (previous && this.firstInterval) {
      // Calculate how much the pointers have move since the last interval
      const difference = calcDifference(previous.center, center)
      const delta = { ...difference, time: time - previous.time }
      const isMultiTouch = this.pointers.length > 1 && pointers.length > 1

      this.interval = {
        angle: calcAngle(this.firstInterval.center, center),
        center,
        delta,
        direction: calcDirection(previous.center, center),
        distance: calcDistance(this.firstInterval.center, center),
        rotation: isMultiTouch ? calcRotation(pointers) : 0,
        scale: isMultiTouch ? calcScale(pointers) : 1,
        time,
        velocity: calcVelocity(difference, delta.time),
      }
    } else {
      this.interval = {
        angle: 0,
        center,
        delta: { time: 0, x: 0, y: 0 },
        direction: Direction.None,
        distance: 0,
        rotation: 0,
        scale: 1,
        time,
        velocity: { x: 0, y: 0 },
      }

      this.firstInterval = this.interval
    }

    this.pointers = pointers
  }

  private createPointer({
    pointerId: id,
    clientX: x,
    clientY: y,
    isPrimary,
    pointerType: type,
  }: PointerEvent): Omit<Pointer, 'initialPosition'> {
    return { id, isPrimary, position: { x, y }, type }
  }

  private handleStart(event: PointerEvent) {
    // Add pointer
    const newPointer = this.createPointer(event)
    this.update([
      ...this.pointers,
      { ...newPointer, initialPosition: newPointer.position },
    ])

    // Update subscribers
    this.emitEvent(InputType.Start)
  }

  private handleMove(event: PointerEvent) {
    if (this.pointers.length === 0) return

    event.preventDefault()

    // Update pointer
    this.update(
      this.pointers.map(pointer =>
        pointer.id === event.pointerId
          ? {
              ...pointer,
              ...this.createPointer(event),
            }
          : pointer
      )
    )

    // Update subscribers
    this.emitEvent(InputType.Move)
  }

  private handleEnd() {
    if (this.pointers.length === 0) return

    this.emitEvent(InputType.End)

    this.pointers = []
    this.firstInterval = null
    this.interval = null
  }

  private emitEvent(type: InputType) {
    if (!this.interval) return

    const event: GestureEvent = {
      pointers: this.pointers,
      type,
      ...this.interval,
    }

    this.listeners.forEach(handler => handler(event))
  }

  private addEventListeners() {
    // TODO: Use options arg to set this intelligently
    // see https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
    this.node.style.touchAction = 'none'

    this.node.addEventListener('pointerdown', this.handleStart, false)
    this.node.addEventListener('pointermove', this.handleMove, false)
    this.node.addEventListener('pointerup', this.handleEnd, false)
    this.node.addEventListener('pointercancel', this.handleEnd, false)
    this.node.addEventListener('pointerout', this.handleEnd, false)
  }

  private removeEventListeners() {
    this.node.removeEventListener('pointerdown', this.handleStart)
    this.node.removeEventListener('pointermove', this.handleMove)
    this.node.removeEventListener('pointerup', this.handleEnd)
    this.node.removeEventListener('pointercancel', this.handleEnd)
    this.node.removeEventListener('pointerout', this.handleEnd)
  }

  public subscribe(handler: Listener) {
    if (this.listeners.length === 0) {
      this.addEventListeners()
    }

    // Subscribe - add handler
    this.listeners.push(handler)

    // Unsubscribe
    return () => {
      // Remove listener
      this.listeners = this.listeners.filter(item => item !== handler)

      // Clean up if there are no listeners
      if (this.listeners.length === 0) {
        this.removeEventListeners()
      }
    }
  }
}
