/*
	Object representing a piece's animation from a pair of coordinates to a given target
*/
function PieceAnimation(pieces,x,y,targetX,targetY,tileSize,play,tag){

	this.pieces = pieces;

	// Time to complete animation
	this.span = 0.5 * 1000;

	// Max height of arch
	this.archHeight = 5;

	// Board's tile size
	this.tileSize = tileSize;

	// Pairs of coordinates, based on given x, and y
	this.from = [x,y];
	this.to = [targetX,targetY];

	// Position calculated from time occured
	this.elapsed = 0;

	// Check's if time up
	this.isDone = false;

	// Calculate the distance to travel (on a straight line)
	this.totalDistance = [	(this.to[0] - this.from[0])*this.tileSize, 
							this.archHeight,
							(this.to[1] - this.from[1])*this.tileSize];

	// Saved play. To be executed when the animation ends
	this.play = play;

	// Is capturing?
	this.tag = tag;
};

PieceAnimation.prototype.constructor = PieceAnimation;

/*
	Update the animation based on time elapsed
*/
PieceAnimation.prototype.update = function(frameDiff) {
	this.elapsed += frameDiff;
	if (this.elapsed >= this.span){
		this.isDone = true;
		this.elapsed = this.span;
	}
}

/*
	Reset time
*/
PieceAnimation.prototype.reset = function(){
	this.elapsed = 0;
	this.isDone = false;
}

/*
	Calculate the current position for the current time. Y position travels in an arch
*/
PieceAnimation.prototype.getCurrentPosition = function() {
	var percentTime = this.elapsed / this.span;

	var position = [	this.totalDistance[0] * percentTime,
						this.totalDistance[1] * Math.cos(percentTime* (-Math.PI) + Math.PI/2),
						this.totalDistance[2] * percentTime];				
	return position;
}