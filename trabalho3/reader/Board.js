// -----------------------------------------------------------------------------
// ------------------------------ A BOARD --------------------------------------
// -----------------------------------------------------------------------------

/*
	Element representing a board.
*/
function Board(scene, dimX, dimY){

	// The board's tile set.
	this.tiles = [];

	// The board's dimensions.
	this.dimX = dimX;
	this.dimY = dimY;

}

/*
	Board object constructor.
*/
Board.prototype.constructor = Board;

/*
	Method to set the board's tiles.
*/
Board.prototype.setTiles = function(tiles){
	this.tiles = tiles;
}

/*
	Method to get the board's tiles.
*/

Board.prototype.getTiles = function(){
	return this.tiles;
}

/*
	Method to get the board's number of columns.
*/

Board.prototype.getDimX = function(){
	return this.dimX;
}

/*
	Method to set the board's number of lines.
*/

Board.prototype.getDimY = function(){
	return this.dimY;
}

// -----------------------------------------------------------------------------
// ------------------------------ GAME BOARD -----------------------------------
// -----------------------------------------------------------------------------

/*
	Element representing a main board.
*/

function GameBoard (scene, dimX, dimY) {

	// board element
	this.board = new Board(scene, dimX, dimY);
}

/*
	Method to get the game board's tiles.
*/

GameBoard.prototype.getTiles = function(){
	return this.board.tiles;
}

/*
	Method to get the game board's number of rows.
*/

GameBoard.prototype.getDimY = function(){
	return this.board.dimY;
}

/*
	Method to get the game board's number of columns.
*/

GameBoard.prototype.getDimX = function(){
	return this.board.dimX;
}

/*
	Method to set the game board's tiles.
*/

GameBoard.prototype.setTiles = function(tiles){
	this.board.setTiles(tiles);
}

/*
	Method to get a specific tile.
*/

GameBoard.prototype.getTile = function(col, row){
	var index = this.board.dimY * row + col;
	return this.board.tiles[index];
}

/*
	Method to set a specific tile.
*/

GameBoard.prototype.setTile = function(col, row, tile){
	
	var gotTile = this.getTile(col, row);
	
	gotTile = tile;
}

/*
	Method to move a piece from a position to a target.
*/

GameBoard.prototype.move = function(oldCol, oldRow, newCol, newRow){
	
	var currentTile = this.getTile(oldCol, oldRow);
	var targetTile = this.getTile(newCol, newRow);
	
	currentTile.piece.moveToTile(targetTile);
}

/*
	Method to display the board.
*/

GameBoard.prototype.display = function(){
	this.scene.pushMatrix();

	this.scene.popMatrix();
}

// -----------------------------------------------------------------------------
// ------------------------------ AUX BOARD ------------------------------------
// -----------------------------------------------------------------------------

/*
	Element representing an auxiliary board.
*/

function AuxBoard (scene, dimX, dimY) {

	// board element
	this.board = new Board(scene, dimX, dimY);
}

/*
	Method to get an auxiliary board's tiles.
*/

AuxBoard.prototype.getTiles = function(){
	return this.board.tiles;
}

/*
	Method to get an auxiliary board's number of rows.
*/

AuxBoard.prototype.getDimY = function(){
	return this.board.dimY;
}

/*
	Method to get an auxiliary board's number of columns.
*/

AuxBoard.prototype.getDimX = function(){
	return this.board.dimX;
}

/*
	Method to set an auxiliary board's tiles.
*/

AuxBoard.prototype.setTiles = function(tiles){
	this.board.setTiles(tiles);
}

/*
	Method to get a specific tile.
*/

AuxBoard.prototype.getTile = function(col, row){
	var index = this.board.dimY * row + col;
	return this.board.tiles[index];
}

/*
	Method to set a specific tile.
*/

AuxBoard.prototype.setTile = function(col, row, tile){
	
	var gotTile = this.getTile(col, row);
	
	gotTile = tile;
}

/*
	Method to display the board.
*/

AuxBoard.prototype.display = function(){
	this.scene.pushMatrix();
	//displaying goes here
	this.scene.popMatrix();
}