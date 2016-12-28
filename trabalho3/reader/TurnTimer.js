/*
	An object representing a player's turn timer (visuals only)
*/
function TurnTimer(scene, maxTime){
  this.scene = scene;

  // Rectangle base
  this.base = new MyUnitCubeQuad(this.scene);

  // Pointer needle
  this.pointer = new MyPointer(this.scene);

  // Limits
  this.limitInf = new MyPointer(this.scene);
  this.limitSup = new MyPointer(this.scene);

  // Actual timer
  this.elapsedTime = 0;
  this.maxTurnTime = maxTime * 1000;

  // Checks time up
  this.timeUp = false;

  // Pointer angle management
  this.angle = 0;
  this.maxAngle = Math.PI/2;

  // Grey looking material for limits
  this.limitAppearance = new CGFappearance(this.scene);
  this.limitAppearance.setDiffuse(1,0,0,1);

}
TurnTimer.prototype.constructor = TurnTimer;

/*
	Update the timer, both time and pointer.
*/
TurnTimer.prototype.update = function(frameDiff){

	// update time
	this.elapsedTime += frameDiff;
	if (this.elapsedTime >= this.maxTurnTime){ 
		this.elapsedTime = this.maxTurnTime;
		this.timeUp = true;
	}

	var percentTime = this.elapsedTime / this.maxTurnTime;

	// update pointer
	this.setAngle(this.maxAngle * percentTime);
}

/*
	Reset the time to 0
*/
TurnTimer.prototype.resetTime = function(){
	this.elapsedTime = 0;
	this.timeUp = false;
}

/*
	Set the pointer angle
*/
TurnTimer.prototype.setAngle = function(angle){
	this.angle = angle;
}

/*
	Increment the pointer angle based on increment given
*/
TurnTimer.prototype.incAngle = function(angle){
	this.angle += angle;
	if (this.angle >= this.maxAngle) this.angle = this.maxAngle;
}

/*
	Display the timer
*/
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

/*
	Object representing a timer's pointer (pointer, limits)
*/
function MyPointer(scene){
	this.scene = scene;
	this.pointer = new Plane(this.scene, 0.1, 1.5, 1, 1);
}

MyPointer.prototype.constructor = MyPointer;

/*
	Display the pointer
*/
MyPointer.prototype.display = function(pointerMat){
	this.scene.pushMatrix();
		pointerMat.apply();
		this.scene.translate(0,1,0);
		this.pointer.display();
	this.scene.popMatrix();
}


/*
	An object representing a cube (used for the timer's rectangle base)
*/

function MyUnitCubeQuad(scene) {
	CGFobject.call(this, scene);
	this.scene = scene;
	this.quad = new Plane(scene,1,1,2,2);
};

MyUnitCubeQuad.prototype = Object.create(CGFobject.prototype);
MyUnitCubeQuad.prototype.constructor = MyUnitCubeQuad;

/*
	Display the cube
*/
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
