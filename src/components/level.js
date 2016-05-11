import { connect } from 'react-redux'
import React, { createClass } from 'react'

function mapStateToProps(state) {
  return {
    level: state.level
  }
}

const Level = createClass({
  shouldComponentUpdate(nextProps) {
    return (this.props.level != nextProps.level)
  },
  render() {
    let tier = 100;
    if (this.props.level < 900) {
      tier = 100 * (Math.floor(this.props.level / 100) + 1)
    } else {
      tier = 999
    }
    return(
      <div className="levelView">
        <div className="currentLevel">{this.props.level}</div>
        <div className="divider">/</div>
        <div className="levelTier">{tier}</div>
      </div>
    )
  }
})

export default connect(mapStateToProps)(Level)
