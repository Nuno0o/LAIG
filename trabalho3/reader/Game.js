function Game(scene, gameboard){

	this.gameboard = gameboard;
	this.scene = scene;

	this.playStack = [];

	this.runningGameFilm = false;
	this.currentFilmFrame = -1;
	this.filmStack = [];

	this.animatingPiece = false;
	this.currentPieceAnimation = null;

	this.prologinput = new PrologInput(this);
}

Game.prototype.constructor = Game;

Game.prototype.setScene = function(scene) {
	this.scene = scene;
}

Game.prototype.setBoard = function(newboard){
	this.gameboard = newboard;
}

Game.prototype.makePlay = function(pushPlay, play){

	this.gameboard.board.selectedTile = 144;

	if (pushPlay) this.playStack.push(play);

	var indi = play.x + play.y * 12;
	var indf = play.targetX + play.targetY * 12;

	this.gameboard.move(indi, indf);

    // pass the turn
    if(!play.isGameOver){
        this.gameboard.board.nextTurn();
        this.scene.inBotPlay = false;
    }
    else {
        console.log("GAME OVER!");
    }
}

Game.prototype.resetGame = function(){
	this.playStack = [];
	this.gameboard = new GameBoard(this.scene,this);

	this.prologinput = new PrologInput(this);

	this.runningGameFilm = false;
	this.currentFilmFrame = -1;
}

Game.prototype.undo = function(){
	this.playStack.pop();

	this.gameboard = new GameBoard(this.scene,this);

	this.prologinput = new PrologInput(this);

	if (this.playStack.length == 0) return;

	for (var i = 0; i < this.playStack.length; i++){
		this.makePlay(false, this.playStack[i]);
	}
}

Game.prototype.runGameFilm = function(){
	this.gameboard = new GameBoard(this.scene,this);
	this.prologinput = null;

	this.animatingPiece = false;
	this.currentPieceAnimation = null;

	this.runningGameFilm = true;
	this.currentFilmFrame = -1;

	this.filmStack = this.playStack;
	this.playStack = [];
}

Game.prototype.nextFrame = function(){
	if (this.currentFilmFrame >= this.filmStack.length){
		this.runningGameFilm = false;
		this.prologinput = new PrologInput(this);
		return;
	}

	this.currentFilmFrame++;

	if (this.currentFilmFrame >= this.filmStack.length){
		this.runningGameFilm = false;
		this.prologinput = new PrologInput(this);
		return;
	}

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

Game.prototype.setCurrentPieceAnimation = function(pieceAnimation){
	this.currentPieceAnimation = pieceAnimation;
	this.animatingPiece = true;
}

Game.prototype.updateCurrentPieceAnimation = function(frameDiff){

	if (this.currentPieceAnimation != null && this.currentPieceAnimation != undefined && this.animatingPiece){
		this.currentPieceAnimation.update(frameDiff);
		if (this.currentPieceAnimation.isDone){
			if (this.gameboard.board.tiles[this.currentPieceAnimation.play.targetX + this.currentPieceAnimation.play.targetY * 12].pieces.length != 0){
				if (this.currentPieceAnimation.tag == false) {
					this.makePlay(true, this.currentPieceAnimation.play);
					this.gameboard.board.tiles[this.currentPieceAnimation.play.y*12 + this.currentPieceAnimation.play.x].holdAnimation = false;
					this.currentPieceAnimation = null;
					this.animatingPiece = false;
					return;
				}
				else {
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
				this.makePlay(true, this.currentPieceAnimation.play);
				this.animatingPiece = false;
				this.currentPieceAnimation = null;
				return;
			}
		}
		else {
			this.animatingPiece = true;
			return;
		}
	}
	this.animatingPiece = false;

}
