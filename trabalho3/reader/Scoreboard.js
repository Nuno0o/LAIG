/*
    Object representing a player's scoreboard
*/
function Scoreboard(scene,board){
    this.scene = scene;

    this.base = new MyUnitCubeQuad(this.scene);
    this.plane = new MyPrimRect(this.scene,-0.9,-0.9,0.9,0.9);

    this.initNumbers();
}

/*
    Load an appearance of the score based on a texture
*/
Scoreboard.prototype.initNumbers = function(){
    this.numbers = new CGFappearance(this.scene);
    this.numbers.loadTexture("./resources/images/numbers.png");
}

/*
    Get the current texture to apply based on actual score
*/
Scoreboard.prototype.setNumber = function(n){
    var smin = (n % 5) * 0.2;
	var tmin;
    if(n < 5)
		tmin = 0;
	else tmin = 0.5;
    this.plane.setTex2(smin,smin+0.2,tmin,tmin+0.5);
}
Scoreboard.prototype.constructor = Scoreboard;

/*
    Display the scoreboard
*/
Scoreboard.prototype.display = function(score){
    var n1 = Math.floor(score/10);
    var n2 = score%10;
    this.scene.pushMatrix();
	    this.scene.scale(6,2,0.3);
	    this.base.display();
    this.scene.popMatrix();
    this.numbers.apply();
    this.setNumber(n1);
    this.scene.pushMatrix();
        this.scene.translate(-1.1,0,0.22);
        this.plane.display();
    this.scene.popMatrix();
    this.setNumber(n2);
    this.scene.pushMatrix();
        this.scene.translate(1.1,0,0.22);
        this.plane.display();
    this.scene.popMatrix();
}