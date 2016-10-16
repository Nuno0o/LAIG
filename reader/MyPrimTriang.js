function MyPrimTriang(scene,x1,y1,z1,x2,y2,z2,x3,y3,z3) {
	CGFobject.call(this,scene);

	this.x1 = x1;
	this.x2 = x2;
	this.x3 = x3;
	this.y1 = y1;
	this.y2 = y2;
	this.y3 = y3;
	this.z1 = z1;
	this.z2 = z2;
	this.z3 = z3;

	this.initBuffers();
};

MyPrimTriang.prototype = Object.create(CGFobject.prototype);
MyPrimTriang.prototype.constructor=MyPrimTriang;

MyPrimTriang.prototype.initBuffers = function () {
	this.vertices = [
            this.x1, this.y1, this.z1,
             this.x2, this.y2, this.z2,
            this.x3,  this.y3, this.z3
			];

	this.indices = [
            0, 1, 2
        ];

    var temp_v1 = [this.x2-this.x1,this.y2-this.y1,this.z2-this.z1];
    var temp_v2 = [this.x3-this.x1,this.y3-this.y1,this.z3-this.z1];

	var temp_normal = [temp_v1[1]*temp_v2[2]-temp_v1[2]*temp_v2[1],
						temp_v1[2]*temp_v2[0]-temp_v1[0]*temp_v2[2],
						temp_v1[0]*temp_v2[1]-temp_v1[1]*temp_v2[0]]

    this.normals=[
    		temp_normal[0],temp_normal[1],temp_normal[2],
    		temp_normal[0],temp_normal[1],temp_normal[2],
    		temp_normal[0],temp_normal[1],temp_normal[2]
    ];
	
	var temp_a = Math.sqrt(Math.pow(this.x1-this.x3,2)+Math.pow(this.y1-this.y3,2)+Math.pow(this.z1-this.z3,2));
	var temp_b = Math.sqrt(Math.pow(this.x1-this.x2,2)+Math.pow(this.y1-this.y2,2)+Math.pow(this.z1-this.z2,2));	
	var temp_c = Math.sqrt(Math.pow(this.x2-this.x3,2)+Math.pow(this.y2-this.y3,2)+Math.pow(this.z2-this.z3,2));

	var temp_beta = Math.acos((temp_a*temp_a-temp_b*temp_b+temp_c*temp_c)/(2*temp_a*temp_c));
	
    this.texCoords = [
    	temp_c-temp_a*Math.cos(temp_beta),1-temp_a*Math.sin(temp_beta),
    	0,1,
    	temp_a*Math.cos(temp_beta),1
    ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};