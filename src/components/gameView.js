import React, { createClass, PropTypes } from 'react';
import Grid from './grid.js'
import FrameCount from './frameCount.js'
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
    const { dt, grid, currentPiece } = store.getState();
    return (
      <div className="game">
        <FrameCount/>
        <Grid />
      </div>
    );
  }
})

export default GameView
