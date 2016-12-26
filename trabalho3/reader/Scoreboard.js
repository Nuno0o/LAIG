function Scoreboard(scene,board){
    this.scene = scene;

    this.base = new MyUnitCubeQuad(this.scene);
}

Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.display = function(){
    this.scene.pushMatrix();
	    this.scene.scale(6,2,0.3);
	    this.base.display();
    this.scene.popMatrix();
}