import { connect } from 'react-redux'
import React, { createClass } from 'react'

function mapStateToProps(state) {
  return {
    score: state.score
  }
}

const Score = createClass({
  shouldComponentUpdate(nextProps) {
    return (this.props.score != nextProps.score)
  },
  render() {
    return(
      <div className="scoreView">
        <div className="pts">POINTS</div>
        <div className="amt">{ this.props.score }</div>
      </div>
    )
  }
})

export default connect(mapStateToProps)(Score)
