Ctris
=====
This is Tetris: The Grandmaster implemented using React with Redux.

To play, just visit the page. The controls are arcade-style, with ASD for movement, and the arrow keys for rotation.

How It Works
=====
The main loop tries to render at 60fps. Each frame, we dispatch a few actions to our reducer. First a rotation, which handles any changes to the orientation of the active tetromino, including wallkicking. Then, if necessary, a cleanup action removes completed lines from the stack once enough time has passed, in one sweep. Finally, the update action returns the state of the game on the next frame.

Normally you would use a handful of smaller functions, instead of one big update, but the logic is entangled in such a way that none of the parts of the store can really be isolated. First it checks ARE* and if we need to spawn a new piece. Then, if there's an active piece we compute left-right movement. If not, direction repetition can still be charged. Finally, we check downward movement, and if the active piece locks, we update the score, level, grade, cleared lines, etc.

Rendering is handled by a handful of react components that are connected to the game store. Namely, Grid, which contains 200 Cells, Score, Timer, Next Piece, Grade, and Level. With such a large number of elements in the DOM, we try to avoid rerendering unnecessarily to prevent framerate dropping.

*ARE is the time between locking a tetromino and the next one spawning. It gets the name from Japanese players calling it あれ, literally "that."
