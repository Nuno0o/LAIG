// -------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ ANIMATIONS -------------------------------------------------
// -------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------
// --------------------------------------------- BASIC ANIMATION -----------------------------------------------
// -------------------------------------------------------------------------------------------------------------

function Animation(){
	this.id = "";
	this.span = 0;
};

function Animation(parsedAnimation){
	this.id = parsedAnimation.id;
	this.span = parsedAnimation.span * 1000;
	this.elapsedTime = 0;
}

Animation.prototype.constructor = Animation;

Animation.prototype.isDone = function(){
	return this.elapsedTime >= this.span;
}

Animation.prototype.update = function(inc){
	this.elapsedTime += inc;
}
 
// -------------------------------------------------------------------------------------------------------------
// ------------------------------------------- LINEAR ANIMATION ------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
 
function LinearAnimation(parsedAnimation){
	this.baseAnimation = new Animation(parsedAnimation);
	
	this.controlPointVec = parsedAnimation.controlPoints;
	this.currentSegment = 0;
	this.totalDistance = this.calcTotalDistance();
}

LinearAnimation.prototype.calcTotalDistance = function(){
	var totalDistance = 0;
	for (var i = 0; i < this.controlPointVec.length - 1; i++){
		var currDistance = Math.sqrt(	(this.controlPointVec[i].xx - this.controlPointVec[i+1].xx) * (this.controlPointVec[i].xx - this.controlPointVec[i+1].xx) +
										(this.controlPointVec[i].yy - this.controlPointVec[i+1].yy) * (this.controlPointVec[i].yy - this.controlPointVec[i+1].yy) +
										(this.controlPointVec[i].zz - this.controlPointVec[i+1].zz) * (this.controlPointVec[i].zz - this.controlPointVec[i+1].zz) );
		totalDistance += currDistance;
	}
	return totalDistance;
}

LinearAnimation.prototype.getCurrTarget = function(){
	return this.controlPointVec[this.currentSegment];
}

LinearAnimation.prototype.incCurrentSegment = function(){
	this.currentSegment++;
}

LinearAnimation.prototype.getCurrentSegment = function(){
	var timeDiv = this.elapsedTime / this.span;
	var supposedDistance = timeDiv * this.totalDistance;
	var d = 0;
	for (var i = 0; i < this.controlPointVec.length - 1; i++){
		var d_before = d;
		var currDistance = Math.sqrt(	(this.controlPointVec[i].xx - this.controlPointVec[i+1].xx) * (this.controlPointVec[i].xx - this.controlPointVec[i+1].xx) +
										(this.controlPointVec[i].yy - this.controlPointVec[i+1].yy) * (this.controlPointVec[i].yy - this.controlPointVec[i+1].yy) +
										(this.controlPointVec[i].zz - this.controlPointVec[i+1].zz) * (this.controlPointVec[i].zz - this.controlPointVec[i+1].zz) );
		d += currDistance;
		if (supposedDistance >= d_before && supposedDistance < d) this.currentSegment = i;
	}
	return this.currentSegment;
}

LinearAnimation.prototype.update = function(frameDiff){
	this.baseAnimation.update(frameDiff);
	
	this.getCurrentSegment();	
}

LinearAnimation.prototype.isDone = function(){
	if (this.baseAnimation.isDone()) return true;
	return false;
}

// ---------------------------------------------------------------------------------------------------------------
// ------------------------------------------- CIRCULAR ANIMATION ------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------

function CircularAnimation(parsedAnimation){
	this.baseAnimation = new Animation(parsedAnimation);
	
	this.centerVec = [parsedAnimation.center_x, parsedAnimation.center_y, parsedAnimation.center_z];
	this.radius = parsedAnimation.radius;
	this.startAng = Math.PI * parsedAnimation.startang / 180;
	this.rotAng = Math.PI * parsedAnimation.rotang / 180;
}

CircularAnimation.prototype.calcTotalDistance = function(){
	return this.radius*this.radius*this.rotAng;
}

CircularAnimation.prototype.update = function(frameDiff){
	this.baseAnimation.update(frameDiff);
}

CircularAnimation.prototype.isDone = function(){
	if (this.baseAnimation.isDone()) return true;
	return false;
}