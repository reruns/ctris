import React, { createClass, PropTypes } from 'react';
import Grid from './grid.js'
import FrameCount from './frameCount.js'
import Timer from './timer.js'
import NextPiece from './nextPiece.js'
import Score from './score.js'
import Level from './level.js'
import Grade from './grade.js'
import LockDelayMeter from './lockDelayMeter.js'
import {connect} from 'react-redux'

const GameView = createClass ({
  contextTypes: {
    store: PropTypes.object
  },
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe( () => this.forceUpdate() )
  },
  componentWillUnmount() {
    this.unsubscribe()
  },
  render() {
    const { store } = this.context;
    const { gameOver, countdown } = store.getState();
    let text = "";
    if (gameOver) {
      text = "Game Over!"
    }

    return (
      <div className="game">
        <div className="leftPane">
          <FrameCount/>
          <Grade />
          <Score />
          <Level />
        </div>
        <div className="rightPane">
          <div className="textOverlay">{text}</div>
          <NextPiece/>
          <Grid />
          <Timer />
        </div>
      </div>
    );
  }
})

export default GameView
