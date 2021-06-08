export interface Point {
  x: number
  y: number
}

export enum Direction {
  None = 1,
  Left = 2,
  Right = 4,
  Horizontal = 6,
  Up = 8,
  Down = 16,
  Vertical = 24,
  All = 30,
}

export enum InputType {
  Start = 1,
  Move = 2,
  End = 4,
  Cancel = 8,
}

export enum GestureType {
  Hold = 'hold',
  Pan = 'pan',
  Pinch = 'pinch',
  Swipe = 'swipe',
  Tap = 'tap',
}

export interface Pointer {
  id: number
  initialPosition: Point
  isPrimary: boolean
  position: Point
  type: string
}

export interface Interval {
  angle: number
  center: Point
  delta: Point & { time: number }
  direction: Direction
  distance: number
  rotation: number
  scale: number
  time: number
  velocity: Point
}

export interface GestureEvent extends Interval {
  type: InputType
  pointers: Pointer[]
}
