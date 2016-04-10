import { createStore } from 'redux'
import { INITSTATE } from './constants.js'
import { rotate } from './movement.js'

var btris = function(state = INITSTATE, action) {
  //if (state.nextPieceType === -1) {
    //state.nextPiece = BTris.generateTGM1();
  //   for(var i=0; i < 10; i++) {
  //     for(var j=0; j < 21; j++) {
  //       state.grid[i][j] = -1;
  //     }
  //   }
  //   return state;
  // }

  switch (action.type) {
    case 'ROTATE':
      //state.currentPiece = rotate(state.currentPiece, action.dir, state.grid);
      return state;
    default:
      return state;
  }
}

var store = createStore(btris);

var rotateActionCreator = function(dir) {
  return {
    type: 'ROTATE',
    dir: dir
  }
}

export {store, rotateActionCreator}
