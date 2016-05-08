import { connect } from 'react-redux'
import React, { createClass } from 'react'
import { Cell }  from './cell.js'
import { updateCells } from '../movement.js'

function mapStateToProps(state) {
  return {
    piece: state.nextPieceType
  }
}

const NextPiece = createClass({
  shouldComponentUpdate(nextProps) {
    return (this.props.piece != nextProps.piece)
  },
  render() {
    let cellNodes = []
    const cells = updateCells({loc: [0,1], orient: 0, type: this.props.piece})
    const type = this.props.piece;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        cellNodes.push((() => {
          let data = { active: true, type: -1, neighbors: {}};
          cells.forEach((cell) => {
            if(cell[0] === i && cell[1] === j)
              data.type = type + 100;
          })
          return (<Cell active={data.active} type={data.type} neighbors={data.neighbors} key={String(i)+"-"+j}> </Cell>)
        })())
      }
    }
    return(
      <div className="nextPiece">
        Next
        <div className="nextCells">
          { cellNodes }
        </div>
      </div>
    )
  }
})

export default connect(mapStateToProps)(NextPiece)
