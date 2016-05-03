import React, { Component, PropTypes, createClass } from 'react';

const Grid = createClass ({
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
    const { grid, currentPiece, timer, score, dt } = getState();
    let cellNodes = []
    for (let i=0; i < 21; i++) {
      for (let j=0; j < 10; j++) {
        cellNodes.push((() => {
          let data = {active: false, type: -1, neighbors: {}};
          //what goes in this square?
          data.type = grid[i][j];
          currentPiece.cells.forEach((cell) => {
            if(cell[0] === i && cell[1] === j)
            data.type = currentPiece.type + 100
            data.active = true
          })
          if(data.type != -1 && !data.active) { //in this case, we need neighbor information
            if (!!grid[i-1][j] && grid[i-1][j] != -1)
              data.neighbors.up = true
            if (!!grid[i][j-1] && grid[i][j-1] != -1)
              data.neighbors.left = true
            if (i >= 20)
              data.neighbors.down = false;
            else if (!!grid[i+1][j] && grid[i+1][j] != -1)
              data.neighbors.down = true
            if (!!grid[i][j+1] && grid[i][j+1] != -1)
              data.neighbors.right = true
          }

          return <Cell active={data.active} type={data.type} neighbors={data.neighbors} key={String(i)+"-"+j}> </Cell>
        })());
      }
    }

    return (
      <div className="grid">
      <h1>{Math.floor(1 / dt)}fps</h1>
        {cellNodes}
      </div>
    )
  }
})

const Cell = createClass ({
  render() {
    let type = "cell type"+ this.props.type
    return (
      <div className={type}>
      </div>
    )
  }
})
export { Grid, Cell}
