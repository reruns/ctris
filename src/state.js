import { createStore } from 'redux'
import { INITSTATE, GRAVS, GRADES } from './constants.js'
import { rotate, shift, resolveIRS, resting, advance } from './movement.js'
import { generateTGM1 } from './blockGenerators.js'

var btris = function(state = INITSTATE, action) {
  let newstate = JSON.parse(JSON.stringify(state))
  //on the first frame only, generate the first piece
  if (state.nextPieceType === -1) {
    newstate.nextPieceType = generateTGM1();
    return newstate
  }
  switch (action.type) {
    case 'dt':
      newstate.dt = action.dt
      return newstate;
    case 'ROTATE':
      newstate.currentPiece = rotate(state.currentPiece, action.dir, state.grid);
      return newstate;
    //once the animation is done, we dispatch an action to actually remove the lines
    case 'CLEANUP':
      let lines = newstate.clearedLines.sort().reverse();
      let offset = 0;
      for (let i = 20; i >= 0-(lines.length); i--) {
        if (i == lines[0]) {
          lines.shift();
          offset += 1;
        } else if (offset == 0) {
          continue
        } else {
          if (i >= 0) {
            newstate.grid[i+offset] = newstate.grid[i]
          } else {
            newstate.grid[i+offset] = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
          }
        }
      }
      return newstate;
    //unfortunately, most of the other things are pretty entangled.
    case 'UPDATE':
      //If we get desynced from 60fps we're screwed anyway, so this should be fine.
      newstate.timer += (1/60)

      //we're between moves
      if (newstate.currentPiece.type === -1) {
          if (newstate.are === 0) {
            newstate.currentPiece.type = newstate.nextPieceType
            newstate.currentPiece.loc = [1,4];
            newstate.currentPiece = resolveIRS(newstate.currentPiece, action.controls.button, newstate.grid);
            newstate.currentPiece.lockDelay = 30;
            newstate.nextPieceType = generateTGM1();
            if (newstate.orientation == -1) {
              newstate.gameOver = true;
              return newstate;
            }
          } else {
            newstate.are -= 1;
            return newstate;
          }
      }

      //das and shifting
      //n.b. "The player's DAS charge is unmodified during line clear delay, the first 4 frames of ARE, the last frame of ARE, and the frame on which a piece spawns.""
      if ((newstate.currentPiece != -1 || (newstate.are < 27 && newstate.are > 1))) {
        if (newstate.das.dir === action.controls.direction) {
          if (newstate.das.count == 0) {
            newstate.currentPiece = shift(newstate.currentPiece, action.controls.direction, newstate.grid);
          } else {
            newstate.das.count -= 1;
          }
        } else if (action.controls.direction == "L" || action.controls.direction == "R"){
          newstate.currentPiece = shift(newstate.currentPiece, action.controls.direction, newstate.grid);
          newstate.das.dir = action.controls.direction;
          newstate.das.count = 14
        } else {
          newstate.das.count = 14;
          newstate.das.dir = "X";
        }
      }


      //Advancing the current piece and locking
      if (action.controls.direction === "D") {
        newstate.currentPiece.lockDelay = 0;
        newstate.gravity.count = newstate.gravity.internal;
        newstate.soft += 1;
      }
      //Is anything below us?
      if (resting(newstate.currentPiece, newstate.grid)) {
        if (newstate.currentPiece.lockDelay === 0) {
          let rows = []
          newstate.currentPiece.cells.forEach( (cell) => {
            let [y,x] = cell
            if (rows.indexOf(y) === -1)
              rows = rows.concat(y)
            newstate.grid[y][x] = newstate.currentPiece.type;
          })

          // check for cleared lines
          rows.forEach((row) => {
            if ( newstate.grid[row].every( (cell) => {return cell != -1} ) )
              newstate.clearedLines = newstate.clearedLines.concat(row)
          })

          let lines = newstate.clearedLines.length
          if (lines === 0)
            newstate.combo = 1
          else
            newstate.combo = newstate.combo + (2 * lines) - 2

          //if the line above the highest line we cleared is empty, the screen is clear
          let bravo = 1
          if (lines != 0 && newstate.clearedLines[0] > 16 && newstate.grid[newstate.clearedLines[0] - 1].every((cell) => {return cell == -1}))
            bravo = 4;

          //update score
          newstate.score += ((newstate.level + lines)/4 + newstate.soft) * lines * ((2*lines) - 1) * newstate.combo * bravo

          // advance the level
          let plevel = newstate.level;
          if (lines > 0) {
            newstate.level += lines + 1;
          } else if (newstate.level % 100 != 99 && newstate.level != 998) {
            newstate.level += 1
          }

          // reset gravity + soft
          if (lines != 0) {
            newstate.are = 41;
          } else {
            newstate.are = 30;
          }

          newstate.gravity = updateGravity(newstate.level)
          newstate.grade = updateGrade(newstate.score)
          newstate.canGM = newstate.canGM && updateGMQual(plevel, newstate.level, newstate.score, newstate.timer);
          newstate.soft = 0;
          newstate.currentPiece.type = -1;
          newstate.currentPiece.cells = [];
          newstate.currentPiece.orient = 0;
        } else {
          newstate.currentPiece.lockDelay -= 1
        }
      } else {
        newstate.gravity.count -= state.gravity.internal;
        if (newstate.gravity.count <= 0) {
          newstate.currentPiece = advance(newstate.currentPiece, newstate.gravity.g, newstate.grid)
          newstate.currentPiece.lockDelay = 30;
          newstate.gravity.count += 256
        }
      }

      return newstate;
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
