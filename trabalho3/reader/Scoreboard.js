function Scoreboard(scene,board){
    this.scene = scene;

    this.base = new MyUnitCubeQuad(this.scene);
    this.plane = new MyPrimRect(this.scene,-0.9,-0.9,0.9,0.9);

    this.initNumbers();
    this.initShaders();
}

Scoreboard.prototype.initShaders = function(){
    this.shader = new CGFshader(this.scene.gl,"resources/shaders/score.vert","resources/shaders/score.frag");
    this.shader.setUniformsValues({uSampler2: 1});
}

Scoreboard.prototype.initNumbers = function(){
    this.numbers = new CGFappearance(this.scene);
    this.numbers.loadTexture("./resources/images/numbers.png");
}


Scoreboard.prototype.setNumber = function(n){
    var smin = (n*0.2) % 1;
    var tmin = Math.floor(n/6)/2;
    this.plane.setTex2(smin,smin+0.2,tmin,tmin+0.5);
}

Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.display = function(score){
    var n1 = Math.floor(score/10);
    var n2 = score%10;
    this.scene.pushMatrix();
	    this.scene.scale(6,2,0.3);
	    this.base.display();
    this.scene.popMatrix();
    this.numbers.apply();
    this.numbers.texture.bind(1);
    this.setNumber(n1);
    this.scene.setActiveShader(this.shader);
    this.scene.pushMatrix();
        this.scene.translate(-1.1,0,0.22);
        this.plane.display();
    this.scene.popMatrix();
    this.setNumber(n2);
    this.scene.pushMatrix();
        this.scene.translate(1.1,0,0.22);
        this.plane.display();
    this.scene.popMatrix();
    this.scene.setActiveShader(this.scene.defaultShader);
}
