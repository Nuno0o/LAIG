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
  // The physical representation of the tile
  this.size = size;

  this.id = id;
  this.plane = new Plane(this.scene, size, size, 2, 2);

  this.animation = null;
  this.piecesInAnimation = false;
  this.holdAnimation = false;
}

/*
  Tile object constructor.
*/
Tile.prototype.constructor = Tile;

/*
	Method to add a piece
*/
Tile.prototype.addPiece = function(piece){
  this.pieces.push(piece);
}
/*
	Method to remove a piece
*/
Tile.prototype.removePiece = function(){
  this.pieces.pop(piece);
}
/*
	Set animation
*/
Tile.prototype.setInAnimation = function(inAnimation, animation){
  this.piecesInAnimation = inAnimation;
  this.animation = animation;
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
    for(var i = 0;i < this.pieces.length;i++){
      this.scene.pushMatrix();
        if (this.piecesInAnimation){
          var translate = this.animation.getCurrentPosition();
          this.scene.translate(translate[0],translate[1],translate[2]);
        }
        this.scene.translate(0,0.16*i,0);
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

      if (this.piecesInAnimation){
        if(this.animation != null){
          if(this.animation.isDone){
            if(!this.holdAnimation){
              this.piecesInAnimation = false;
              this.animation = null;
            }
            
          }
        }
      }
    }
}
