import { connect } from 'react-redux'
import React, { createClass } from 'react'

const mapStateToProps = (state) => {
  return {
    mode: state.overlay.mode,
    text: state.overlay.text
  }
}

const TextOverlay = createClass({
  shouldComponentUpdate(nextProps) {
    return (this.props.text != nextProps.text)
  },
  getInitialState() {
    return {
      initials: ""
    }
  },
  render() {
    const { mode, text } = this.props;
    switch(mode) {
      case "off":
        return (
          <div></div>
        )
      case "lb":
        return(
          <div className="overlayContainer">
            <ul className="leaderboard">
              <li className="lbheader">NAM        GRD      TIME         SCORE</li>
              {
                text.map((game, i) => {
                  return <li className="lb" key={i}>
                    <div className="LB-NAM">{game.initials}</div>
                    <div className="LB-GRD">{game.grade}</div>
                    <div className="LB-TIM">{game.time}</div>
                    <div className="LB-SCR">{game.score}</div>
                  </li>;
              })}
            </ul>
          </div>
        )
      case "message":
        return(
          <div className="overlayContainer">
            <div className="message">
              {text}
            </div>
          </div>
        )
      case "input":
        return(
          <div className="overlayContainer">
            <div className="message">Initials <br/> {text}</div>
          </div>
        )
    }
  }
})

export default connect(mapStateToProps)(TextOverlay)
