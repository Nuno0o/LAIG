function MyPrimPiece(scene, tileSize){

	this.scene = scene;
	this.tileSize= tileSize * 2;
	this.cylinder = new MyPrimCylinder(this.scene, 20,5, 0.48, 1, 1);
	this.torusTop = new MyPrimTorus(this.scene, 0.8, 1,20,20);
 };

 MyPrimPiece.prototype = Object.create(CGFobject.prototype);
 MyPrimPiece.prototype.constructor = MyPrimPiece;

 MyPrimPiece.prototype.display = function(){

 	this.scene.pushMatrix();
 		this.scene.scale(1/this.tileSize, 1/this.tileSize, 1/this.tileSize);
 		this.cylinder.display();
 		this.scene.translate(0, 0, 0.48);
 		this.torusTop.display();
 		this.scene.scale(0.65, 0.65, 0.3);
 		this.torusTop.display();
 	this.scene.popMatrix();
 }
