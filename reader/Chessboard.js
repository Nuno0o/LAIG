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
  this.shader = new CGFshader(this.scene.gl,"resources/shaders/chessboard.vert","resources/shaders/chessboard.frag");
  this.board = new Plane(scene,1,1,du,dv);
}

Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.display = function(){
  this.scene.setActiveShader(this.shader);
  this.board.display();
  this.scene.setActiveShader(this.scene.defaultShader);
}