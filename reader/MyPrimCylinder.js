/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, slices, stacks,height,base,top) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
	this.height = height;
	this.base = base;
	this.top = top;

	
 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.setTextureMapping1 = function(){
 	this.texCoords = [];
 	var degree2rad= Math.PI/180.0;
 	var angle = 0;
 	var incAngle = (360/this.slices)*degree2rad;
 	for(var i=0; i<=this.stacks;i+=1){
		for(angle = 0 ; angle < 2*Math.PI ; angle+=incAngle){
            this.texCoords.push(angle/(2*Math.PI),i/(this.stacks));
		}
	}
 }
 MyCylinder.prototype.initBuffers = function() {
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

	for(var i=0; i<=this.stacks;i+=1){
		for(angle = 0 ; angle < 2*Math.PI ; angle+=incAngle){

		this.vertices.push(Math.cos(angle)*((1-i/this.stacks)*this.base + (i/this.stacks)*this.top)); //angulo pertencente a face anterior e a sua normal
		this.vertices.push(Math.sin(angle)*((1-i/this.stacks)*this.base + (i/this.stacks)*this.top));
		this.vertices.push(i/this.stacks*this.height);
		this.normals.push(Math.cos(angle));
		this.normals.push(Math.sin(angle));
		this.normals.push(0);
		}
	}

	this.indices = [];
	
	for(var j = 0; j < this.stacks; j++){
		for(var i=0; i < this.slices ; i++){
			this.indices.push(j*this.slices+i);
			if(i == this.slices-1){
				this.indices.push(j*this.slices);
			}else this.indices.push(j*this.slices+i+1);
			this.indices.push((j+1)*this.slices+i);

			if(i == this.slices-1){
				this.indices.push(j*this.slices);
			}else this.indices.push(j*this.slices+i+1);

			if(i == this.slices-1){
				this.indices.push((j+1)*this.slices);
			}else this.indices.push((j+1)*this.slices+i+1);
			this.indices.push((j+1)*this.slices+i);
		}
	}
	
 	

 	

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };


 /**
 * MyCylinderBase
 * @constructor
 */
 function MyCylinderBase(scene, slices,height,base,top) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.height = height;
	this.base = base;
	this.top = top;

	
 	this.initBuffers();
 };

 MyCylinderBase.prototype = Object.create(CGFobject.prototype);
 MyCylinderBase.prototype.constructor = MyCylinderBase;

 MyCylinderBase.prototype.initBuffers = function() {
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
	this.vertices=[];
	this.normals = [];
	this.texCoords = [];

	for(angle = 0 ; angle < 2*Math.PI ; angle+=incAngle){

		this.vertices.push(Math.cos(angle)*this.base); //angulo pertencente a face anterior e a sua normal
		this.vertices.push(Math.sin(angle)*this.base);
		this.vertices.push(0);
		this.normals.push(0);
		this.normals.push(0);
		this.normals.push(-1);
        this.texCoords.push(0.5+0.5*Math.cos(angle),1-(0.5+0.5*Math.sin(angle)));
	}
	for(angle = 0 ; angle < 2*Math.PI ; angle+=incAngle){

		this.vertices.push(Math.cos(angle)*this.top); //angulo pertencente a face anterior e a sua normal
		this.vertices.push(Math.sin(angle)*this.top);
		this.vertices.push(this.height);
		this.normals.push(0);
		this.normals.push(0);
		this.normals.push(1);
        this.texCoords.push(0.5+0.5*Math.cos(angle),1-(0.5+0.5*Math.sin(angle)));
	}
	this.vertices.push(0,0,0);
	this.normals.push(0,0,-1);
	this.texCoords.push(0.5,0.5);
	this.vertices.push(0,0,this.height);
	this.normals.push(0,0,1);
    this.texCoords.push(0.5,0.5);
	
	this.indices = [];
	
	for(var i=0; i < this.slices ; i++){
		if(i != this.slices-1)
		   this.indices.push(i,i+1,this.slices*2);
		else this.indices.push(i,0,this.slices*2);
	}

	for(var i=this.slices; i < this.slices *2; i++){
		if(i != this.slices*2-1)
		   this.indices.push(i,i+1,this.slices*2);
		else this.indices.push(i,0,this.slices*2);
	}
	
	
 	

 	

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };