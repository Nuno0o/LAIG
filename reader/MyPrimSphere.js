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
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/
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
		this.texCoords.push(1-j/this.slices,i/this.stacks);
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