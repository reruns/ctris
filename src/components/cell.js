import React, { createClass } from 'react';

const Cell = createClass ({
  render() {
    let type = "cell type"+ this.props.type
    return (
      <div className={type}>
      </div>
    )
  }
})
export { Cell }
