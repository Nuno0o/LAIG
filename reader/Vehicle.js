function Vehicle(scene) {
  this.scene = scene;
  this.base = new MyPrimSphere(scene,1.5,20,20);
  this.wing1 = new Patch(scene,2,2,10,10,[[0,0,0.6],[0,0,0.1],[0,0,-0.4],[1,0,0.25],[1,0,-0.25],[1,0,-0.75],[2,0.3,-0.6],[2,0.3,-0.75],[2,0.3,-1]]);
  this.wing2 = new Patch(scene,2,2,10,10,[[2,0.3,-0.6],[2,0.3,-0.75],[2,0.3,-1],[1,0,0.25],[1,0,-0.25],[1,0,-0.75],[0,0,0.6],[0,0,0.1],[0,0,-0.4]]);
  this.stabilizer1 = new Patch(scene,1,1,5,5,[[0,0,0],[0,0.7,-0.3],[0,0,-0.5],[0,0.75,-0.7]]);
  this.stabilizer2 = new Patch(scene,1,1,5,5,[[0,0,-0.5],[0,0.75,-0.7],[0,0,0],[0,0.7,-0.3]]);
  this.turbine = new MyPrimCylinder(scene, 15, 1,1,1,1);
};

Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display = function(){
  //base do aviao
  this.scene.pushMatrix();
  this.scene.scale(0.2,0.2,1);
  this.base.display();
  this.scene.popMatrix();

  //asas
  this.scene.pushMatrix();
  this.wing1.display();
  this.wing2.display();
  this.scene.scale(-1,1,1);
  //this.scene.rotate(Math.PI,0,0,1);
  this.wing1.display();
  this.wing2.display();
  this.scene.popMatrix();

  //turbinas
  this.scene.pushMatrix();
  this.scene.translate(0.8,-0.1,-0.6);
  this.scene.scale(0.1,0.1,0.8);
  this.turbine.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(-0.8,-0.1,-0.6);
  this.scene.scale(0.1,0.1,0.8);
  this.turbine.display();
  this.scene.popMatrix();

  //stabilizers
  this.scene.pushMatrix();
  this.scene.translate(0,0,-0.8);
  this.stabilizer1.display();
  this.stabilizer2.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(0,0,-0.8);
  this.scene.rotate(Math.PI/2,0,0,1);
  this.stabilizer1.display();
  this.stabilizer2.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(0,0,-0.8);
  this.scene.rotate(-Math.PI/2,0,0,1);
  this.stabilizer1.display();
  this.stabilizer2.display();
  this.scene.popMatrix();
}
