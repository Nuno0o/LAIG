function CameraAnimation(parsed){

	this.id = parsed.id;
	this.span = parsed.span * 1000;

	this.from = [parsed.from_x, parsed.from_y, parsed.from_z];
	this.to = [parsed.to_x, parsed.to_y, parsed.to_z];
	this.target = [parsed.target_x, parsed.target_y, parsed.target_z];

	this.elapsed = 0;
	this.isDone = false;

	this.totalDistance = [this.to[0] - this.from[0], this.to[1] - this.from[1], this.to[2] - this.from[2]];

};

CameraAnimation.prototype.constructor = CameraAnimation;

CameraAnimation.prototype.update = function(frameDiff) {
	this.elapsed += frameDiff;
	if (this.elapsed >= this.span){
		this.isDone = true;
		this.elapsed = this.span;
	}
}

CameraAnimation.prototype.reset = function(){
	this.elapsed = 0;
	this.isDone = false;
}

CameraAnimation.prototype.getCurrentPosition = function() {
	var percentTime = this.elapsed / this.span;

	var position = [	this.from[0] + this.totalDistance[0] * percentTime,
						this.from[1] + this.totalDistance[1] * percentTime,
						this.from[2] + this.totalDistance[2] * percentTime];				
	return position;
}