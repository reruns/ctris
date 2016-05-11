import { connect } from 'react-redux'
import React, { createClass } from 'react'

function mapStateToProps(state) {
  return {
    grade: state.grade
  }
}

const Grade = createClass({
  shouldComponentUpdate(nextProps) {
    return (this.props.grade != nextProps.grade)
  },
  render() {
    return(
      <div className="gradeView">
        { this.props.grade }
      </div>
    )
  }
})

export default connect(mapStateToProps)(Grade)
