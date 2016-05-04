import React, { createClass } from 'react';
import {connect} from 'react-redux'


function mapStateToProps(state) {
  return {
    dt: state.dt
  }
}

const FrameCount = createClass ({
  render() {
    return (
      <div className="frameCounter">{Math.floor(1 / this.props.dt)}</div>
    )
  }
})

export default connect(mapStateToProps)(FrameCount)
