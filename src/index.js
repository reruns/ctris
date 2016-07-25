import {store, rotateActionCreator, updateActionCreator, cleanupActionCreator, forceOverlayActionCreator, setPlayerNameAC } from './state.js'
import {handleInput, handleTextInput} from './input.js'
import GameView from './components/gameView.js'
import {Provider} from 'react-redux'
import React from 'react'
import {render} from 'react-dom'
import { sprintf } from 'sprintf-js'

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
    <GameView />
  </Provider>,
  document.getElementById('content')
);

main();

function main() {
  let now = Date.now();
  let dt = (now - lastTime) / 1000.0;
  update(dt);
  lastTime = now;
  if (!store.getState().gameOver){
    requestAnimFrame(main);
  } else {
    //get the data from the state
    let {grade, score, timer, initials} = store.getState();
    fetch("https://ctris-server.herokuapp.com", {
      method: "POST", 
      body: {initials: initials, grade: grade.current, time: timer, score: score}
    }).then((res) => { return res.json() })
    .then((res) => {
      const {games} = res
      if (!!games) {
        setTimeout(() => {store.dispatch(forceOverlayActionCreator({mode: "lb", text: games}))}, 3000);
      }
    })
    .catch((res) => {
      console.log("error fetching leaderboards")
      console.log(res)
    })
  }
}

function update(dt) {
  //this weirdness is because we actually care about what buttons were pressed this frame
  //AND what buttons are being held, separately.
  store.dispatch({type: "dt", dt: dt})
  const { pause, overlay } = store.getState()
  let text = overlay.text;
  if (pause) {
    let newchar = handleTextInput();
    if (newchar === 'ENTER') {
      if (text.length >= 2) {
        store.dispatch(setPlayerNameAC(text));
      }
    } else if (newchar === 'BS') {
      store.dispatch(forceOverlayActionCreator({mode: "input", text: text.slice(0,text.length-1)}))
    } else if (text.length < 3) {
      store.dispatch(forceOverlayActionCreator({mode: "input", text: text+newchar }))
    }
  } else {
    let controls = handleInput();
    if (controls.newButton !== '') {
      store.dispatch(rotateActionCreator(controls.newButton));
    }
    if (store.getState().are == 31) {
      store.dispatch(cleanupActionCreator());
    }
    store.dispatch(updateActionCreator(controls));
  }
}
