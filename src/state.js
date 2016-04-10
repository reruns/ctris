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
      return state;
    //unfortunately, most of the other things are pretty entangled.
    case 'UPDATE':
      //das and shifting
      //n.b. "The player's DAS charge is unmodified during line clear delay, the first 4 frames of ARE, the last frame of ARE, and the frame on which a piece spawns.""
      if (state.are < 27 && state.are > 1 && (action.controls == 'L' || action.controls == 'R')) {
        if (state.das.dir === action.controls) {
          if (state.das.count == 0) {
            state.currentPiece = shift(state.currentPiece, action.controls, state.grid);
          } else {
            state.das.count -= 1;
          }
        } else {
          state.currentPiece = shift(state.currentPiece, action.controls, state.grid);
          state.das.direction = direction;
          state.das.count = 14
        }
      }
      
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

var updateActionCreator = function(controls) {
  return {
    type: 'UPDATE',
    controls: controls
  }
}

export {store, rotateActionCreator}
