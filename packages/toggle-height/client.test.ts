import { act, renderHook } from '@testing-library/react-hooks'
import useToggleHeight from '.'

interface MockElement {
  style: {
    height: string
  }
}

interface MockRef extends React.MutableRefObject<MockElement> {
  current: MockElement
}

describe('useToggleHeight', () => {
  let ref: MockRef

  beforeEach(() => {
    ref = {
      current: {
        style: {
          height: '100px',
        },
      },
    }
  })

  test('sets element as closed by default', () => {
    const { result } = renderHook(() =>
      useToggleHeight(ref as React.MutableRefObject<HTMLElement>)
    )

    expect(result.current[0]).toBe(false)
    expect(ref.current.style.height).toBe('0px')
  })

  test('does not modify height if element is expanded by default', () => {
    const { result } = renderHook(() =>
      useToggleHeight(ref as React.MutableRefObject<HTMLElement>, true)
    )

    expect(result.current[0]).toBe(true)
    expect(ref.current.style.height).toBe('100px')
  })

  // test('updates value', () => {
  //   const { result } = renderHook(() => useBoolean(true))

  //   act(() => {
  //     result.current[1](false)
  //   })

  //   expect(result.current[0]).toBe(false)
  // })

  // test('toggles value', () => {
  //   const { result } = renderHook(() => useBoolean(true))

  //   act(() => {
  //     result.current[1]()
  //   })

  //   expect(result.current[0]).toBe(false)

  //   act(() => {
  //     result.current[1]()
  //   })

  //   expect(result.current[0]).toBe(true)
  // })
})
