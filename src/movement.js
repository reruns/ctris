var rotate = function(piece, dir, grid) {
  if (piece.type == 2)
    return piece;

  let p = {
    type: piece.type,
    loc: [piece.loc[0], piece.loc[1]],
    orient: piece.orient + (dir == 'CCW' ? 3 : 1),
    cells: [[]]
  }

  p.cells = updateCells(p);

  if (safePosition(p.cells, grid)) {
    return p
  } else {
    p.loc[1] += 1;
    p = updateCells(p);
    if(safePosition(p.cells, grid))
      return p

    p.loc[1] -= 2;
    p = updateCells(p)
    if (safePosition(p.cells, grid))
      return p

    return piece;
  }
}

var shift = function(piece, dir, grid) {
  if (piece.type === -1)
    return

  let p = {
    type: piece.type,
    loc: [piece.loc[0], piece.loc[1] + (dir === 'L' ? -1 : 1)],
    orient: piece.orient,
    cells: [[]]
  }

  p.cells = updateCells(p);
  return (safePosition(p.cells, grid) ? p : piece);
}

function safePosition(cells, grid) {
  //if the coordinate goes off the side, we'll compare with undefined
  //which still works, thankfully.
  for (var i = 0; i < 4; i++) {
    if (grid[cells[i][0]][cells[i][1]] !== -1)
      return false
  }
  return true
}

function updateCells(p) {
  switch (p.type) {
    case 0:
      return updateZCells(p); //Z
    case 1:
      return updateSCells(p); //S
    case 2:
      return updateOCells(p); //O
    case 3:
      return updateTCells(p); //T
    case 4:
      return updateLCells(p); //L
    case 5:
      return updateJCells(p); //J
    case 6:
      return updateICells(p); //I
    default:
      return [['x','x'],['x','x'],['x','x'],['x','x']]
  }
}

function updateZCells(p) {
  p.orient = p.orient % 2

  var x = p.loc[1];
  var y = p.loc[0];

  if (p.orient === 0) {
    return [[y,x],[y+1,x],[y+1,x+1],[y,x-1]]
  } else {
    return [[y,x],[y,x+1],[y-1,x+1],[y+1,x]]
  }
}

function updateSCells(p) {
  p.orient = p.orient % 2

  var x = p.loc[1];
  var y = p.loc[0];

  if (p.orient == 0) {
    return [[y,x],[y,x+1],[y+1,x],[y+1,x-1]]
  } else {
    return [[y,x],[y+1,x],[y,x-1],[y-1,x-1]]
  }
}

function updateOCells(p) {
  p.orient = 0;
  var x = p.loc[1];
  var y = p.loc[0];

  return [[y,x],[y,x+1],[y+1,x],[y+1,x+1]];
}

function updateTCells(p) {
  p.orient = p.orient % 4;
  var x = p.loc[1];
  var y = p.loc[0];

  switch(p.orient) {
    case 0: return [[y,x], [y,x-1], [y,x+1], [y+1,x]];
    case 1: return [[y,x], [y-1,x], [y+1,x], [y,x-1]];
    case 2: return [[y,x], [y+1,x], [y+1, x-1], [y+1,x+1]];
    case 3: return [[y,x], [y-1,x], [y+1,x], [y,x+1]];
  }
}

function updateLCells(p) {
  p.orient = p.orient % 4;
  var x = p.loc[1];
  var y = p.loc[0];

  switch(p.orient) {
    case 0: return [[y,x], [y,x+1], [y,x-1], [y+1,x-1]];
    case 1: return [[y,x], [y-1,x], [y+1,x], [y-1,x-1]];
    case 2: return [[y,x+1], [y+1,x], [y+1,x-1], [y+1,x+1]];
    case 3: return [[y,x], [y-1,x], [y+1,x], [y+1,x+1]]
  }
}

function updateJCells(p) {
  p.orient = p.orient % 4;
  var x = p.loc[1];
  var y = p.loc[0];

  switch(p.orient) {
    case 0: return [[y, x], [y, x-1], [y, x+1], [y+1, x+1]];
    case 1: return [[y, x], [y-1, x], [y+1, x], [y+1, x-1]];
    case 2: return [[y, x-1], [y+1,x], [y+1,x-1], [y+1,x+1]];
    case 3: return [[y,x], [y-1,x], [y+1,x], [y-1,x+1]];
  }
}

function updateICells(p) {
  p.orient = p.orient % 2;
  var x = p.loc[1];
  var y = p.loc[0];

  if (p.orient == 0) {
    return [[y,x],[y,x-1],[y,x+1],[y,x+2]];
  } else {
    return [[y,x+1],[y-1,x+1],[y+1,x+1],[y+2,x+1]];
  }
}

export { rotate, shift }
