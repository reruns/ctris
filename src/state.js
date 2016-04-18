import { createStore } from 'redux'
import { INITSTATE, GRAVS, GRADES } from './constants.js'
import { rotate, shift, resolveIRS, resting } from './movement.js'
import { generateTGM1 } from './blockGenerators.js'

var btris = function(state = INITSTATE, action) {
  //on the first frame only, generate the first piece
  if (state.nextPieceType === -1) {
    state.nextPiece = generateTGM1();
    return state;
  }

  switch (action.type) {
    case 'ROTATE':
      state.currentPiece = rotate(state.currentPiece, action.dir, state.grid);
      return state;
    //once the animation is done, we dispatch an action to actually remove the lines
    case 'CLEANUP':
      return state;
    //unfortunately, most of the other things are pretty entangled.
    case 'UPDATE':

      //If we get desynced from 60fps we're screwed anyway, so this should be fine.
      state.timer += (1/60)

      //we're between moves
      if (state.currentPiece.type === -1) {
          if (state.are === 0) {
            state.currentPiece.type = state.nextPieceType
            state.currentPiece.loc = [4,1];
            state.currentPiece = ResolveIRS(state.currentPiece, action.controls.button, state.grid)
            state.nextPieceType = generateTGM1();
            if (state.orientation == -1) {
              state.gameOver = true;
              return state;
            }
          } else {
            state.are -= 1;
            return state;
          }
      }

      //das and shifting
      //n.b. "The player's DAS charge is unmodified during line clear delay, the first 4 frames of ARE, the last frame of ARE, and the frame on which a piece spawns.""
      if (state.are < 27 && state.are > 1 && (action.controls.direction == 'L' || action.controls.direction == 'R')) {
        if (state.das.dir === action.controls) {
          if (state.das.count == 0) {
            state.currentPiece = shift(state.currentPiece, action.controls.direction, state.grid);
          } else {
            state.das.count -= 1;
          }
        } else {
          state.currentPiece = shift(state.currentPiece, action.controls.direction, state.grid);
          state.das.direction = direction;
          state.das.count = 14
        }
      }


      //Advancing the current piece and locking
      if (action.controls === "D") {
        state.currentPiece.lockDelay = 0;
        state.gravity.count = state.gravity.internal;
        state.soft += 1;
      }
      //Is anything below us?
      if (resting(state.currentPiece, state.grid)) {
        if (state.currentPiece.lockDelay === 0) {
          let rows = []
          state.currentPiece.cells.forEach( (cell) => {
            let [y,x] = cell
            if (rows.indexOf(y) === -1)
              rows = rows.concat(y)
            grid[y][x] = state.currentPiece.type;
          })

          // check for cleared lines
          rows.forEach((row) => {
            if ( grid[row].every( (cell) => {return cell != -1} ) )
              state.clearedLines = state.clearedLines.concat(row)
          })

          let lines = clearedLines.length
          if (lines === 0)
            state.combo = 1
          else
            state.combo = state.combo + (2 * lines) - 2

          //if the line above the highest line we cleared is empty, the screen is clear
          let bravo = 1
          if (lines != 0 && grid[state.clearedLines[0] - 1].every((cell) => {return cell == -1}))
            bravo = 4;

          //update score
          state.score += ((state.level + lines)/4 + state.soft) * lines * ((2*lines) - 1) * combo * bravo

          // advance the level
          let plevel = state.level;
          if (lines > 0) {
            state.level += lines + 1;
          } else if (state.level % 100 != 99 && state.level != 998) {
            state.level += 1
          }

          // reset gravity + soft
          state.gravity = updateGravity(state.level)
          state.grade = updateGrade(state.score)
          state.canGM = state.canGM && updateGMQual(plevel, state.level, state.score, state.timer);
          state.soft = 0;
        } else {
          state.currentPiece.lockDelay -= 1
        }
      } else {
        state.gravity.count -= state.gravity.internal;
        if (state.gravity.count <= 0) {
          state.currentPiece = advance(state.currentPiece, state.gravity.g, state.grid)
          state.gravity.count += 256
        }
      }

      return state;
    default:
      return state;
  }
}

let store = createStore(btris);

let rotateActionCreator = function(dir) {
  return {
    type: 'ROTATE',
    dir: dir
  }
}

let updateActionCreator = function(controls) {
  return {
    type: 'UPDATE',
    controls: controls
  }
}

let cleanupActionCreator = function () {
  return {
    type: 'CLEANUP'
  }
}

function _newVal(table, key) {
  for (let i=0; i < table.length; i++) {
    if (key >= table[i][0]) {
      return table[i][1]
    }
  }
}

var updateGravity = function(level) {
  return _newVal(GRAVS, level)
}

var updateGrade = function(score) {
  return _newVal(GRADES, score)
}

let updateGMQual = function(plevel, level, score, timer) {
  !((plevel < 300 && level >= 300 && (score < 12000 || timer > 255)) ||
  (plevel < 500 && level >= 500 && (score < 40000 || timer > 450)) ||
  (level == 999 && (score < 126000 || timer > 810)))
}

export {store, rotateActionCreator, updateActionCreator, cleanupActionCreator}
