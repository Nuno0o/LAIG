function Animation(){
	this.id = "";
	this.span = 0;
};

function Animation(parsedAnimation){
	this.id = parsedAnimation.id;
	this.span = parsedAnimation.span;
}

 //Animation.prototype = Object.create(CGFobject.prototype);
 Animation.prototype.constructor = Animation;
 
function LinearAnimation(parsedAnimation){
	this.baseAnimation = new Animation(parsedAnimation);
	
	this.controlPointVec = parsedAnimation.controlPoints;
}

function CircularAnimation(parsedAnimation){
	this.baseAnimation = new Animation(parsedAnimation);
	
	this.centerVec = [parsedAnimation.center_x, parsedAnimation.center_y, parsedAnimation.center_z];
	this.radius = parsedAnimation.radius;
	this.startAng = Math.PI * parsedAnimation.startang / 180;
	this.rotAng = Math.PI * parsedAnimation.rotang / 180;
}