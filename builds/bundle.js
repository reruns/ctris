/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _state = __webpack_require__(1);

	var _input = __webpack_require__(17);

	var requestAnimFrame = function () {
	  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
	    window.setTimeout(callback, 1000 / 60);
	  };
	}();

	var lastTime = Date.now();
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
	  var controls = (0, _input.handleInput)();
	  //this weirdness is because we actually care about what buttons were pressed this frame
	  //AND what buttons are being held, separately.
	  if (controls.newButton !== '') {
	    _state.store.dispatch((0, _state.rotateActionCreator)({ dir: controls.newButton }));
	  }
	  _state.store.dispatch(updateActionCreator(controls));
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.rotateActionCreator = exports.store = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _redux = __webpack_require__(2);

	var _constants = __webpack_require__(14);

	var _movement = __webpack_require__(15);

	var _blockGenerators = __webpack_require__(16);

	var btris = function btris() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? _constants.INITSTATE : arguments[0];
	  var action = arguments[1];

	  //on the first frame only, generate the first piece
	  if (state.nextPieceType === -1) {
	    state.nextPiece = (0, _blockGenerators.generateTGM1)();
	    return state;
	  }

	  switch (action.type) {
	    case 'ROTATE':
	      state.currentPiece = (0, _movement.rotate)(state.currentPiece, action.dir, state.grid);
	      return state;
	    //once the animation is done, we dispatch an action to actually remove the lines
	    case 'CLEANUP':
	      return state;
	    //unfortunately, most of the other things are pretty entangled.
	    case 'UPDATE':

	      //If we get desynced from 60fps we're screwed anyway, so this should be fine.
	      state.timer += 1 / 60;

	      //we're between moves
	      if (state.currentPiece.type === -1) {
	        if (state.are === 0) {
	          state.currentPiece.type = state.nextPieceType;
	          state.currentPiece.loc = [4, 1];
	          state.currentPiece = ResolveIRS(state.currentPiece, action.controls.button, state.grid);
	          state.nextPieceType = (0, _blockGenerators.generateTGM1)();
	          if (state.orientation == -1) {
	            state.gameOver = true;
	            return state;
	          }
	        } else {
	          state.are -= 1;
	          return state;
	        }
	      }

	      //das and shifting
	      //n.b. "The player's DAS charge is unmodified during line clear delay, the first 4 frames of ARE, the last frame of ARE, and the frame on which a piece spawns.""
	      if (state.are < 27 && state.are > 1 && (action.controls.direction == 'L' || action.controls.direction == 'R')) {
	        if (state.das.dir === action.controls) {
	          if (state.das.count == 0) {
	            state.currentPiece = (0, _movement.shift)(state.currentPiece, action.controls.direction, state.grid);
	          } else {
	            state.das.count -= 1;
	          }
	        } else {
	          state.currentPiece = (0, _movement.shift)(state.currentPiece, action.controls.direction, state.grid);
	          state.das.direction = direction;
	          state.das.count = 14;
	        }
	      }

	      //Advancing the current piece and locking
	      if (action.controls === "D") {
	        state.currentPiece.lockDelay = 0;
	        state.gravity.count = state.gravity.internal;
	        state.soft += 1;
	      }
	      //Is anything below us?
	      if ((0, _movement.resting)(state.currentPiece, state.grid)) {
	        if (state.currentPiece.lockDelay === 0) {
	          (function () {
	            var rows = [];
	            state.currentPiece.cells.forEach(function (cell) {
	              var _cell = _slicedToArray(cell, 2);

	              var y = _cell[0];
	              var x = _cell[1];

	              if (rows.indexOf(y) === -1) rows = rows.concat(y);
	              grid[y][x] = state.currentPiece.type;
	            });

	            // check for cleared lines
	            rows.forEach(function (row) {
	              if (grid[row].every(function (cell) {
	                return cell != -1;
	              })) state.clearedLines = state.clearedLines.concat(row);
	            });

	            var lines = clearedLines.length;
	            if (lines === 0) state.combo = 1;else state.combo = state.combo + 2 * lines - 2;

	            //if the line above the highest line we cleared is empty, the screen is clear
	            var bravo = 1;
	            if (lines != 0 && grid[state.clearedLines[0] - 1].every(function (cell) {
	              return cell == -1;
	            })) bravo = 4;

	            //update score
	            state.score += ((state.level + lines) / 4 + state.soft) * lines * (2 * lines - 1) * combo * bravo;

	            // advance the level
	            var plevel = state.level;
	            if (lines > 0) {
	              state.level += lines + 1;
	            } else if (state.level % 100 != 99 && state.level != 998) {
	              state.level += 1;
	            }

	            // reset gravity + soft
	            state.gravity = updateGravity(state.level);
	            state.grade = updateGrade(state.score);
	            state.canGM = state.canGM && updateGMQual(plevel, state.level, state.score, state.timer);
	            state.soft = 0;
	          })();
	        } else {
	          state.currentPiece.lockDelay -= 1;
	        }
	      } else {
	        state.gravity.count -= state.gravity.internal;
	        if (state.gravity.count <= 0) {
	          state.currentPiece = advance(state.currentPiece, state.gravity.g, state.grid);
	          state.gravity.count += 256;
	        }
	      }

	      return state;
	    default:
	      return state;
	  }
	};

	var store = (0, _redux.createStore)(btris);

	var rotateActionCreator = function rotateActionCreator(dir) {
	  return {
	    type: 'ROTATE',
	    dir: dir
	  };
	};

	var updateActionCreator = function updateActionCreator(controls) {
	  return {
	    type: 'UPDATE',
	    controls: controls
	  };
	};

	var cleanupActionCreator = function cleanupActionCreator() {
	  return {
	    type: 'CLEANUP'
	  };
	};

	function _newVal(table, key) {
	  for (var i = 0; i < table.length; i++) {
	    if (key >= table[i][0]) {
	      return table[i][1];
	    }
	  }
	}

	var updateGravity = function updateGravity(level) {
	  return _newVal(_constants.GRAVS, level);
	};

	var updateGrade = function updateGrade(score) {
	  return _newVal(_constants.GRADES, score);
	};

	var updateGMQual = function updateGMQual(plevel, level, score, timer) {
	  !(plevel < 300 && level >= 300 && (score < 12000 || timer > 255) || plevel < 500 && level >= 500 && (score < 40000 || timer > 450) || level == 999 && (score < 126000 || timer > 810));
	};

	exports.store = store;
	exports.rotateActionCreator = rotateActionCreator;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;
	exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

	var _createStore = __webpack_require__(4);

	var _createStore2 = _interopRequireDefault(_createStore);

	var _combineReducers = __webpack_require__(9);

	var _combineReducers2 = _interopRequireDefault(_combineReducers);

	var _bindActionCreators = __webpack_require__(11);

	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

	var _applyMiddleware = __webpack_require__(12);

	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

	var _compose = __webpack_require__(13);

	var _compose2 = _interopRequireDefault(_compose);

	var _warning = __webpack_require__(10);

	var _warning2 = _interopRequireDefault(_warning);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}

	if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  (0, _warning2["default"])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}

	exports.createStore = _createStore2["default"];
	exports.combineReducers = _combineReducers2["default"];
	exports.bindActionCreators = _bindActionCreators2["default"];
	exports.applyMiddleware = _applyMiddleware2["default"];
	exports.compose = _compose2["default"];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.ActionTypes = undefined;
	exports["default"] = createStore;

	var _isPlainObject = __webpack_require__(5);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = exports.ActionTypes = {
	  INIT: '@@redux/INIT'
	};

	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} enhancer The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, initialState, enhancer) {
	  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = initialState;
	    initialState = undefined;
	  }

	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }

	    return enhancer(createStore)(reducer, initialState);
	  }

	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = initialState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;

	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }

	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }

	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected listener to be a function.');
	    }

	    var isSubscribed = true;

	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      isSubscribed = false;

	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }

	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!(0, _isPlainObject2["default"])(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i]();
	    }

	    return action;
	  }

	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }

	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }

	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });

	  return {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  };
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var getPrototype = __webpack_require__(6),
	    isHostObject = __webpack_require__(7),
	    isObjectLike = __webpack_require__(8);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object,
	 *  else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) ||
	      objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return (typeof Ctor == 'function' &&
	    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
	}

	module.exports = isPlainObject;


/***/ },
/* 6 */
/***/ function(module, exports) {

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf;

	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	function getPrototype(value) {
	  return nativeGetPrototype(Object(value));
	}

	module.exports = getPrototype;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	module.exports = isHostObject;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;
	exports["default"] = combineReducers;

	var _createStore = __webpack_require__(4);

	var _isPlainObject = __webpack_require__(5);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	var _warning = __webpack_require__(10);

	var _warning2 = _interopRequireDefault(_warning);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

	  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
	}

	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
	  var reducerKeys = Object.keys(reducers);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }

	  if (!(0, _isPlainObject2["default"])(inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }

	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return !reducers.hasOwnProperty(key);
	  });

	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}

	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }

	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}

	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */
	function combineReducers(reducers) {
	  var reducerKeys = Object.keys(reducers);
	  var finalReducers = {};
	  for (var i = 0; i < reducerKeys.length; i++) {
	    var key = reducerKeys[i];
	    if (typeof reducers[key] === 'function') {
	      finalReducers[key] = reducers[key];
	    }
	  }
	  var finalReducerKeys = Object.keys(finalReducers);

	  var sanityError;
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }

	  return function combination() {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var action = arguments[1];

	    if (sanityError) {
	      throw sanityError;
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
	      if (warningMessage) {
	        (0, _warning2["default"])(warningMessage);
	      }
	    }

	    var hasChanged = false;
	    var nextState = {};
	    for (var i = 0; i < finalReducerKeys.length; i++) {
	      var key = finalReducerKeys[i];
	      var reducer = finalReducers[key];
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      nextState[key] = nextStateForKey;
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	    }
	    return hasChanged ? nextState : state;
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports["default"] = warning;
	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that you can use this stack
	    // to find the callsite that caused this warning to fire.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports["default"] = bindActionCreators;
	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}

	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */
	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }

	  if (typeof actionCreators !== 'object' || actionCreators === null) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }

	  var keys = Object.keys(actionCreators);
	  var boundActionCreators = {};
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var actionCreator = actionCreators[key];
	    if (typeof actionCreator === 'function') {
	      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
	    }
	  }
	  return boundActionCreators;
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports["default"] = applyMiddleware;

	var _compose = __webpack_require__(13);

	var _compose2 = _interopRequireDefault(_compose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }

	  return function (createStore) {
	    return function (reducer, initialState, enhancer) {
	      var store = createStore(reducer, initialState, enhancer);
	      var _dispatch = store.dispatch;
	      var chain = [];

	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2["default"].apply(undefined, chain)(store.dispatch);

	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = compose;
	/**
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */

	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  return function () {
	    if (funcs.length === 0) {
	      return arguments.length <= 0 ? undefined : arguments[0];
	    }

	    var last = funcs[funcs.length - 1];
	    var rest = funcs.slice(0, -1);

	    return rest.reduceRight(function (composed, f) {
	      return f(composed);
	    }, last.apply(undefined, arguments));
	  };
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	       value: true
	});
	var INITSTATE = {
	       score: 0,
	       soft: 0,
	       currentPiece: { type: -1, orient: 0, loc: 0, lockDelay: 30, cells: [[]] },
	       das: { count: 0, dir: 'L' },
	       clearedLines: [],
	       gravity: { count: 256, g: 1, internal: 4 },
	       nextPieceType: -1,
	       gameOver: false,
	       grid: [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]]
	};

	var GRAVS = [[500, { count: 256, g: 20, internal: 256 }], [450, { count: 256, g: 3, internal: 256 }], [420, { count: 256, g: 4, internal: 256 }], [400, { count: 256, g: 5, internal: 256 }], [360, { count: 256, g: 4, internal: 256 }], [330, { count: 256, g: 3, internal: 256 }], [300, { count: 256, g: 2, internal: 256 }], [251, { count: 256, g: 1, internal: 256 }], [247, { count: 256, g: 1, internal: 192 }], [243, { count: 256, g: 1, internal: 160 }], [239, { count: 256, g: 1, internal: 128 }], [236, { count: 256, g: 1, internal: 128 }], [233, { count: 256, g: 1, internal: 96 }], [230, { count: 256, g: 1, internal: 64 }], [220, { count: 256, g: 1, internal: 32 }], [200, { count: 256, g: 1, internal: 4 }], [170, { count: 256, g: 1, internal: 144 }], [160, { count: 256, g: 1, internal: 128 }], [140, { count: 256, g: 1, internal: 112 }], [120, { count: 256, g: 1, internal: 96 }], [100, { count: 256, g: 1, internal: 80 }], [90, { count: 256, g: 1, internal: 64 }], [80, { count: 256, g: 1, internal: 48 }], [70, { count: 256, g: 1, internal: 32 }], [60, { count: 256, g: 1, internal: 16 }], [50, { count: 256, g: 1, internal: 12 }], [40, { count: 256, g: 1, internal: 10 }], [35, { count: 256, g: 1, internal: 8 }], [30, { count: 256, g: 1, internal: 6 }], [0, { count: 256, g: 1, internal: 4 }]];

	var GRADES = [[120000, "S9"], [100000, "S8"], [82000, "S7"], [66000, "S6"], [52000, "S5"], [40000, "S4"], [30000, "S3"], [22000, "S2"], [16000, "S1"], [12000, "1"], [8000, "2"], [5500, "3"], [3500, "4"], [2000, "5"], [1400, "6"], [800, "7"], [400, "8"], [0, "9"]];

	exports.INITSTATE = INITSTATE;
	exports.GRAVS = GRAVS;
	exports.GRADES = GRADES;

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var rotate = function rotate(piece, dir, grid) {
	  if (piece.type == 2 || piece.type == -1) return piece;

	  var p = {
	    type: piece.type,
	    loc: [piece.loc[0], piece.loc[1]],
	    orient: piece.orient + (dir == 'CCW' ? 3 : 1),
	    cells: [[]]
	  };

	  p.cells = updateCells(p);

	  if (safePosition(p.cells, grid)) {
	    return p;
	  } else {
	    p.loc[1] += 1;
	    p = updateCells(p);
	    if (safePosition(p.cells, grid)) return p;

	    p.loc[1] -= 2;
	    p = updateCells(p);
	    if (safePosition(p.cells, grid)) return p;

	    return piece;
	  }
	};

	//similar to rotate...
	var resolveIRS = function resolveIRS(piece, dir, grid) {
	  var p = {
	    type: piece.type,
	    loc: [piece.loc[0], piece.loc[1]],
	    orient: piece.orient,
	    cells: [[]]
	  };

	  switch (dir) {
	    case 'CCW':
	      p.orient += 3;
	      break;
	    case 'CW':
	      p.orient += 1;
	      break;
	    default:
	      break;
	  }
	  p.cells = updateCells(p);

	  if (safePosition(p.cells, grid)) {
	    return p;
	  } else if (safePosition(piece, grid)) {
	    return piece;
	  } else {
	    piece.cells = updateCells(piece);
	    piece.orient = -1;
	    return piece;
	  }
	};

	var shift = function shift(piece, dir, grid) {
	  if (piece.type === -1) return;

	  var p = {
	    type: piece.type,
	    loc: [piece.loc[0], piece.loc[1] + (dir === 'L' ? -1 : 1)],
	    orient: piece.orient,
	    cells: [[]]
	  };

	  p.cells = updateCells(p);
	  return safePosition(p.cells, grid) ? p : piece;
	};

	//Returns true if the current piece is directly on top of something.
	var resting = function resting(piece, grid) {
	  var p = {
	    type: piece.type,
	    loc: [piece.loc[0] + 1, piece.loc[1]],
	    orient: piece.orient,
	    cells: [[]]
	  };
	  p.cells = updateCells(p);
	  return !safePosition(p.cells, grid);
	};

	var advance = function advance(piece, grav, grid) {
	  while (grav > 0) {
	    grav -= 1;
	    piece.loc[0] += 1;
	    piece.cells = updateCells(piece);

	    if (resting(piece, grid)) return piece;
	  }
	};

	function safePosition(cells, grid) {
	  //if the coordinate goes off the side, we'll compare with undefined
	  //which still works, thankfully.
	  for (var i = 0; i < 4; i++) {
	    if (grid[cells[i][0]][cells[i][1]] !== -1) return false;
	  }
	  return true;
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
	      return [['x', 'x'], ['x', 'x'], ['x', 'x'], ['x', 'x']];
	  }
	}

	function updateZCells(p) {
	  p.orient = p.orient % 2;

	  var _p$loc = _slicedToArray(p.loc, 2);

	  var y = _p$loc[0];
	  var x = _p$loc[1];


	  if (p.orient === 0) {
	    return [[y, x], [y + 1, x], [y + 1, x + 1], [y, x - 1]];
	  } else {
	    return [[y, x], [y, x + 1], [y - 1, x + 1], [y + 1, x]];
	  }
	}

	function updateSCells(p) {
	  p.orient = p.orient % 2;

	  var _p$loc2 = _slicedToArray(p.loc, 2);

	  var y = _p$loc2[0];
	  var x = _p$loc2[1];


	  if (p.orient == 0) {
	    return [[y, x], [y, x + 1], [y + 1, x], [y + 1, x - 1]];
	  } else {
	    return [[y, x], [y + 1, x], [y, x - 1], [y - 1, x - 1]];
	  }
	}

	function updateOCells(p) {
	  p.orient = 0;

	  var _p$loc3 = _slicedToArray(p.loc, 2);

	  var y = _p$loc3[0];
	  var x = _p$loc3[1];


	  return [[y, x], [y, x + 1], [y + 1, x], [y + 1, x + 1]];
	}

	function updateTCells(p) {
	  p.orient = p.orient % 4;

	  var _p$loc4 = _slicedToArray(p.loc, 2);

	  var y = _p$loc4[0];
	  var x = _p$loc4[1];


	  switch (p.orient) {
	    case 0:
	      return [[y, x], [y, x - 1], [y, x + 1], [y + 1, x]];
	    case 1:
	      return [[y, x], [y - 1, x], [y + 1, x], [y, x - 1]];
	    case 2:
	      return [[y, x], [y + 1, x], [y + 1, x - 1], [y + 1, x + 1]];
	    case 3:
	      return [[y, x], [y - 1, x], [y + 1, x], [y, x + 1]];
	  }
	}

	function updateLCells(p) {
	  p.orient = p.orient % 4;

	  var _p$loc5 = _slicedToArray(p.loc, 2);

	  var y = _p$loc5[0];
	  var x = _p$loc5[1];


	  switch (p.orient) {
	    case 0:
	      return [[y, x], [y, x + 1], [y, x - 1], [y + 1, x - 1]];
	    case 1:
	      return [[y, x], [y - 1, x], [y + 1, x], [y - 1, x - 1]];
	    case 2:
	      return [[y, x + 1], [y + 1, x], [y + 1, x - 1], [y + 1, x + 1]];
	    case 3:
	      return [[y, x], [y - 1, x], [y + 1, x], [y + 1, x + 1]];
	  }
	}

	function updateJCells(p) {
	  p.orient = p.orient % 4;

	  var _p$loc6 = _slicedToArray(p.loc, 2);

	  var y = _p$loc6[0];
	  var x = _p$loc6[1];


	  switch (p.orient) {
	    case 0:
	      return [[y, x], [y, x - 1], [y, x + 1], [y + 1, x + 1]];
	    case 1:
	      return [[y, x], [y - 1, x], [y + 1, x], [y + 1, x - 1]];
	    case 2:
	      return [[y, x - 1], [y + 1, x], [y + 1, x - 1], [y + 1, x + 1]];
	    case 3:
	      return [[y, x], [y - 1, x], [y + 1, x], [y - 1, x + 1]];
	  }
	}

	function updateICells(p) {
	  p.orient = p.orient % 2;

	  var _p$loc7 = _slicedToArray(p.loc, 2);

	  var y = _p$loc7[0];
	  var x = _p$loc7[1];


	  if (p.orient == 0) {
	    return [[y, x], [y, x - 1], [y, x + 1], [y, x + 2]];
	  } else {
	    return [[y, x + 1], [y - 1, x + 1], [y + 1, x + 1], [y + 2, x + 1]];
	  }
	}

	exports.rotate = rotate;
	exports.shift = shift;
	exports.resting = resting;
	exports.resolveIRS = resolveIRS;

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var generateDummy = function generateDummy() {
	  return 3;
	};

	var generateTGM1 = function () {
	  var history = [];

	  return function () {
	    var piece;
	    if (history.length === 0) {
	      var p = Math.floor(Math.random() * 4) + 3; //first piece can't be Z,S,O to prevent forced overhang
	      history = [0, 0, 0, 0];
	      piece = p;
	    } else {
	      var tries = 4;
	      var p = -1;
	      while (tries > 0) {
	        p = Math.floor(Math.random() * 7);
	        if (history.indexOf(p) === -1) tries = 0;else {
	          tries -= 1;
	        }
	      }
	      piece = p;
	    }
	    history.pop();
	    history.unshift(piece);
	    return piece;
	  };
	}();

	exports.generateDummy = generateDummy;
	exports.generateTGM1 = generateTGM1;

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var pressedKeys = {};

	function setKey(event, status) {
	    var code = event.keyCode;
	    var key;

	    switch (code) {
	        case 37:
	            key = 'A';break;
	        case 40:
	            key = 'B';break;
	        case 39:
	            key = 'C';break;
	        case 65:
	            //a
	            key = 'LEFT';break;
	        case 68:
	            //d
	            key = 'RIGHT';break;
	        case 83:
	            //s
	            key = 'DROP';break;
	        case 87:
	            //w
	            key = 'SONIC';break; //sonic drop will remain unused for now.
	        default:
	            key = String.fromCharCode(code);
	    }

	    pressedKeys[key] = status;
	}

	document.addEventListener('keydown', function (e) {
	    setKey(e, true);
	});

	document.addEventListener('keyup', function (e) {
	    setKey(e, false);
	});

	window.addEventListener('blur', function () {
	    pressedKeys = {};
	});

	var input = {
	    isDown: function isDown(key) {
	        return pressedKeys[key.toUpperCase()];
	    },
	    reset: function reset() {
	        pressedKeys['A'] = false;
	        pressedKeys['B'] = false;
	        pressedKeys['C'] = false;
	        pressedKeys['LEFT'] = false;
	        pressedKeys['RIGHT'] = false;
	        pressedKeys['DROP'] = false;
	        pressedKeys['SONIC'] = false;
	    }
	};

	var history = [];

	var handleInput = function handleInput() {
	    var direction = '';
	    if (input.isDown('LEFT')) {
	        direction = 'L';
	    } else if (input.isDown('RIGHT')) {
	        direction = 'R';
	    } else if (input.isDown('DROP')) {
	        direction = 'D';
	    }

	    var buttons = [];
	    ['A', 'B', 'C'].forEach(function (button) {
	        if (input.isDown(button)) buttons = buttons.concat(button);
	    });

	    var newButtons = buttons.filter(function (button) {
	        return history.indexOf(button) === -1;
	    });

	    var button = void 0,
	        newButton = void 0;

	    var _map = [buttons, newButtons].map(function (poll) {
	        if (poll[0] == 'A' || poll[0] == 'C') {
	            return 'CCW';
	        } else if (poll[0] == 'B') {
	            return 'CW';
	        } else {
	            return '';
	        }
	    });

	    var _map2 = _slicedToArray(_map, 2);

	    button = _map2[0];
	    newButton = _map2[1];


	    var out = { direction: direction, button: button, newButton: newButton };
	    history = buttons;
	    return out;
	};

	exports.handleInput = handleInput;

/***/ }
/******/ ]);