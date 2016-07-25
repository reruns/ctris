import React, { createClass } from 'react';
import {connect} from 'react-redux';
import { formatTime } from '../util.js'

function mapStateToProps(state) {
  return {
    timer: state.timer
  }
}
const Timer = createClass({
  render() {
    return(
      <div className="timer">
        { formatTime(this.props.timer) }
      </div>
    )
  }
})

export default connect(mapStateToProps)(Timer)
