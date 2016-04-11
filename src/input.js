var pressedKeys = {};

function setKey(event, status) {
    var code = event.keyCode;
    var key;

    switch(code) {
    case 37:
        key = 'A'; break;
    case 40:
        key = 'B'; break;
    case 39:
        key = 'C'; break;
    case 65: //a
        key = 'LEFT'; break;
    case 68: //d
        key = 'RIGHT'; break;
    case 83: //s
        key = 'DROP'; break;
    case 87: //w
        key = 'SONIC'; break; //sonic drop will remain unused for now.
    default:
        key = String.fromCharCode(code);
    }

    pressedKeys[key] = status;
}

document.addEventListener('keydown', function(e) {
    setKey(e, true);
});

document.addEventListener('keyup', function(e) {
    setKey(e, false);
});

window.addEventListener('blur', function() {
    pressedKeys = {};
});

let input = {
    isDown: function(key) {
        return pressedKeys[key.toUpperCase()];
    },
    reset: function() {
      pressedKeys['A'] = false;
      pressedKeys['B'] = false;
      pressedKeys['C'] = false;
      pressedKeys['LEFT'] = false;
      pressedKeys['RIGHT'] = false;
      pressedKeys['DROP'] = false;
      pressedKeys['SONIC'] = false;
    }
};

let history = [];

let handleInput = function() {
  let direction = '';
  if (input.isDown('LEFT')) {
    direction = 'L'
  } else if (input.isDown('RIGHT')) {
    direction = 'R'
  } else if (input.isDown('DROP')) {
    direction = 'D'
  }

  let buttons = [];
  ['A','B','C'].forEach((button)=> {
    if(input.isDown(button))
      buttons = buttons.concat(button);
  });

  let newButtons = buttons.filter((button) => {
    return history.indexOf(button) === -1
  });

  let button, newButton;
  [button, newButton] = [buttons, newButtons].map((poll) => {
    if (poll[0] == 'A' || poll[0] == 'C') {
      return 'CCW'
    } else if (poll[0] == 'B') {
      return 'CW'
    } else {
      return ''
    }
  })

  let out = {direction: direction, button: button, newButton: newButton};
  history = buttons;
  return out;
}

export {handleInput}
