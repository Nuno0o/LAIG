function MyPrimRect(scene,x1,y1,x2,y2) {
	CGFobject.call(this,scene);
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;

    this.smin = 0;
    this.smax = 1;
    this.tmin = 0;
    this.tmax = 1;
	this.initBuffers();
};

MyPrimRect.prototype = Object.create(CGFobject.prototype);
MyPrimRect.prototype.constructor=MyPrimRect;

MyPrimRect.prototype.setTex = function(length_s,length_t){
	this.texCoords = [
    	this.smin*1/length_s,this.tmax*1/length_t,
    	this.smax*1/length_s,this.tmax*1/length_t,
    	this.smin*1/length_s,this.tmin*1/length_t,
    	this.smax*1/length_s,this.tmin*1/length_t
    ];
	this.updateTexCoordsGLBuffers();
}
MyPrimRect.prototype.initBuffers = function () {
	this.vertices = [
            this.x1, this.y1, 0.0,
             this.x2, this.y1, 0.0,
            this.x1,  this.y2, 0.0,
             this.x2,  this.y2, 0.0,
			];

	this.indices = [
            0, 1, 2, 
			3, 2, 1
        ];

    this.normals=[
    		0,0,1,
    		0,0,1,
    		0,0,1,
    		0,0,1
    ];

    this.texCoords = [
    	this.smin,this.tmax,
    	this.smax,this.tmax,
    	this.smin,this.tmin,
    	this.smax,this.tmin
    ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};