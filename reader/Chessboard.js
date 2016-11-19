function Chessboard(scene,du,dv,tex,su,sv,c1,c2,cs){
  this.scene = scene;
  this.du = du;
  this.dv = dv;
  this.tex = tex;
  this.su = su;
  this.sv = sv;
  this.c1 = c1;
  this.c2 = c2;
  this.cs = cs;
  this.initShaders();
  this.board = new Plane(scene,1,1,du*4,dv*4);
}

Chessboard.prototype.initShaders = function(){
  this.shader = new CGFshader(this.scene.gl,"resources/shaders/chessboard.vert","resources/shaders/chessboard.frag");
  this.shader.setUniformsValues({uSampler2: 1});
  this.shader.setUniformsValues({c1: this.c1});
  this.shader.setUniformsValues({c2: this.c2});
  this.shader.setUniformsValues({cs: this.cs});
  this.shader.setUniformsValues({du: this.du});
  this.shader.setUniformsValues({dv: this.dv});
  this.shader.setUniformsValues({su: this.su});
  this.shader.setUniformsValues({sv: this.sv});

}

Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.display = function(){
  this.scene.listTextures[this.tex].apply();
  this.scene.setActiveShader(this.shader);
  this.board.display();
  this.scene.setActiveShader(this.scene.defaultShader);
}
