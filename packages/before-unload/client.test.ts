import { renderHook } from '@testing-library/react-hooks'
import useBeforeUnload from '.'

const addEventListener = jest.spyOn(window, 'addEventListener')
const removeEventListener = jest.spyOn(window, 'removeEventListener')
const unloadMessage = 'Do you want to save?'

const beforeUnloadEvent = 'beforeunload'

interface ExampleEvent {
  preventDefault: jest.Mock<any, any>
  returnValue?: string
}

const exampleEvent: ExampleEvent = {
  preventDefault: jest.fn(),
  returnValue: undefined,
}

describe('useBeforeUnload', () => {
  beforeEach(() => {
    addEventListener.mockClear()
    removeEventListener.mockClear()
  })

  test('adds listener', () => {
    renderHook(() => useBeforeUnload(unloadMessage))

    const unloadEvents = addEventListener.mock.calls.filter(
      ([event]) => event === beforeUnloadEvent
    )

    expect(unloadEvents.length).toBe(1)

    const handler = unloadEvents[0][1] as Function
    const handlerReturn = handler(exampleEvent)

    expect(handlerReturn).toBe(unloadMessage)
    expect(exampleEvent.returnValue).toBe(unloadMessage)
    expect(exampleEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  test('removes listener', () => {
    const { unmount } = renderHook(() => useBeforeUnload(unloadMessage))

    unmount()

    const unloadEvents = removeEventListener.mock.calls.filter(
      ([event]) => event === beforeUnloadEvent
    )

    expect(unloadEvents.length).toBe(1)
  })

  test('does not add/remove listener when no message provided', () => {
    const { unmount } = renderHook(() => useBeforeUnload())

    const addedUnloadEvents = addEventListener.mock.calls.filter(
      ([event]) => event === beforeUnloadEvent
    )

    expect(addedUnloadEvents.length).toBe(0)

    unmount()

    const removedUnloadEvents = removeEventListener.mock.calls.filter(
      ([event]) => event === beforeUnloadEvent
    )

    expect(removedUnloadEvents.length).toBe(0)
  })
})
