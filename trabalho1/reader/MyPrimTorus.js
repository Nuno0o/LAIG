/**
 * MyPrimTorus
 * @constructor
 */
 function MyPrimTorus(scene,inner,outer,nsides,rings) {
 	CGFobject.call(this,scene);
	
	this.inner = inner;
	this.outer = outer;
	this.nsides = nsides;
	this.rings = rings;

	
 	this.initBuffers();
 };

 MyPrimTorus.prototype = Object.create(CGFobject.prototype);
 MyPrimTorus.prototype.constructor = MyPrimTorus;

 MyPrimTorus.prototype.initBuffers = function() {
 	
 	var degree2rad= Math.PI/180.0;
 	var incAngle=(360/this.rings)*degree2rad;
	var incAngle2=(360/this.nsides)*degree2rad;
	var radius = (this.outer-this.inner)/2;
	var angle=0;
	this.vertices=[];
	this.normals = [];
	this.texCoords = [];
	//Ponto à volta do qual cada seccao do torus é desenhada
	var rotatingpoint = [];

	for(var i=0; i<=this.rings;i+=1){
		var pointAngle = i*incAngle;
		rotatingpoint[0] = (radius+this.inner) * Math.cos(pointAngle);
		rotatingpoint[1] = (radius+this.inner) * Math.sin(pointAngle);
		rotatingpoint[2] = 0;
		
		for(j = 0 ; j <= this.nsides ; j++){
		angle = j*incAngle2;
		this.vertices.push(rotatingpoint[0]+radius*Math.cos(pointAngle)*Math.cos(angle));
		this.vertices.push(rotatingpoint[1]+radius*Math.sin(pointAngle)*Math.cos(angle));
		this.vertices.push(rotatingpoint[2]+radius*Math.sin(angle));
		this.normals.push(radius*Math.cos(pointAngle)*Math.cos(angle));
		this.normals.push(radius*Math.sin(pointAngle)*Math.cos(angle));
		this.normals.push(radius*Math.sin(angle));
		this.texCoords.push(i/this.rings, 1-j/this.nsides);
		}
	}

	this.indices = [];
	
	for(var j = 0; j < this.rings; j++){
		for(var i=0; i < this.nsides ; i++){
			this.indices.push(j*(this.nsides+1)+i);
			this.indices.push((j+1)*(this.nsides+1)+i);
			this.indices.push(j*(this.nsides+1)+i+1);
			this.indices.push(j*(this.nsides+1)+i+1);
			this.indices.push((j+1)*(this.nsides+1)+i);
			this.indices.push((j+1)*(this.nsides+1)+i+1);

		}
	}
	

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };