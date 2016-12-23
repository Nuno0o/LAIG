/*
  Element representing a board's piece.
*/
function Piece(scene,prim,team){
  this.scene = scene;

  this.prim = prim;

  this.team = team;
}

/*
  Piece object constructor.
*/
Piece.prototype.constructor = Piece;

/*
  Piece drawing.
*/
Piece.prototype.display = function(){

    this.scene.pushMatrix();
      this.scene.listPrimitives[this.prim].display();
	this.scene.popMatrix();
}
