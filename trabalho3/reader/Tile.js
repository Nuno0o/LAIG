/*
  Element representing a board's tile.
*/
function Tile(scene, board, color){
  this.scene = scene;

  // The board containing the tile. May be main or auxiliary board.
  this.board = board;

  // The piece on the tile. If there's a piece, point to it. Else null;
  this.piece = null;

  // The color of the tile.
  this.color = color;

  // The physical representation of the tile
  this.plane = new Plane(this.scene,1,1,10,10);
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
  Method to set the tile's color.
*/
Tile.prototype.setColor = function(RGBA){
  this.color = RGBA;
}

/*
  Tile drawing.
*/
Tile.prototype.display = function(){

    this.scene.pushMatrix();
      this.scene.rotate(-Math.PI/2, 1, 0, 0);
      this.plane.display();
    this.scene.popMatrix();
}
