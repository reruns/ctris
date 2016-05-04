import React, { createClass } from 'react';
import {connect} from 'react-redux'
import { Cell } from './cell.js'

function mapStateToProps(state) {
    return {
      grid: state.grid,
      cells: state.currentPiece.cells,
      type: state.currentPiece.type,
      loc: state.currentPiece.loc,
      orient: state.currentPiece.orient
    }
}

const Grid = createClass ({
  shouldComponentUpdate(newProps) {
    const { grid, orient, loc} = this.props
    for (let i=0; i < 21; i++) {
      for (let j=0; j < 10; j++) {
        if (grid[i][j] != newProps.grid[i][j]) {
          return true
        }
      }
    }

    if (orient != newProps.orient || loc[0] != newProps.loc[0] || loc[1] != newProps.loc[1]) {
      return true
    }

    return false
  },
  render() {
    const { grid, cells, type} = this.props
    let cellNodes = []
    for (let i=0; i < 21; i++) {
      for (let j=0; j < 10; j++) {
        cellNodes.push((() => {
          let data = {active: false, type: -1, neighbors: {}};
          //what goes in this square?
          data.type = grid[i][j];
          cells.forEach((cell) => {
            if(cell[0] === i && cell[1] === j)
            data.type = type + 100
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
        {cellNodes}
      </div>
    )
  }
})

export default connect(mapStateToProps)(Grid)
// export default Grid
