import * as React from 'react'
import useBoolean from '.'

export default () => {
  const [value, toggle] = useBoolean(true)

  return (
    <React.Fragment>
      <p>The value is now {value ? 'true' : 'false'}</p>
      <button onClick={() => toggle()}>Toggle</button>
    </React.Fragment>
  )
}
