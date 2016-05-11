import { connect } from 'react-redux'
import React, { createClass } from 'react'

function mapStateToProps(state) {
  return {
    lockDelay: state.currentPiece.lockDelay
  }
}

const LockDelayMeter = createClass({
  shouldComponentUpdate(nextProps) {
    return (this.props.lockDelay != nextProps.lockDelay)
  },
  render() {
    return(//TODO: Make this behave as a meter.
      <div className="lockDelayMeter">
      </div>
    )
  }
})

export default connect(mapStateToProps)(LockDelayMeter)
