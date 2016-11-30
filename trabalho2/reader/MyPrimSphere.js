
function MySphere(scene, radius, slices, stacks){
	this.sphere = new MyPrimSphere(scene, radius, slices, stacks);
}

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.display = function(){
 	this.sphere.scene.pushMatrix();
 		this.sphere.scene.rotate(-Math.PI, 0, 1, 1);
 		this.sphere.display();
 	this.sphere.scene.popMatrix();
 }


/**
 * MyPrimSphere
 * @constructor
 */
 function MyPrimSphere(scene,radius ,slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
	this.radius = radius;

	
 	this.initBuffers();
 };

 MyPrimSphere.prototype = Object.create(CGFobject.prototype);
 MyPrimSphere.prototype.constructor = MyPrimSphere;

 MyPrimSphere.prototype.initBuffers = function() {
 	
 	var degree2rad= Math.PI/180.0;
 	var incAngle=(360/this.slices)*degree2rad;
	var angle=0;
	var varAltura=1/this.stacks;
	this.vertices=[];
	this.normals = [];
	this.texCoords = [];

	for(var i=0; i<=this.stacks;i+=1){
		for(j = 0 ; j <= this.slices ; j++){
		angle = j*incAngle;
		this.vertices.push(this.radius*Math.cos(angle)*Math.sin((i)/(this.stacks)*Math.PI));
		this.vertices.push(this.radius*Math.sin(angle)*Math.sin((i)/(this.stacks)*Math.PI));
		this.vertices.push(this.radius*Math.sin( i/(this.stacks)*Math.PI-0.5*Math.PI));
		this.normals.push(Math.cos(angle)*Math.sin((i)/(this.stacks)*Math.PI));
		this.normals.push(Math.sin(angle)*Math.sin((i)/(this.stacks)*Math.PI));
		this.normals.push(Math.sin( i/(this.stacks)*Math.PI-0.5*Math.PI));
		this.texCoords.push(j/this.slices,1-i/this.stacks);
		}
	}

	this.indices = [];
	
	for(var j = 0; j < this.stacks; j++){
		for(var i=0; i < this.slices ; i++){
			this.indices.push(j*(this.slices+1)+i);
			this.indices.push(j*(this.slices+1)+i+1);
			this.indices.push((j+1)*(this.slices+1)+i);
			this.indices.push(j*(this.slices+1)+i+1);
			this.indices.push((j+1)*(this.slices+1)+i+1);
			this.indices.push((j+1)*(this.slices+1)+i);
		}
	}
	

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };