/*
	Object representing a game
*/
function Game(scene){

	// The game's board and scene to draw it on.
	this.gameboard = new GameBoard(scene,this);
	this.scene = scene;

	// Saved plays
	this.playStack = [];

	// Film management
	this.runningGameFilm = false;
	this.currentFilmFrame = -1;
	this.filmStack = [];

	// Animation management
	this.animatingPiece = false;
	this.currentPieceAnimation = null;

	// Checks if the game is over
	this.gameOver = false;

	// Establishes connection to SICstus, etc.
	this.prologinput = new PrologInput(this);
}

Game.prototype.constructor = Game;
/*
	Change the scene of the game
*/
Game.prototype.setScene = function(scene) {
	this.scene = scene;
}
/*
	Change the board of the game
*/
Game.prototype.setBoard = function(newboard){
	this.gameboard = newboard;
}
/*
	Make a play
*/
Game.prototype.makePlay = function(pushPlay, play){

	// Reset selected tile
	this.gameboard.board.selectedTile = 144;

	// Save play? If so, push to stack
	if (pushPlay) this.playStack.push(play);

	var indi = play.x + play.y * 12;
	var indf = play.targetX + play.targetY * 12;

	// Actually execute the play
	this.gameboard.move(indi, indf);

    // Pass the turn
    if(!play.isGameOver){
        this.gameboard.board.nextTurn();
        this.scene.inBotPlay = false;
    }
    else {
		this.gameOver = true;
    }
}

/*
	Restart the game
*/
Game.prototype.resetGame = function(){
	this.gameOver = false;
	this.playStack = [];
	this.gameboard = new GameBoard(this.scene,this);

	this.prologinput = new PrologInput(this);

	this.runningGameFilm = false;
	this.currentFilmFrame = -1;
}
/*
	Undo last play (does all plays from the beginning, on a fresh board)
*/
Game.prototype.undo = function(){
	this.gameOver = false;
	this.playStack.pop();

	this.gameboard = new GameBoard(this.scene,this);

	this.prologinput = new PrologInput(this);

	if (this.playStack.length == 0) return;

	for (var i = 0; i < this.playStack.length; i++){
		this.makePlay(false, this.playStack[i]);
	}
}

/*
	Run game film: indicates to the scene that the film is now playing
*/
Game.prototype.runGameFilm = function(){
	this.gameOver = false;
	this.gameboard = new GameBoard(this.scene,this);
	this.prologinput = null;

	this.animatingPiece = false;
	this.currentPieceAnimation = null;

	this.runningGameFilm = true;
	this.currentFilmFrame = -1;

	this.filmStack = this.playStack;
	this.playStack = [];
}

/*
	Play next film frame
*/
Game.prototype.nextFrame = function(){

	// Reached end? Go back to the game
	if (this.currentFilmFrame >= this.filmStack.length){
		this.runningGameFilm = false;
		this.prologinput = new PrologInput(this);
		return;
	}

	// Update frame
	this.currentFilmFrame++;

	// Reached end? Go back to the game
	if (this.currentFilmFrame >= this.filmStack.length){
		this.runningGameFilm = false;
		this.prologinput = new PrologInput(this);
		return;
	}


	// Play frame
	var currentPlay = this.filmStack[this.currentFilmFrame];

	this.animatingPiece = true;
	this.currentPieceAnimation = new PieceAnimation(this.gameboard.board.tiles[currentPlay.x + currentPlay.y * 12].pieces,
													currentPlay.x, currentPlay.y,
													currentPlay.targetX,currentPlay.targetY,
													this.gameboard.board.tileSize,
													currentPlay,
													true);
	this.currentPieceAnimation.span = 1000;
	this.gameboard.board.tiles[this.currentPieceAnimation.from[1]*12 + this.currentPieceAnimation.from[0]].setInAnimation(true, this.currentPieceAnimation);
}

/*
	Set the current piece animation to a new one
*/
Game.prototype.setCurrentPieceAnimation = function(pieceAnimation){
	this.currentPieceAnimation = pieceAnimation;
	this.animatingPiece = true;
}


/*
	Update the piece animation playing. If it's not done, continue. If it's done, check if a piece was captured. If so, add a new animation of the captured piece being captured.
*/
Game.prototype.updateCurrentPieceAnimation = function(frameDiff){

	if (this.currentPieceAnimation != null && this.currentPieceAnimation != undefined && this.animatingPiece){
		this.currentPieceAnimation.update(frameDiff);

		// Animation is done
		if (this.currentPieceAnimation.isDone){
			// Captured a piece
			if (this.gameboard.board.tiles[this.currentPieceAnimation.play.targetX + this.currentPieceAnimation.play.targetY * 12].pieces.length != 0){
				// At the end of capturing animation -> execute play
				if (this.currentPieceAnimation.tag == false) {
					this.makePlay(true, this.currentPieceAnimation.play);
					this.gameboard.board.tiles[this.currentPieceAnimation.play.y*12 + this.currentPieceAnimation.play.x].holdAnimation = false;
					this.currentPieceAnimation = null;
					this.animatingPiece = false;
					return;
				}
				else {
					// Get all information to create capturing animation
					if (this.gameboard.board.tiles[this.currentPieceAnimation.play.targetX + this.currentPieceAnimation.play.targetY * 12].pieces[0].team == 1) {
						targetX = -2*this.scene.gameboard_tilesize;
						targetY = 0;
					}
					else {
						targetX = 2+(this.scene.gameboard_tilesize*(this.gameboard.board.dimX-1));
						targetY = this.scene.gameboard_tilesize*(this.gameboard.board.dimY-1);
					}
					this.currentPieceAnimation = new PieceAnimation(this.gameboard.board.tiles[this.currentPieceAnimation.to[0] + this.currentPieceAnimation.to[1] * 12].pieces,
																this.currentPieceAnimation.to[0],this.currentPieceAnimation.to[1],
																targetX,targetY,
																this.scene.gameboard_tilesize,
																this.currentPieceAnimation.play,
																false);
					this.gameboard.board.tiles[this.currentPieceAnimation.play.y*12 + this.currentPieceAnimation.play.x].holdAnimation = true;
					this.gameboard.board.tiles[this.currentPieceAnimation.from[1]*12 + this.currentPieceAnimation.from[0]].setInAnimation(true, this.currentPieceAnimation);
					this.animatingPiece = true;

					return;
				}
			}
			else {
				// Didn't capture -> make play
				this.makePlay(true, this.currentPieceAnimation.play);
				this.animatingPiece = false;
				this.currentPieceAnimation = null;
				return;
			}
		}
		else {
			// Animation not done, continue
			this.animatingPiece = true;
			return;
		}
	}

	// No animation playing
	this.animatingPiece = false;

}
