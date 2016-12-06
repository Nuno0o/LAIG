/*
  Element representing a board's tile.
*/
function Tile(scene, board, size, id){
  this.scene = scene;

  // The board containing the tile. May be main or auxiliary board.
  this.board = board;

  // The piece on the tile. If there's a piece, point to it. Else null;
  this.piece = null;

  // The physical representation of the tile
  this.size = size;

  this.id = id;
  this.plane = new Plane(this.scene, size, size, 2, 2);
}

/*
  Tile object constructor.
*/
Tile.prototype.constructor = Tile;

/*
  Method to set the tile's state.
*/
Tile.prototype.setPiece = function(piece){
  this.piece = piece;
}

/*
  Method to get the tile's piece (null if none). Why not just tile.piece...?
*/
Tile.prototype.getPiece = function(){
  return this.piece;
}

/*
  Tile drawing.
*/
Tile.prototype.display = function(){

    this.scene.pushMatrix();
      this.scene.rotate(-Math.PI/2, 1, 0, 0);
      this.scene.registerForPick(this.id, this.plane);
      this.plane.display();
    this.scene.popMatrix();
}
