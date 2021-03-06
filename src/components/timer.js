import React, { createClass } from 'react';
import {connect} from 'react-redux';

function mapStateToProps(state) {
  return {
    timer: state.timer
  }
}
const Timer = createClass({
  strtime() {
    let mins = String(Math.floor(this.props.timer / 60));
    let secs = String((this.props.timer % 60).toFixed(2));
    if (this.props.timer % 60 < 10)
      return (mins+":0"+secs)
    else
      return (mins + ":" + secs)
  },
  render() {
    return(
      <div className="timer">
        { this.strtime() }
      </div>
    )
  }
})

export default connect(mapStateToProps)(Timer)
