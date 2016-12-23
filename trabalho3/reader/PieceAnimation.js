function PieceAnimation(pieces,x,y,targetX,targetY,tileSize,play,tag){

	this.pieces = pieces;

	this.span = 0.5 * 1000;
	this.archHeight = 5;

	this.tileSize = tileSize;

	this.from = [x,y];
	this.to = [targetX,targetY];

	this.elapsed = 0;
	this.isDone = false;

	this.totalDistance = [	(this.to[0] - this.from[0])*this.tileSize, 
							this.archHeight,
							(this.to[1] - this.from[1])*this.tileSize];

	this.play = play;
	this.tag = tag;
};

PieceAnimation.prototype.constructor = PieceAnimation;

PieceAnimation.prototype.update = function(frameDiff) {
	this.elapsed += frameDiff;
	if (this.elapsed >= this.span){
		this.isDone = true;
		this.elapsed = this.span;
	}
}

PieceAnimation.prototype.reset = function(){
	this.elapsed = 0;
	this.isDone = false;
}

PieceAnimation.prototype.getCurrentPosition = function() {
	var percentTime = this.elapsed / this.span;

	var position = [	this.totalDistance[0] * percentTime,
						this.totalDistance[1] * Math.cos(percentTime* (-Math.PI) + Math.PI/2),
						this.totalDistance[2] * percentTime];				
	return position;
}