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

  update(dt);
  //render();
  lastTime = now;
  requestAnimFrame(main);
}

function update(dt) {

  let controls = handleInput();
  //this weirdness is because we actually care about what buttons were pressed this frame
  //AND what buttons are being held, separately.
  if (controls.newButton !== '') {
    store.dispatch(rotateActionCreator({dir: controls.newButton}));
  }
  store.dispatch(updateActionCreator(controls));
}
