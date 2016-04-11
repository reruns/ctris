import {store, rotateActionCreator} from './state.js'
import {handleInput} from './input.js'

var requestAnimFrame = (() => {
  return window.requestAnimationFrame  ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback){
      window.setTimeout(callback, 1000 / 60);
    };
})();

let lastTime = Date.now();
main();

function main() {
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;

  //update(dt);
  //render();
  lastTime = now;
  requestAnimFrame(main);
}

function update(dt) {
  gameTime += dt;

  [direction, buttons, newButtons] = handleInput();
  state.dispatch(updateActionCreator({direction: direction, button: button}));
}
