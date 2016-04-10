import { createStore } from 'redux'
import { INITSTATE } from './constants.js'
import { rotate } from './movement.js'
import { generateTGM1, generateDummy } from './blockGenerators.js'

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

  //TODO: this is debug only
  if (state.currentPiece.type === -1) {
    state.currentPiece.type = generateDummy()
    state.currentPiece.loc = [1,4]
    state.currentPiece.orient = 0;
  }

  switch (action.type) {
    case 'ROTATE':
      state.currentPiece = rotate(state.currentPiece, action.dir, state.grid);
      console.log(state.currentPiece);
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
