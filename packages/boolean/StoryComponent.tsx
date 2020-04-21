import React, { Fragment } from 'react'
import useBoolean from '.'

export default () => {
  const [value, toggle] = useBoolean(true)

  return (
    <Fragment>
      <p>The value is now {value ? 'true' : 'false'}</p>
      <button onClick={() => toggle()}>Toggle</button>
    </Fragment>
  )
}
