// -----------------------------------------------------------------------------
// ------------------------------ A BOARD --------------------------------------
// -----------------------------------------------------------------------------

/*
	Element representing a board.
*/
function Board(scene,game){

	this.scene = scene;
	this.game = game;

	this.c1 = scene.gameboard_c1;
	this.c2 = scene.gameboard_c2;
	this.tex = scene.gameboard_tex;
	this.pc1 = scene.gameboard_pc1;
	this.pc2 = scene.gameboard_pc2;
	this.ptex = scene.gameboard_ptex;

	// The board's dimensions.
	this.dimX = 12;
	this.dimY = 12;

	this.selectedTile = 144;

	this.team1aux = new AuxBoard(scene,1);
	this.team2aux = new AuxBoard(scene,2);

	this.currPlayer = 1;

	// 0 Human 1 Random 2 Smart

	this.player1Type = 0;
	this.player2Type = 0;

	this.currTurn = 1;

	// The board's tile set.
	this.tiles = [];
	this.initTiles();

	this.turnTimer1 = new TurnTimer(scene, 30);
	this.turnTimer2 = new TurnTimer(scene, 30);

	this.scoreboard = new Scoreboard(scene);
}

/*
	Board object constructor.
*/
Board.prototype.constructor = Board;

/*
	Get a specific tile
*/
Board.prototype.getTile = function(x,y){
	return this.tiles[y*this.dimX + x];
}

Board.prototype.getQueenSize = function(team){

	var size = 0;
	for(var i = 0;i < this.tiles.length;i++){
		if(this.tiles[i].pieces.length > 1 && this.tiles[i].pieces[0].team == team && this.tiles[i].pieces.length > size)
			size = this.tiles[i].pieces.length;
	}
	return size;
}

/*
	Lay out the board.
*/
Board.prototype.initTiles = function(){
	for (var y = 0; y < this.dimY; y++){
		for(var x = 0; x < this.dimX; x++){
			this.tiles[y*this.dimX + x] = new Tile(this.scene, this, this.scene.gameboard_tilesize,y*this.dimX + x,this.pc1,this.pc2,this.ptex);
		}
	}
}

Board.prototype.setTurnTime = function(turnTime, timer){

	if (timer == 1){
		this.turnTimer1.elapsed = 0;
		this.turnTimer1.maxTurnTime = turnTime * 1000;
	}else {
		this.turnTimer2.elapsed = 0;
		this.turnTimer2.maxTurnTime = turnTime * 1000;
	}

}

Board.prototype.nextTurn = function(){
	if(this.currPlayer == 1){
		this.currPlayer = 2;
		this.turnTimer2.resetTime();
	}else{
		this.currPlayer = 1;
		this.turnTimer1.resetTime();
	}

	this.currTurn++;
}

Board.prototype.updateTimer = function(frameDiff){
	if (this.currPlayer == 1){
		this.turnTimer1.update(frameDiff);
	}else {
		this.turnTimer2.update(frameDiff);
	}
}

Board.prototype.timeUp =function(){
	if (this.currPlayer == 1){
		return this.turnTimer1.timeUp;
	}else {
		return this.turnTimer2.timeUp;
	}
}

Board.prototype.initPieces = function(){
	var tile1 = this.getTile(5,0);
	var tile2 = this.getTile(6,11);
	for(var i = 0 ; i < 20;i++){
		tile1.addPiece(new Piece(this.scene,"piece",1));
		tile2.addPiece(new Piece(this.scene,"piece",2));
	}
}

Board.prototype.setPlayerType = function(player, type){
	if (player == 1){
		this.player1Type = type;
	}
	else this.player2Type = type;
}


Board.prototype.display = function(){
	//Display tiles
	for (var y = 0; y < this.dimY; y++){
		for (var x = 0; x < this.dimX; x++){
			this.scene.pushMatrix();
				if (x % 2 == 0 && y % 2 == 0 || x % 2 != 0 && y % 2 != 0){
					this.scene.listAppearances[this.c1].setTexture(this.scene.listTextures[this.tex].texture);
					this.scene.listAppearances[this.c1].apply();
				}else{
					this.scene.listAppearances[this.c2].setTexture(this.scene.listTextures[this.tex].texture);
					this.scene.listAppearances[this.c2].apply();
				}
				if(this.selectedTile == y*this.dimY + x){
					if(this.currPlayer == 1){
						this.scene.listAppearances[this.pc1].setTexture(this.scene.listTextures[this.tex].texture);
						this.scene.listAppearances[this.pc1].apply();
					}else{
						this.scene.listAppearances[this.pc2].setTexture(this.scene.listTextures[this.tex].texture);
						this.scene.listAppearances[this.pc2].apply();
					}
				}
				if(this.game.gameOver){
					if(this.getQueenSize(1) < this.getQueenSize(2)){
						this.scene.listAppearances[this.pc2].setTexture(this.scene.listTextures[this.tex].texture);
						this.scene.listAppearances[this.pc2].apply();
					}else if(this.getQueenSize(2) < this.getQueenSize(1)){
						this.scene.listAppearances[this.pc1].setTexture(this.scene.listTextures[this.tex].texture);
						this.scene.listAppearances[this.pc1].apply();
					}
				}
				this.scene.translate(this.scene.gameboard_tilesize * x, 0, this.scene.gameboard_tilesize * y);
				this.tiles[y*this.dimX + x].display();
			this.scene.popMatrix();
		}
	}
	//Display auxiliary boards
	this.scene.pushMatrix();
		this.scene.translate(-2 * this.scene.gameboard_tilesize,0,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.team1aux.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(2+(this.scene.gameboard_tilesize*(this.dimX-1)),0,(this.scene.gameboard_tilesize*(this.dimY-1)));
		this.scene.rotate(Math.PI/2,1,0,0);
		this.team2aux.display();
	this.scene.popMatrix();
	//Display scores and timer
	this.scene.pushMatrix();
		this.scene.pushMatrix();

			this.scene.listAppearances[this.c1].setTexture(this.scene.listTextures[this.tex].texture);
			this.scene.listAppearances[this.c1].apply();
			this.scene.rotate(Math.PI/2, 0, 1, 0);
			this.scene.translate(-((this.scene.gameboard_tilesize)*(this.dimX -1) / 2), this.scene.gameboard_tilesize, - 3*this.scene.gameboard_tilesize/4);
			this.scene.scale(this.scene.gameboard_tilesize,this.scene.gameboard_tilesize,this.scene.gameboard_tilesize);
			this.turnTimer1.display(this.scene.listAppearances[this.pc1]);
			this.scene.translate(0,2,0);
			this.scene.listAppearances[this.c1].apply();
			this.scoreboard.display(this.getQueenSize(1));
		this.scene.popMatrix();
		this.scene.pushMatrix();

			this.scene.listAppearances[this.c2].setTexture(this.scene.listTextures[this.tex].texture);
			this.scene.listAppearances[this.c2].apply();

			this.scene.rotate(-Math.PI/2, 0, 1, 0);
			this.scene.translate(((this.scene.gameboard_tilesize)*(this.dimX -1) / 2), this.scene.gameboard_tilesize, - (this.scene.gameboard_tilesize * (this.dimX)) + this.scene.gameboard_tilesize/4);
			this.scene.scale(this.scene.gameboard_tilesize,this.scene.gameboard_tilesize,this.scene.gameboard_tilesize);
			this.turnTimer2.display(this.scene.listAppearances[this.pc2]);
			this.scene.translate(0,2,0);
			this.scene.listAppearances[this.c2].apply();
			this.scoreboard.display(this.getQueenSize(2));
		this.scene.popMatrix();
	this.scene.popMatrix();

}

Board.prototype.convertToPrologBoard = function() {
	var boardString = "[";
	for (var y = 0; y < 12; y++){
		var row = "[";
		for (var x = 0; x < 12; x++){
			var toAppend = "";
			if (this.tiles[y*12 + x].pieces.length == 0){
				toAppend = "empty";
			}
			else if (this.tiles[y*12 + x].pieces.length == 1){
				if (this.tiles[y*12 + x].pieces[0].team == 1){
					toAppend = "ivoryBaby";
				}
				else toAppend = "cigarBaby";
			}
			else {
				if (this.tiles[y*12 + x].pieces[0].team == 1){
					toAppend = "ivoryQueen";
				}
				else toAppend = "cigarQueen";
			}
			if (x != 11) toAppend = toAppend + ",";

			row = row + toAppend;
		}
		row = row + "]";
		if ( y != 11) row = row + ",";

		boardString = boardString + row;
	}
	boardString = boardString + "]";
	return boardString;
}

// -----------------------------------------------------------------------------
// ------------------------------ GAME BOARD -----------------------------------
// -----------------------------------------------------------------------------

/*
	Element representing a main board.
*/

function GameBoard (scene,game) {
	this.scene = scene;
	this.game = game;
	// board element
	this.board = new Board(scene, this.game);
	this.board.initPieces();
}


/*
	Changes the currently selected tyle
*/
GameBoard.prototype.setSelected = function(ind){
	this.board.selectedTile = ind;
}

GameBoard.prototype.getQueenSize = function(team){
	return this.board.getQueenSize(team);
}
/*
	Move
*/
GameBoard.prototype.move = function(indi,indf){
	var originTile = this.board.tiles[indi];
	var destTile = this.board.tiles[indf];
	if(originTile.pieces.length == 0)
		return;
	var ateOne = 0;
	if(destTile.pieces.length >= 1){
		ateOne = 1;
		this.removePieces(indf);
	}
	if(originTile.pieces.length == 1){
		destTile.pieces = originTile.pieces;
		originTile.pieces = [];
	}else{
		var piecesToMove = originTile.pieces.slice(0);
		var pieceToStay = originTile.pieces.slice(0);
		piecesToMove.splice(0,1-ateOne);
		pieceToStay.splice(1-ateOne,pieceToStay.length);
		destTile.pieces = piecesToMove;
		originTile.pieces = pieceToStay;
	}
}

GameBoard.prototype.removePieces = function(ind){
	var tile = this.board.tiles[ind];
	if(tile.pieces.length == 0)
		return;

	if(tile.pieces[0].team == 1){
		this.board.team1aux.pieces = this.board.team1aux.pieces.concat(tile.pieces);
	}else{
		this.board.team2aux.pieces = this.board.team2aux.pieces.concat(tile.pieces);
	}
	tile.pieces = [];
}

GameBoard.prototype.reAddPieces = function(ind,npieces,team){
	var tile = this.board.tiles[ind];
	var aux;
	if(team == 1){
		aux = this.board.team1aux;
	}else{
		aux = this.board.team2aux;
	}
	var piecesToReAdd = aux.pieces.slice(-npieces);
	tile.pieces = piecesToReAdd;
	aux.pieces.splice(-npieces);
}

/*
	Method to display the board.
*/
GameBoard.prototype.display = function(){
	this.board.display();
}

// -----------------------------------------------------------------------------
// ------------------------------ AUX BOARD ------------------------------------
// -----------------------------------------------------------------------------

/*
	Element representing an auxiliary board.
*/

function AuxBoard (scene,team) {

	this.scene = scene;
	this.team = team;

	this.tex = this.scene.gameboard_tex;
	this.ptex = this.scene.gameboard_ptex;

	if(this.team == 1){
		this.c = this.scene.gameboard_c1;
		this.pc = this.scene.gameboard_pc1;
	}else{
		this.c = this.scene.gameboard_c2;
		this.pc = this.scene.gameboard_pc2;
	}


	// board element
	this.pieces = [];

	this.cup = new Cup(scene);
}

AuxBoard.prototype.addPiece = function(piece){
	this.pieces.push(piece);
}


AuxBoard.prototype.display = function(){
	this.scene.listAppearances[this.c].setTexture(this.scene.listTextures[this.tex].texture);
	this.scene.listAppearances[this.c].apply();
	this.cup.display();
	for(var i = 0;i < this.pieces.length;i++){
      this.scene.pushMatrix();
        this.scene.translate(0,0,-0.16-0.16*i);
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        if(this.pieces[i].team == 1){
          this.scene.listAppearances[this.pc].setTexture(this.scene.listTextures[this.ptex].texture);
          this.scene.listAppearances[this.pc].apply();
        }else{
          this.scene.listAppearances[this.pc].setTexture(this.scene.listTextures[this.ptex].texture);
          this.scene.listAppearances[this.pc].apply();
        }
        this.pieces[i].display();
      this.scene.popMatrix();
    }
}
