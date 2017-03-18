import React from 'react'

const DetailsContainer = (props) => {
  return (
    <div>
      <h1>ID is: {props.params.id}</h1>
      <pre><code>{JSON.stringify(props, null, 4)}</code></pre>
    </div>
  )
}

DetailsContainer.propTypes = {
  params: React.PropTypes.object
}

export default DetailsContainer
