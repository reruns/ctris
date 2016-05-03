import {store, rotateActionCreator, updateActionCreator, cleanupActionCreator} from './state.js'
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
  let now = Date.now();
  let dt = (now - lastTime) / 1000.0;
  update(dt);
  lastTime = now;
  requestAnimFrame(main);
}

function update(dt) {
  let controls = handleInput();
  //this weirdness is because we actually care about what buttons were pressed this frame
  //AND what buttons are being held, separately.
  store.dispatch({type: "dt", dt: dt})
  if (controls.newButton !== '') {
    store.dispatch(rotateActionCreator(controls.newButton));
  }
  if (store.getState().are == 31) {
    store.dispatch(cleanupActionCreator());
  }
  store.dispatch(updateActionCreator(controls));
}
