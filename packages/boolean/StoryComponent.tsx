import React from 'react'
import useBoolean from '.'

export default function StoryComponent() {
  const [value, toggle] = useBoolean(true)

  return (
    <>
      <p>The value is now {value ? 'true' : 'false'}</p>
      <button onClick={() => toggle()}>Toggle</button>
    </>
  )
}
