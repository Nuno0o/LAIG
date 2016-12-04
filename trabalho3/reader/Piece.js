/*
  Element representing a board's piece.
*/
function Piece(scene){
  this.scene = scene;

  // The tile occupied by the piece
  this.tile = null;
}

/*
  Piece object constructor.
*/
Piece.prototype.constructor = Piece;

/*
  Method to set the piece's state.
*/
Piece.prototype.setTile = function(tile){
  this.tile = tile;
}

/*
  Method to get the piece's tile (null if none).
*/
Piece.prototype.getTile = function(){
  return this.tile;
}

/*
  Method to move the piece from current tile to a targetTile
*/
Piece.prototype.moveToTile = function(targetTile){
  this.tile.setPiece(null);
  this.setTile(null);
  this.setTile(targetTile);
  targetTile.setPiece(this);
}

/*
  Piece drawing.
*/
Piece.prototype.display = function(){

    this.scene.pushMatrix();

      // displaying goes here.

    this.scene.popMatrix();
}
