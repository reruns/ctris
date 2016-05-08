import React, { createClass } from 'react';

const Cell = createClass ({
  shouldComponentUpdate(newProps) { //TODO update this for stack border
    //also yes, I know.
    if (this.props.type == newProps.type) {
      return false
    } else {
      return true
    }
  },
  render() {
    let type = "cell type"+ this.props.type
    return (
      <div className={type}>
      </div>
    )
  }
})
export { Cell }
