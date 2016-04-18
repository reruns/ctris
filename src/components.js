import React, { Component, PropTypes } from 'react';

const Grid = createClass ({
  computeCell(i,j) {
    let data = {active: false, type: -1, neighbors: {}};
    //what goes in this square?
    data.type = props.grid[i][j];
    if (props.currentPiece.cells.includes([i,j])) {
      data.type = props.currentPiece.type + 100
      data.active = true
    }
    if(data.type != -1 && !data.active) { //in this case, we need neighbor information
      if (!!grid[i-1][j] && grid[i-1][j] != -1)
        data.neighbors.up = true
      if (!!grid[i][j-1] && grid[i][j-1] != -1)
        data.neighbors.left = true
      if (!!grid[i+1][j] && grid[i+1][j] != -1)
        data.neighbors.down = true
      if (!!grid[i][j+1] && grid[i][j+1] != -1)
        data.neighbors.right = true
    }
    return data
  },
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
    const { getState } = store;
    const { grid, currentPiece, timer, score } = getState();
    let cellNodes = []
    for (let i=0; i < 21; i++) {
      for (let j=0; j < 10; j++) {
        let data = computeCell(i,j);
        cellNodes.append(<Cell active={data.active} type={data.type} neighbors={data.neighbors} />)
      }
    }

    return (
      <div className="grid">
        {cellNodes}
      </div>
    )
  }
})

const Cell = (props) => {
  <div className="cell">
  </div>
}

export { Grid, Cell, Provider }
