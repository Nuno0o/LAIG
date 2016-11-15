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
 
Animation.prototype.reset = function(){
	this.elapsedTime = 0;
}
// -------------------------------------------------------------------------------------------------------------
// ------------------------------------------- LINEAR ANIMATION ------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
 
function LinearAnimation(parsedAnimation){
	this.baseAnimation = new Animation(parsedAnimation);
	this.type = "linear";

	this.controlPointVec = parsedAnimation.controlPoints;
	this.currentSegment = 0;
	this.segmentDistances = [];
	this.translations = [0,0,0];
	this.totalDistance = this.calcTotalDistance();
	
}

LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.calcTotalDistance = function(){
	var totalDistance = 0;
	for (var i = 0; i < this.controlPointVec.length - 1; i++){
		var currDistance = Math.sqrt(	(this.controlPointVec[i].xx - this.controlPointVec[i+1].xx) * (this.controlPointVec[i].xx - this.controlPointVec[i+1].xx) +
										(this.controlPointVec[i].yy - this.controlPointVec[i+1].yy) * (this.controlPointVec[i].yy - this.controlPointVec[i+1].yy) +
										(this.controlPointVec[i].zz - this.controlPointVec[i+1].zz) * (this.controlPointVec[i].zz - this.controlPointVec[i+1].zz) );
		totalDistance += currDistance;
		this.segmentDistances[i] = currDistance;
	}
	return totalDistance;
}

LinearAnimation.prototype.getCurrTarget = function(){
	return this.controlPointVec[this.currentSegment + 1];
}

LinearAnimation.prototype.incCurrentSegment = function(){
	this.currentSegment++;
}

LinearAnimation.prototype.getCurrentSegment = function(){
	var timeDiv = this.baseAnimation.elapsedTime / this.baseAnimation.span;
	var supposedDistance = timeDiv * this.totalDistance;
	var d = 0;
	for (var i = 0; i < this.controlPointVec.length - 1; i++){
		var d_before = d;
		var currDistance = Math.sqrt(	(this.controlPointVec[i].xx - this.controlPointVec[i+1].xx) * (this.controlPointVec[i].xx - this.controlPointVec[i+1].xx) +
										(this.controlPointVec[i].yy - this.controlPointVec[i+1].yy) * (this.controlPointVec[i].yy - this.controlPointVec[i+1].yy) +
										(this.controlPointVec[i].zz - this.controlPointVec[i+1].zz) * (this.controlPointVec[i].zz - this.controlPointVec[i+1].zz) );
		d += currDistance;
		if (supposedDistance >= d_before && supposedDistance < d) {
			this.currentSegment = i;
		}
	}
	return this.currentSegment;
}


LinearAnimation.prototype.getTranslationInSegment = function(frameDiff, segment){
	var origin = this.controlPointVec[segment];
	var target = this.controlPointVec[segment + 1];

	var x_totalTrans = target.xx - origin.xx;
	var y_totalTrans = target.yy - origin.yy;
	var z_totalTrans = target.zz - origin.zz;

	var percentDistance = this.segmentDistances[segment] / this.totalDistance;
	var time = percentDistance * this.baseAnimation.span;
	var percentTime = frameDiff / time;

	var x_frameTrans = percentTime * x_totalTrans;
	var y_frameTrans = percentTime * y_totalTrans;
	var z_frameTrans = percentTime * z_totalTrans;

	return [x_frameTrans, y_frameTrans, z_frameTrans];
}

LinearAnimation.prototype.getTranslationInCurrSegment = function(frameDiff){
	var trans = this.getTranslationInSegment(frameDiff, this.currentSegment);
	this.translations = [this.translations[0] + trans[0], this.translations[1] + trans[1], this.translations[2] + trans[2]];
}

LinearAnimation.prototype.update = function(frameDiff){
	this.baseAnimation.update(frameDiff);
	this.getCurrentSegment();
	this.getTranslationInCurrSegment(frameDiff);
}

LinearAnimation.prototype.isDone = function(){
	if (this.baseAnimation.isDone()) return true;
	return false;
}

LinearAnimation.prototype.reset = function(){
	this.baseAnimation.reset();
}

LinearAnimation.prototype.getTranslation = function(){
	return this.translations;
}

// ---------------------------------------------------------------------------------------------------------------
// ------------------------------------------- CIRCULAR ANIMATION ------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------

function CircularAnimation(parsedAnimation){
	this.baseAnimation = new Animation(parsedAnimation);
	this.type = "circular";
	this.centerVec = [parsedAnimation.center_x, parsedAnimation.center_y, parsedAnimation.center_z];
	this.radius = parsedAnimation.radius;
	this.startAng = Math.PI * parsedAnimation.startang / 180;
	this.rotAng = Math.PI * parsedAnimation.rotang / 180;

	this.totalDistance = this.calcTotalDistance();
	this.currAng = this.startAng;
}

CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.updateCurrAng = function(increment) {
	this.currAng += increment;
	if (this.currAng > this.rotAng) this.currAng = this.rotAng;
}

CircularAnimation.prototype.calcTotalDistance = function() {
	return this.rotAng * this.radius;
}

CircularAnimation.prototype.calcIncrement = function(frameDiff){
	return this.rotAng * frameDiff / this.baseAnimation.span;
}

CircularAnimation.prototype.update = function(frameDiff){
	this.baseAnimation.update(frameDiff);
	this.updateCurrAng(this.calcIncrement(frameDiff));
}

CircularAnimation.prototype.isDone = function(){
	if (this.baseAnimation.isDone()) return true;
	return false;
}

CircularAnimation.prototype.reset = function(){
	this.baseAnimation.reset();
	this.currAng = 0;
}

CircularAnimation.prototype.getTranslation = function(){
	var x = this.centerVec[0] + (this.radius * Math.cos(this.startAng + this.currAng));
	var y = this.centerVec[1];
	var z = this.centerVec[2] + (this.radius * Math.sin(this.startAng + this.currAng));

	return [x, y, z];
}