import {store, rotateActionCreator, updateActionCreator} from './state.js'
import {handleInput} from './input.js'
import {Grid, Cell} from './components.js'
import {Provider} from 'react-redux'
import React from 'react'
import {render} from 'react-dom'

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

render(
  <Provider store={store}>
    <Grid />
  </Provider>,
  document.getElementById('content')
);

main();

function main() {
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;
  update(dt);
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
