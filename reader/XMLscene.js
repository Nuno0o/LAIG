
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
	
	this.lightValues = [];
	
	for (var i = 0; i < this.lights.length; i++){
		this.lightValues[i] = false;
	}
	
	this.lightCheckBoxesUpdate();
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
	this.nlights = this.graph.listOmni.length+this.graph.listSpot.length;
	for (var i = 0; i < this.graph.listOmni.length; i++){
		this.lights[i].setPosition(	this.graph.listOmni[i].location_x,
									this.graph.listOmni[i].location_y,
									this.graph.listOmni[i].location_z,
									this.graph.listOmni[i].location_w);
		this.lights[i].setAmbient(	this.graph.listOmni[i].ambient_r,
									this.graph.listOmni[i].ambient_g,
									this.graph.listOmni[i].ambient_b,
									this.graph.listOmni[i].ambient_a);
		this.lights[i].setDiffuse(	this.graph.listOmni[i].diffuse_r,
									this.graph.listOmni[i].diffuse_g,
									this.graph.listOmni[i].diffuse_b,
									this.graph.listOmni[i].diffuse_a);
		this.lights[i].setSpecular(	this.graph.listOmni[i].specular_r,
									this.graph.listOmni[i].specular_g,
									this.graph.listOmni[i].specular_b,
									this.graph.listOmni[i].specular_a);
		
		if (this.graph.listOmni[i].enabled){
			this.lights[i].enable();
			this.lightValues[i] = true;
		}
		else this.lights[i].disable();

		this.lights[i].setVisible(true);
		this.lights[i].update();

	}
	for (var i = 0; i < this.graph.listSpot.length ; i++){
		var j = i + this.graph.listOmni.length;
		
		this.lights[j].setPosition(	this.graph.listSpot[i].location_x,
									this.graph.listSpot[i].location_y,
									this.graph.listSpot[i].location_z, 1);
		this.lights[j].setAmbient(	this.graph.listSpot[i].ambient_r,
									this.graph.listSpot[i].ambient_g,
									this.graph.listSpot[i].ambient_b,
									this.graph.listSpot[i].ambient_a);
		this.lights[j].setDiffuse(	this.graph.listSpot[i].diffuse_r,
									this.graph.listSpot[i].diffuse_g,
									this.graph.listSpot[i].diffuse_b,
									this.graph.listSpot[i].diffuse_a);
		this.lights[j].setSpecular(	this.graph.listSpot[i].specular_r,
									this.graph.listSpot[i].specular_g,
									this.graph.listSpot[i].specular_b,
									this.graph.listSpot[i].specular_a);
		this.lights[j].setSpotDirection(this.graph.listSpot[i].target_x-this.graph.listSpot[i].location_x,
										this.graph.listSpot[i].target_y-this.graph.listSpot[i].location_y,
										this.graph.listSpot[i].target_z-this.graph.listSpot[i].location_z);
		
		this.lights[j].setSpotExponent(this.graph.listSpot[i].exponent);

		this.lights[j].setSpotCutOff(Math.PI * this.graph.listSpot[i].angle / 180);
		
		if (this.graph.listSpot[i].enabled){ 
			this.lights[j].enable();
			this.lightValues[j] = true;
		}
		else this.lights[j].disable();
		
		this.lights[j].setVisible(true);
		this.lights[i].update();
	}
	this.lightCheckBoxesUpdate();
}

XMLscene.prototype.lightCheckBoxesUpdate = function(){
	this.light0 = this.lightValues[0];
	this.light1 = this.lightValues[1];
	this.light2 = this.lightValues[2];
	this.light3 = this.lightValues[3];
	this.light4 = this.lightValues[4];
	this.light5 = this.lightValues[5];
	this.light6 = this.lightValues[6];
	this.light7 = this.lightValues[7];
	this.light8 = this.lightValues[8];
	this.light9 = this.lightValues[9];
}

XMLscene.prototype.updateLights = function(){
	if (this.lights[0] != undefined) {
		if (this.light0) this.lights[0].enable();
		else this.lights[0].disable();
	}
	if (this.lights[1] != undefined) {
		if (this.light1) this.lights[1].enable();
		else this.lights[1].disable();
	}
	if (this.lights[2] != undefined) {
		if (this.light2) this.lights[2].enable();
		else this.lights[2].disable();
	}
	if (this.lights[3] != undefined) {
		if (this.light3) this.lights[3].enable();
		else this.lights[3].disable();
	}
	if (this.lights[4] != undefined) {
		if (this.light4) this.lights[4].enable();
		else this.lights[4].disable();
	}
	if (this.lights[5] != undefined) {
		if (this.light5) this.lights[5].enable();
		else this.lights[5].disable();
	}
	if (this.lights[6] != undefined) {
		if (this.light6) this.lights[6].enable();
		else this.lights[6].disable();
	}
	if (this.lights[7] != undefined) {
		if (this.light7) this.lights[7].enable();
		else this.lights[7].disable();
	}
	if (this.lights[8] != undefined) {
		if (this.light8) this.lights[8].enable();
		else this.lights[8].disable();
	}
	if (this.lights[9] != undefined) {
		if (this.light9) this.lights[9].enable();
		else this.lights[9].disable();
	}
}

// ----------------- MATERIALS ----------------------

XMLscene.prototype.initAppearances = function() {
	this.listAppearances = [];

	for (var i  = 0; i < this.graph.materials.length; i++){
		this.listAppearances[this.graph.materials[i].id] = new CGFappearance(this);
		this.listAppearances[this.graph.materials[i].id].setEmission(this.graph.materials[i].emission_r,
											this.graph.materials[i].emission_g,
											this.graph.materials[i].emission_b,
											this.graph.materials[i].emission_a);
		this.listAppearances[this.graph.materials[i].id].setAmbient(this.graph.materials[i].ambient_r,
											this.graph.materials[i].ambient_g,
											this.graph.materials[i].ambient_b,
											this.graph.materials[i].ambient_a);
		this.listAppearances[this.graph.materials[i].id].setDiffuse(this.graph.materials[i].diffuse_r,
											this.graph.materials[i].diffuse_g,
											this.graph.materials[i].diffuse_b,
											this.graph.materials[i].diffuse_a);
		this.listAppearances[this.graph.materials[i].id].setSpecular(this.graph.materials[i].specular_r,
											this.graph.materials[i].specular_g,
											this.graph.materials[i].specular_b,
											this.graph.materials[i].specular_a);
		this.listAppearances[this.graph.materials[i].id].setShininess(this.graph.materials[i].shininess);
	}
}
// ---------------- TRANSFORMATIONS ------------------
XMLscene.prototype.getTransformations = function(){
	this.listTransformations = [];

	for (i in this.graph.transformations){
		this.matrix = mat4.create();
		for (var j in this.graph.transformations[i].changes){
			if (this.graph.transformations[i].changes[j].type == 'translate'){
				mat4.translate(this.matrix,this.matrix,[this.graph.transformations[i].changes[j].xtrans,
														this.graph.transformations[i].changes[j].ytrans,
														this.graph.transformations[i].changes[j].ztrans]);
			}
			else if (this.graph.transformations[i].changes[j].type == "scale"){
				mat4.scale(this.matrix,this.matrix,[	this.graph.transformations[i].changes[j].scalex,
														this.graph.transformations[i].changes[j].scaley,
														this.graph.transformations[i].changes[j].scalez]);
			}
			else{
				if (this.graph.transformations[i].changes[j].axis == 'x'){
					mat4.rotate(this.matrix,this.matrix,Math.PI * this.graph.transformations[i].changes[j].angle / 180, [1,0,0]);
				}
				else if(this.graph.transformations[i].changes[j].axis == 'y'){
					mat4.rotate(this.matrix,this.matrix,Math.PI * this.graph.transformations[i].changes[j].angle / 180, [0,1,0]);
				}
				else{
					mat4.rotate(this.matrix,this.matrix,Math.PI * this.graph.transformations[i].changes[j].angle / 180, [0,0,1]);
				}
			}
		}
		this.listTransformations[this.graph.transformations[i].id] = this.matrix;
	}
}

// ------------------ TEXTURES -----------------------

XMLscene.prototype.initTextures = function() {
	this.listTextures = [];

	for(var i = 0;i < this.graph.textures.length;i++){
		this.listTextures[this.graph.textures[i].id] = new CGFappearance(this);
		this.listTextures[this.graph.textures[i].id].file = this.graph.textures[i].file;
		this.listTextures[this.graph.textures[i].id].length_s = this.graph.textures[i].length_s;
		this.listTextures[this.graph.textures[i].id].length_t = this.graph.textures[i].length_t;
		this.listTextures[this.graph.textures[i].id].loadTexture(this.listTextures[this.graph.textures[i].id].file);
	}
}

XMLscene.prototype.mergeMaterialToTex = function(texID,matID){
		this.listTextures[texID].setDiffuse(this.listAppearances[matID].diffuse[0],
											this.listAppearances[matID].diffuse[1],
											this.listAppearances[matID].diffuse[2],
											this.listAppearances[matID].diffuse[3]);
		this.listTextures[texID].setAmbient(this.listAppearances[matID].ambient[0],
											this.listAppearances[matID].ambient[1],
											this.listAppearances[matID].ambient[2],
											this.listAppearances[matID].ambient[3]);
		this.listTextures[texID].setEmission(this.listAppearances[matID].emission[0],
											this.listAppearances[matID].emission[1],
											this.listAppearances[matID].emission[2],
											this.listAppearances[matID].emission[3]);
		this.listTextures[texID].setSpecular(this.listAppearances[matID].specular[0],
											this.listAppearances[matID].specular[1],
											this.listAppearances[matID].specular[2],
											this.listAppearances[matID].specular[3]);
		this.listTextures[texID].setShininess(this.listAppearances[matID].shininess);
}

// ----------------- ANIMATIONS ----------------------
XMLscene.prototype.initAnimations = function(){
	this.listAnimations = [];
	for (var i = 0; i < this.graph.animations.length; i++){
		var anim = this.graph.animations[i];
		if (anim.type == "linear"){
			this.listAnimations[anim.id] = new LinearAnimation(this.graph.animations[i]);
		}
		if (anim.type == "circular"){
			this.listAnimations[anim.id] = new CircularAnimation(this.graph.animations[i]);
		}
	}
	
}

// ----------------- PRIMITIVES ----------------------

XMLscene.prototype.initPrimitives = function(){
	this.listPrimitives = [];
	for(var i = 0;i < this.graph.primitives.length;i++){
		var pri = this.graph.primitives[i];
		if(pri.name == 'rectangle'){
			this.listPrimitives[pri.id] = new MyPrimRect(this,pri.x1,pri.y1,pri.x2,pri.y2);
		}
		if(pri.name == 'triangle'){
			this.listPrimitives[pri.id] = new MyPrimTriang(this,pri.x1,pri.y1,pri.z1,pri.x2,pri.y2,pri.z2,pri.x3,pri.y3,pri.z3);
		}
		if(pri.name == 'cylinder'){
			this.listPrimitives[pri.id] = new MyPrimCylinder(this, pri.slices, pri.stacks,pri.height,pri.base,pri.top);
		}
		if(pri.name == 'sphere'){
			this.listPrimitives[pri.id] = new MyPrimSphere(this, pri.radius, pri.slices, pri.stacks);
		}
		if(pri.name == 'torus'){
			this.listPrimitives[pri.id] = new MyPrimTorus(this, pri.inner, pri.outer,pri.slices,pri.loops);
		}
	}
}

// ----------------- COMPONENTS ----------------------

function ToDisplay(primitive, currMatrix, mats, tex, anims){
	this.primitive = primitive;
	this.currMatrix = currMatrix;
	this.mats = mats;
	this.tex = tex;
	this.activeMat = 0;
	
	this.currentAnimation = 0;
	this.animations = anims;
}

ToDisplay.prototype.incrementActiveMat = function(){
	var length = this.mats.length;
	this.activeMat++;
	if (this.activeMat >= length) this.activeMat = 0;
}

ToDisplay.prototype.incrementCurrentAnimation = function(){
	this.currentAnimation++;
	if (this.currentAnimation >= this.animations.length) this.currentAnimation = 0;
}

XMLscene.prototype.getAnimsFromID = function(animIdVec){
	var animations = [];
	for (var i in animIdVec){
		animations.push(this.listAnimations[animIdVec[0]]);
	}
	return animations;
}

XMLscene.prototype.displayPrim = function(toDisplayPrim){
	this.pushMatrix();
		if (toDisplayPrim.tex != null) {
			if(this.listPrimitives[toDisplayPrim.primitive].constructor.name == 'MyPrimRect' || this.listPrimitives[toDisplayPrim.primitive].constructor.name == 'MyPrimTriang'){
				this.listPrimitives[toDisplayPrim.primitive].setTex(this.listTextures[toDisplayPrim.tex].length_s,this.listTextures[toDisplayPrim.tex].length_t);
			}
			this.mergeMaterialToTex(toDisplayPrim.tex, toDisplayPrim.mats[toDisplayPrim.activeMat]);
			this.listTextures[toDisplayPrim.tex].apply();
		}
		else {
			this.listAppearances[toDisplayPrim.mats[toDisplayPrim.activeMat]].apply();
		}
		this.multMatrix(toDisplayPrim.currMatrix);
		this.listPrimitives[toDisplayPrim.primitive].display();
	this.popMatrix();
}

XMLscene.prototype.calcMatrix = function(oldMatrix, transf){
	var newMatrix = mat4.create();
	mat4.multiply(newMatrix, oldMatrix, transf);
	return newMatrix;
}

XMLscene.prototype.push_back = function(mats, mat){
	var newMats = [];
	newMats[0] = mat;
	for (var i = 0; i < mats.length; i++){
		var j = 1 + i;
		newMats[j] = mats[i];
	}
	return newMats;
}

XMLscene.prototype.appendMats = function(graphNode, oldMats){
	var newMats = oldMats;
	for (var i in graphNode.materials){
		if (graphNode.materials[i] == "inherit") continue;
		var exists = false;
		for (var j in oldMats){
			if (oldMats[j] == graphNode.materials[i]) exists = true;
		}
		if (!exists) newMats = this.push_back(newMats, graphNode.materials[i]);
	}
	return newMats;
}

XMLscene.prototype.matsHasInherit = function(mats){
	for (var i in mats){
		if (mats[i] == "inherit") return true;
	}
	return false;
}

XMLscene.prototype.texHasInherit = function(texID){
	if (texID == "inherit") return true;
	return false;
}

XMLscene.prototype.texHasNone = function(texID){
	if (texID == "none") return true;
	return false;
}

XMLscene.prototype.getMats = function(graphNode, mats){
	if (this.matsHasInherit(graphNode.materials)){
		return this.appendMats(graphNode, mats);
	}
	else {
		return this.appendMats(graphNode, []);}
}

XMLscene.prototype.getAnims = function(graphNode, anims){
	for (var i in graphNode.animationrefs){
		anims = this.push_back(anims, graphNode.animationrefs[i]);
	}
	return anims;
}

XMLscene.prototype.getComponentTex = function(graphNode, currTexID){
	if (this.texHasNone(graphNode.texture)) return null;
	else if (this.texHasInherit(graphNode.texture)) return currTexID;
	else return graphNode.texture;
}

XMLscene.prototype.calcAndDisplayGraph = function(graphNode, currMatrix, mats, tex, anims){
	var newMatrix;
	newMatrix = this.calcMatrix(currMatrix, this.listTransformations[graphNode.transformationref]);
	anims = this.getAnims(graphNode, anims);
	for (var i in graphNode.primitiverefs){
		mats = this.getMats(graphNode, mats);
		tex = this.getComponentTex(graphNode, tex);
		var animations = this.getAnimsFromID(anims);
		this.listReadyToDisplay.push(new ToDisplay(graphNode.primitiverefs[i], newMatrix, mats, tex, animations));
	}

	for (var i in graphNode.componentrefs){
		mats = this.getMats(graphNode, mats);
		tex = this.getComponentTex(graphNode, tex);
		this.calcAndDisplayGraph(this.graph.components[graphNode.componentrefs[i]], newMatrix, mats, tex, anims);
	}
}

XMLscene.prototype.initComponents = function(){
	this.root = this.graph.components[this.graph.root];
	this.initialMatrix = this.listTransformations[this.root.transformationref];
	this.defMats = this.root.materials;
	this.defTex = this.root.texture;
	this.calcAndDisplayGraph(this.root, this.initialMatrix, this.defMats, this.defTex, []);
}


// -----------------------------------------------------------------------------------------------------
// -------------------------------- HANDLER CALLING AND SCENE DISPLAY ----------------------------------
// -----------------------------------------------------------------------------------------------------

XMLscene.prototype.cycleMaterials = function(){
	for (var i in this.listReadyToDisplay){
		this.listReadyToDisplay[i].incrementActiveMat();
	}
}

XMLscene.prototype.onGraphLoaded = function () 
{
	this.setUpdatePeriod(1000);
	this.frameDiff = 0;
	this.currTime = -1;
	this.activeMat = 0;
	this.currentCamera = 0;
	
	this.enableTextures(true);
	
	this.listReadyToDisplay = [];
	this.activeAnimations = [];
	
	this.initGraphGlobalLighting();
	this.initGraphAxis();
	this.initGraphCameras();
	this.initAppearances();
	this.initTextures();
	this.initGraphLights();
	this.sceneInterface.addLights();
	this.getTransformations();
	this.initAnimations();
	this.initPrimitives();
	this.initComponents();
};

XMLscene.prototype.getFrameDiff = function(currTime){
	if (this.currTime == -1) this.currTime = currTime;
	else{
		this.frameDiff = Math.abs(this.currTime - currTime);
		this.currTime = currTime;
	}
}

XMLscene.prototype.runAnimations = function(frameDiff){
	for (var i in this.listReadyToDisplay){	
		if (this.listReadyToDisplay[i].animations.length == 0) continue;
		this.listReadyToDisplay[i].animations[this.listReadyToDisplay[i].currentAnimation].update(frameDiff);
		
		if (this.listReadyToDisplay[i].animations[this.listReadyToDisplay[i].currentAnimation].isDone()){
			this.listReadyToDisplay[i].incrementCurrentAnimation();
		}
	}
}

XMLscene.prototype.update = function(currTime){
	this.getFrameDiff(currTime);
	this.runAnimations(this.frameDiff);
}

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
		this.updateLights();
		for (var i = 0; i < this.lights.length; i++){
			this.lights[i].update();
		}
		
		for (var i in this.listReadyToDisplay){
			this.displayPrim(this.listReadyToDisplay[i]);
		}
	};	
};