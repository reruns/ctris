import React, { Component, PropTypes, createClass } from 'react';

const Cell = createClass ({
  render() {
    let type = "cell type"+ this.props.type
    return (
      <div className={type}>
      </div>
    )
  }
})
export { Grid, Cell}
