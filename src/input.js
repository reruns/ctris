(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 37:
            key = 'A'; break;
        case 39:
            key = 'B'; break;
        case 40:
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

    window.input = {
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
})();
