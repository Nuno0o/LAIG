// -----------------------------------------------------------------------------
// ------------------------------ A BOARD --------------------------------------
// -----------------------------------------------------------------------------

/*
	Element representing a board.
*/
function Board(scene, dimX, dimY, tileSize){

	this.scene = scene;
	this.tileSize = tileSize;
	this.c1 = scene.gameboard_c1;
	this.c2 = scene.gameboard_c2;
	this.tex = scene.gameboard_tex;
	this.pc1 = scene.gameboard_pc1;
	this.pc2 = scene.gameboard_pc2;
	this.ptex = scene.gameboard_ptex;
	// The board's dimensions.
	this.dimX = dimX;
	this.dimY = dimY;

	this.selectedTile = 144;

	this.team1aux = new AuxBoard(scene,1);
	this.team2aux = new AuxBoard(scene,2);

	this.currPlayer = 1;
	this.currTurn = 1;

	// The board's tile set.
	this.tiles = [];
	this.initTiles();
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

/*
	Lay out the board.
*/
Board.prototype.initTiles = function(){
	for (var y = 0; y < this.dimY; y++){
		for(var x = 0; x < this.dimX; x++){
			this.tiles[y*this.dimX + x] = new Tile(this.scene, this, this.tileSize,y*this.dimX + x,this.pc1,this.pc2,this.ptex);
		}
	}
}

Board.prototype.nextTurn = function(){
	if(this.currPlayer == 1){
		this.currPlayer = 2;
	}else this.currPlayer = 1;

	this.currTurn++;
}

Board.prototype.initPieces = function(){
	var tile1 = this.getTile(5,0);
	var tile2 = this.getTile(6,11);
	for(var i = 0 ; i < 20;i++){
		tile1.addPiece(new Piece(this.scene,"piece",1));
		tile2.addPiece(new Piece(this.scene,"piece",2));
	}
}


Board.prototype.display = function(){
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
				this.scene.translate(this.tileSize * x, 0, this.tileSize * y);
				this.tiles[y*this.dimX + x].display();
			this.scene.popMatrix();
		}
	}
	this.scene.pushMatrix();
		this.scene.translate(-2 * this.tileSize,0,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.team1aux.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(2+(this.tileSize*(this.dimX-1)),0,(this.tileSize*(this.dimY-1)));
		this.scene.rotate(Math.PI/2,1,0,0);
		this.team2aux.display();
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

function GameBoard (scene, dimX, dimY, tileSize,c1,c2,tex,pc1,pc2,ptex) {

	// board element
	this.board = new Board(scene, dimX, dimY, tileSize);
	this.board.initPieces();
}


/*
	Changes the currently selected tyle
*/
GameBoard.prototype.setSelected = function(ind){
	this.board.selectedTile = ind;
}

GameBoard.prototype.getQueenSize = function(team){
	var size = 0;
	for(var i = 0;i < this.board.tiles.length;i++){
		if(this.board.tiles[i].pieces.length > 1 && this.board.tiles[i].pieces[0].team == team && this.board.tiles[i].pieces.length > size)
			size = this.board.tiles[i].pieces.length;
	}
	return size;
}
/*
	Move
*/
GameBoard.prototype.move = function(indi,indf){
	var originTile = this.board.tiles[indi];
	var destTile = this.board.tiles[indf];
	if(originTile.pieces.length == 0)
		return;
	
	if(destTile.pieces.length > 1){
		this.removePieces(indf);
	}
	if(originTile.pieces.length == 1){
		destTile.pieces = originTile.pieces;
		originTile.pieces = [];
	}else{
		var piecesToMove = originTile.pieces.slice(0);
		var pieceToStay = originTile.pieces.slice(0);
		piecesToMove.splice(0,1);
		pieceToStay.splice(1,pieceToStay.length-1);
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