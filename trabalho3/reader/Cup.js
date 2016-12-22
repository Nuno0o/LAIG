function Cup(scene){
  this.scene = scene;

  this.base = new MyPrimCylinder(scene,30,30,0.1,0.7,0.7);
  this.torus = new MyPrimTorus(scene,1.05,1.25,20,20)
}
Cup.prototype.constructor = Cup;

Cup.prototype.display = function(){
    this.scene.pushMatrix();
    this.base.display();
    this.torus.display();
    this.scene.popMatrix();
}
