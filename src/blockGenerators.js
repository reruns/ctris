var generateDummy = function() {
  return 3;
}

var generateTGM1 = (function() {
  var history = [];

  return function () {
        var piece
        if (history.length === 0) {
          var p = Math.floor(Math.random() * 4) + 3; //first piece can't be Z,S,O to prevent forced overhang
          history = [0,0,0,0];
          piece = p
        } else {
          var tries = 4;
          var p = -1;
          while(tries > 0) {
            p = Math.floor(Math.random() * 7)
            if (history.indexOf(p) === -1)
              tries = 0;
            else {
              tries -= 1
            }
          }
          piece = p
        }
        history.pop();
        history.unshift(piece);
        return piece
    }
})();

export { generateDummy, generateTGM1 }
