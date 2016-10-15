
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

// -----------------------------------------------------------------------------------------------------
// ------------------------------------------- DEFAULT SCENE -------------------------------------------
// -----------------------------------------------------------------------------------------------------

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// -----------------------------------------------------------------------------------------------------
// -------------------------------------- SCENE GRAPH HANDLING -----------------------------------------
// -----------------------------------------------------------------------------------------------------

// ------------------------ AXIS -----------------------------

XMLscene.prototype.initGraphAxis = function() {
	this.axis = new CGFaxis(this, this.graph.axis_length);	
}

// ----------------------- LIGHTING --------------------------

XMLscene.prototype.initGraphGlobalLighting = function(){

	this.gl.clearColor(	this.graph.background[0],
						this.graph.background[1],
						this.graph.background[2],
						this.graph.background[3]);

	this.setGlobalAmbientLight(	this.graph.ambient[0],
								this.graph.ambient[1],
								this.graph.ambient[2],
								this.graph.ambient[3]);
}

// ----------------------- CAMERA ----------------------------

XMLscene.prototype.initGraphCameras = function() {
	this.listCameras = [];
	for (var i = 0; i < this.graph.listviews.length ; i++){
		var near, far, angle, from_x, from_y, from_z, to_x, to_y, to_z;

		fov = Math.PI * this.graph.listviews[i].angle / 180;

		near = this.graph.listviews[i].near;
		far = this.graph.listviews[i].far;

		from_x = this.graph.listviews[i].from_x;
		from_y = this.graph.listviews[i].from_y;
		from_z = this.graph.listviews[i].from_z;

		to_x = this.graph.listviews[i].to_x;
		to_y = this.graph.listviews[i].to_y;
		to_z = this.graph.listviews[i].to_z;

		this.listCameras[i] = new CGFcamera(fov, near, far, [from_x, from_y, from_z], [to_x, to_y, to_z]);
	}
}

XMLscene.prototype.cycleCamera = function() {
	var nCameras = this.listCameras.length;
	this.currentCamera++;
	if (this.currentCamera >= nCameras) this.currentCamera = 0;
	this.camera = this.listCameras[this.currentCamera];
}

// ------------------ LIGHTS ------------------------
XMLscene.prototype.initGraphLights = function(){
	this.listLights = [];
	
}

// ----------------- MATERIALS ----------------------

XMLscene.prototype.initAppearances = function() {
	this.listAppearances = [];

	for (var i  = 0; i < this.graph.materials.length; i++){
		this.listAppearances[i] = new CGFappearance(this);
		this.listAppearances[i].setEmission(this.graph.materials[i].emission_r,
											this.graph.materials[i].emission_g,
											this.graph.materials[i].emission_b,
											this.graph.materials[i].emission_a);
		this.listAppearances[i].setAmbient(this.graph.materials[i].ambient_r,
											this.graph.materials[i].ambient_g,
											this.graph.materials[i].ambient_b,
											this.graph.materials[i].ambient_a);
		this.listAppearances[i].setDiffuse(this.graph.materials[i].diffuse_r,
											this.graph.materials[i].diffuse_g,
											this.graph.materials[i].diffuse_b,
											this.graph.materials[i].diffuse_a);
		this.listAppearances[i].setSpecular(this.graph.materials[i].specular_r,
											this.graph.materials[i].specular_g,
											this.graph.materials[i].specular_b,
											this.graph.materials[i].specular_a);
		this.listAppearances[i].setShininess(this.graph.materials[i].shininess);
	}
}

// -----------------------------------------------------------------------------------------------------
// -------------------------------- HANDLER CALLING AND SCENE DISPLAY ----------------------------------
// -----------------------------------------------------------------------------------------------------

XMLscene.prototype.onGraphLoaded = function () 
{
	this.currentCamera = 0;
	this.initGraphGlobalLighting();
	this.initGraphAxis();
	this.initGraphCameras();
	this.initAppearances();
	this.lights[0].setVisible(true);
    this.lights[0].enable();
};

XMLscene.prototype.display = function () {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.lights[0].update();
	};	

};