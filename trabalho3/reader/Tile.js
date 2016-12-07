/*
  Element representing a board's tile.
*/
function Tile(scene, board, size, id,pc1,pc2,ptex){
  this.scene = scene;
  this.pc1 = pc1;
  this.pc2 = pc2;
  this.ptex = ptex;
  // The board containing the tile. May be main or auxiliary board.
  this.board = board;

  // The piece on the tile. If there's a piece, point to it. Else null;
  this.pieces = [];
  this.addPiece(new Piece(scene,"piece",1));
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
Tile.prototype.addPiece = function(piece){
  this.pieces.push(piece);
}

Tile.prototype.removePiece = function(){
  this.pieces.pop(piece);
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
    //console.log(this.pieces.size);
    for(var i = 0;i < this.pieces.length;i++){
      this.scene.pushMatrix();
        this.scene.translate(0,0.15*i,0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        if(this.pieces[i].team == 1){
          this.scene.listAppearances[this.pc1].setTexture(this.scene.listTextures[this.ptex].texture);
					this.scene.listAppearances[this.pc1].apply();
        }else{
          this.scene.listAppearances[this.pc2].setTexture(this.scene.listTextures[this.ptex].texture);
					this.scene.listAppearances[this.pc2].apply();
        }
        this.pieces[i].display();
      this.scene.popMatrix();
    }
}
