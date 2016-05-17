import { connect } from 'react-redux'
import React, { createClass } from 'react'

function mapStateToProps(state) {
  return {
    grade: state.grade.current,
    next: state.grade.next
  }
}

const Grade = createClass({
  shouldComponentUpdate(nextProps) {
    return (this.props.grade != nextProps.grade)
  },
  render() {
    return(
      <div className="gradeView">
        <div className="grade">{ this.props.grade }</div>
        <div className="next">NEXT GRADE AT</div>
        <div className="amt">{this.props.next}</div>
        <div className="pts">POINTS</div>
      </div>
    )
  }
})

export default connect(mapStateToProps)(Grade)
