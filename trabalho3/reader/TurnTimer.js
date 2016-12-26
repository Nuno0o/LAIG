function TurnTimer(scene, maxTime){
  this.scene = scene;

  this.base = new MyUnitCubeQuad(this.scene);

  this.pointer = new MyPointer(this.scene);

  this.limitInf = new MyPointer(this.scene);
  this.limitSup = new MyPointer(this.scene);

  this.elapsedTime = 0;
  this.maxTurnTime = maxTime * 1000;

  this.timeUp = false;

  this.angle = 0;
  this.maxAngle = Math.PI/2;

  this.limitAppearance = new CGFappearance(this.scene);
  this.limitAppearance.setDiffuse(1,0,0,1);

}
TurnTimer.prototype.constructor = TurnTimer;

TurnTimer.prototype.update = function(frameDiff){
	this.elapsedTime += frameDiff;
	if (this.elapsedTime >= this.maxTurnTime){ 
		this.elapsedTime = this.maxTurnTime;
		this.timeUp = true;
	}

	var percentTime = this.elapsedTime / this.maxTurnTime;

	this.setAngle(this.maxAngle * percentTime);
}

TurnTimer.prototype.resetTime = function(){
	this.elapsedTime = 0;
	this.timeUp = false;
}

TurnTimer.prototype.setAngle = function(angle){
	this.angle = angle;
}

TurnTimer.prototype.incAngle = function(angle){
	this.angle += angle;
	if (this.angle >= this.maxAngle) this.angle = this.maxAngle;
}

TurnTimer.prototype.display = function(pointerMat){
    this.scene.pushMatrix();
	    this.scene.scale(6,2,0.3);
	    this.base.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
    	this.scene.translate(0,-0.8,0.2525);
    	this.scene.rotate(Math.PI/4 - this.angle, 0, 0, 1);
   		this.pointer.display(pointerMat);
    this.scene.popMatrix();
    this.scene.pushMatrix();
    	this.scene.translate(0,-0.8,0.251);
    	this.scene.rotate(Math.PI/4, 0, 0, 1);
    	this.limitInf.display(this.limitAppearance);
    this.scene.popMatrix();
    this.scene.pushMatrix();
    	this.scene.translate(0,-0.8,0.251);
    	this.scene.rotate(Math.PI/4 - this.maxAngle, 0, 0, 1);
    	this.limitInf.display(this.limitAppearance);
    this.scene.popMatrix();
}


 function MyUnitCubeQuad(scene) {
 	CGFobject.call(this, scene);
 	this.scene = scene;
 	this.quad = new Plane(scene,1,1,2,2);
 };

function MyPointer(scene){
	this.scene = scene;
	this.pointer = new Plane(this.scene, 0.1, 1.5, 1, 1);
}

MyPointer.prototype.constructor = MyPointer;

MyPointer.prototype.display = function(pointerMat){
	this.scene.pushMatrix();
		pointerMat.apply();
		this.scene.translate(0,1,0);
		this.pointer.display();
	this.scene.popMatrix();
}

MyUnitCubeQuad.prototype = Object.create(CGFobject.prototype);
MyUnitCubeQuad.prototype.constructor = MyUnitCubeQuad;

MyUnitCubeQuad.prototype.display = function() {

	var degToRad = Math.PI / 180;

	// front face
	this.scene.pushMatrix();
	this.scene.translate(0, 0, 0.5);
	this.quad.display();
	this.scene.popMatrix();

	// back face
	this.scene.pushMatrix();
	this.scene.rotate(180 * degToRad, 1, 0, 0);
	this.scene.translate(0, 0, 0.5);
	this.quad.display();
	this.scene.popMatrix();

	// top face
	this.scene.pushMatrix();
	this.scene.rotate(-90 * degToRad, 1, 0, 0);
	this.scene.translate(0, 0, 0.5);
	this.quad.display();
	this.scene.popMatrix();

	// back face
	this.scene.pushMatrix();
	this.scene.rotate(90 * degToRad, 1, 0, 0);
	this.scene.translate(0, 0, 0.5);
	this.quad.display();
	this.scene.popMatrix();

	// right face
	this.scene.pushMatrix();
	this.scene.rotate(-90 * degToRad, 0, 1, 0);
	this.scene.translate(0, 0, 0.5);
	this.quad.display();
	this.scene.popMatrix();

	// left face
	this.scene.pushMatrix();
	this.scene.rotate(90 * degToRad, 0, 1, 0);
	this.scene.translate(0, 0, 0.5);
	this.quad.display();
	this.scene.popMatrix();
};
