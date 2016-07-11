import React, { createClass, PropTypes } from 'react';
import Grid from './grid.js'
import FrameCount from './frameCount.js'
import Timer from './timer.js'
import NextPiece from './nextPiece.js'
import Score from './score.js'
import Level from './level.js'
import Grade from './grade.js'
import LockDelayMeter from './lockDelayMeter.js'
import TextOverlay from './textOverlay.js'
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
    const { gameOver, overlay} = store.getState();

    return (
      <div className="game">
        <div className="leftPane">
          <Grade />
          <Score />
          <Level />
        </div>
        <div className="rightPane">
          <TextOverlay/>
          <NextPiece/>
          <Grid />
          <Timer />
        </div>
      </div>
    );
  }
})

export default GameView
