
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

	this.setPickEnabled(true);
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

// ----------------- CAMERA ANIMATIONS --------------------

XMLscene.prototype.initCameraAnimations = function(){

	this.cameraAnimations = [];

	for (var i = 0; i < this.graph.listCameraAnimations.length; i++){
		this.cameraAnimations[i] = new CameraAnimation(this.graph.listCameraAnimations[i]);
	}

}

XMLscene.prototype.nextGameCamera = function(){
	var nGameCameras = this.cameraAnimations.length;
	if (this.currentGameCamera < 0) {
		this.currentGameCamera = 0;
		return;
	}
	this.cameraAnimations[this.currentGameCamera].reset();
	this.currentGameCamera++;
	if (this.currentGameCamera >= nGameCameras) this.currentGameCamera = 0;
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
			this.listPrimitives[pri.id] = new MySphere(this, pri.radius, pri.slices, pri.stacks);
		}
		if(pri.name == 'torus'){
			this.listPrimitives[pri.id] = new MyPrimTorus(this, pri.inner, pri.outer,pri.slices,pri.loops);
		}
		if(pri.name == 'plane'){
			this.listPrimitives[pri.id] = new Plane(this, pri.dimX, pri.dimY,pri.partsX,pri.partsY);
		}
		if(pri.name == 'patch'){
			this.listPrimitives[pri.id] = new Patch(this, pri.orderU, pri.orderV,pri.partsU,pri.partsV,pri.controlPoints);
		}
		if(pri.name == 'vehicle'){
			this.listPrimitives[pri.id] = new Vehicle(this);
		}
   		if(pri.name == 'chessboard'){
     		this.listPrimitives[pri.id] = new Chessboard(this,pri.du,pri.dv,pri.textureref,pri.su,pri.sv,pri.c1,pri.c2,pri.cs);
    	}
		if(pri.name == 'skybox'){
     		this.listPrimitives[pri.id] = new MyPrimSkybox(this,pri.size);
    	}
		if(pri.name == 'piece'){
			this.listPrimitives[pri.id] = new MyPrimPiece(this,pri.size);
		}
    }
}

// ----------------- COMPONENTS ----------------------

function ToDisplay(primitive, transformations, mats, tex, anims){
	this.primitive = primitive;

	this.transformations = transformations;
	this.mats = mats;
	this.tex = tex;
	this.activeMat = 0;

	this.animations = anims;

	this.currentAnimations = [];
	for (var i = 0; i < this.animations.length; i++){
		this.currentAnimations[i] = 0;
	}

}

ToDisplay.prototype.incrementActiveMat = function(){
	var length = this.mats.length;
	this.activeMat++;
	if (this.activeMat >= length) this.activeMat = 0;
}

ToDisplay.prototype.incrementCurrentAnimation = function(layer){
	this.currentAnimations[layer]++;
}	

XMLscene.prototype.computeTransformationList = function(transformations){

	for (var i in transformations){
		this.computeLayerOfTransformations(transformations[i]);
	}
}

XMLscene.prototype.computeLayerOfTransformations = function(transformationLayer){
	for (var i in transformationLayer){
		this.applyTransformation(transformationLayer[i]);
	}
}

XMLscene.prototype.getAnimsFromID = function(animIdVec){
	var animations = [];
	for (var i in animIdVec){
		var currId = animIdVec[i];
		var currParsed = this.graph.animations[currId];
		if (currParsed.type == "linear"){
			animations.push(new LinearAnimation(currParsed));
		}
		if (currParsed.type == "circular"){
			animations.push(new CircularAnimation(currParsed));
		}
	}
	return animations;
}

XMLscene.prototype.displayPrimToAnimation = function(toDisplayPrim){
	// Animations for a given primitive: [[layer0_anim0, layer0_anim1, ...], [layer1_anim0, layer1_anim1, ...], ...], current = [0,0,0,...]

	this.pushMatrix();
		this.computeTransformationList(toDisplayPrim.transformations);
		this.displayPrim(toDisplayPrim);
	this.popMatrix();
}

XMLscene.prototype.displayPrim = function(toDisplayPrim){

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

		this.listPrimitives[toDisplayPrim.primitive].display();
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

XMLscene.prototype.getComponentTex = function(graphNode, currTexID){
	if (this.texHasNone(graphNode.texture)) return null;
	else if (this.texHasInherit(graphNode.texture)) return currTexID;
	else return graphNode.texture;
}

XMLscene.prototype.cloneAnim = function(animID){
	var currParsed = this.graph.animations[animID];
	if (currParsed.type == "linear"){
		return new LinearAnimation(currParsed);
	}
	if (currParsed.type == "circular"){
		return new CircularAnimation(currParsed);
	}
	return null;
}

XMLscene.prototype.getAnims_ = function(graphNode, anims){

	var newAnims = [];
	for (var i in anims) newAnims[i] = anims[i];
	var currAnims = [];
	for (var i in graphNode.animationrefs){
		currAnims.push(this.cloneAnim(graphNode.animationrefs[i]));
	}
	//if(currAnims.length > 0) 
	newAnims.push(currAnims);
	return newAnims;
}

XMLscene.prototype.cloneTransformation = function(change){
	if (change.type == 'translate'){
		return ['translate', change.xtrans, change.ytrans, change.ztrans];
	}
	if (change.type == 'rotate'){
		return ['rotate', change.axis, change.angle];
	}
	if (change.type == 'scale'){
		return ['scale', change.scalex, change.scaley, change.scalez];
	}
	return [];
}

XMLscene.prototype.applyTransformation = function(clonedTransformation){
	if (clonedTransformation.length == 0) return;
	if (clonedTransformation[0] == "translate"){
		this.translate(clonedTransformation[1],clonedTransformation[2],clonedTransformation[3]);
	}
	if (clonedTransformation[0] == 'rotate') {
		if (clonedTransformation[1] == 'x'){
			this.rotate(Math.PI * clonedTransformation[2] / 180, 1, 0, 0);
		}
		if (clonedTransformation[1] == 'y'){
			this.rotate(Math.PI * clonedTransformation[2] / 180, 0, 1, 0);
		}
		if (clonedTransformation[1] == 'z'){
			this.rotate(Math.PI * clonedTransformation[2] / 180, 0, 0, 1);
		}
	}
	if (clonedTransformation[0] == 'scale') {
		this.scale(clonedTransformation[1],clonedTransformation[2],clonedTransformation[3]);
	}
}

XMLscene.prototype.getTransformationsFromID = function(transID){
	var retorno = [];
	for (var i in this.graph.transformations){
		if (this.graph.transformations[i].id == transID){
			for (var j in this.graph.transformations[i].changes){
				retorno.push(this.cloneTransformation(this.graph.transformations[i].changes[j]));
			}
		}
	}
	return retorno;
}

XMLscene.prototype.getTransformations_ = function(graphNode, transformations){
	var newTrans = [];
	for (var i in transformations) { newTrans[i] = transformations[i]; }
	var actual = this.getTransformationsFromID(graphNode.transformationref);
	newTrans.push(actual);
	return newTrans;
}

XMLscene.prototype.injectAnimationTransformations = function(transformations, howManyNew){
	var newLast = [];

	for (var i = 0; i < transformations[transformations.length - 1].length; i++){
		newLast.push(transformations[transformations.length - 1][i]);
	}

	for (var j = 0; j < howManyNew; j++){
		newLast.push(['translate', 0, 0, 0]);
	}

	newLast.push(['rotate', 'y', 0]);
	transformations[transformations.length - 1] = newLast;
}

XMLscene.prototype.calcAndDisplayGraph = function(graphNode, transformations, mats, tex, anims){

	transformations = this.getTransformations_(graphNode, transformations);
	var newAnims = this.getAnims_(this.graph.components[graphNode.id], anims);
	this.injectAnimationTransformations(transformations, newAnims[newAnims.length - 1].length);

	if (graphNode.gameboard.length != 0){
		this.hasGameboard = true;

		this.gameboard_tilesize = graphNode.gameboard_tilesize;
		this.gameboard_c1 = graphNode.gameboard_c1;
		this.gameboard_c2 = graphNode.gameboard_c2;
		this.gameboard_tex = graphNode.gameboard_tex;
		this.gameboard_pc1 = graphNode.gameboard_pc1;
		this.gameboard_pc2 = graphNode.gameboard_pc2;
		this.gameboard_ptex = graphNode.gameboard_ptex;
}

	for (var i in graphNode.primitiverefs){
		mats = this.getMats(graphNode, mats);
		tex = this.getComponentTex(graphNode, tex);
		this.listReadyToDisplay.push(new ToDisplay(graphNode.primitiverefs[i], transformations, mats, tex, newAnims));
	}

	for (var i in graphNode.componentrefs){
		mats = this.getMats(graphNode, mats);
		tex = this.getComponentTex(graphNode, tex);

		this.calcAndDisplayGraph(this.graph.components[graphNode.componentrefs[i]], transformations, mats, tex, newAnims);
	}
}


XMLscene.prototype.initComponents = function(){
	this.root = this.graph.components[this.graph.root];
	this.initialMatrix = this.listTransformations[this.root.transformationref];
	this.defMats = this.root.materials;
	this.defTex = this.root.texture;
	this.calcAndDisplayGraph(this.root, [], this.defMats, this.defTex, []);
}

XMLscene.prototype.resetGame = function(){
	this.game.resetGame();
}

XMLscene.prototype.undo = function(){
	this.game.undo();
}

XMLscene.prototype.runGameFilm = function(){
	this.game.runGameFilm();
}

XMLscene.prototype.nextFrame = function(){
	this.game.nextFrame();
}

XMLscene.prototype.applyConfig = function(){

	var botDifficulty = parseInt(this.botDifficulty);
	var player1 = parseInt(this.player1);
	var player2 = parseInt(this.player2);

	this.game.resetGame();

	if (player1) {
		this.game.gameboard.board.setPlayerType(1, player1 + botDifficulty);
	}
	else this.game.gameboard.board.setPlayerType(1, player1);

	if (player2) {
		this.game.gameboard.board.setPlayerType(2, player2 + botDifficulty);
	}
	else this.game.gameboard.board.setPlayerType(2, player2);

	this.inBotPlay = false;

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
	this.setUpdatePeriod(10);
	this.frameDiff = 0;
	this.currTime = -1;
	this.activeMat = 0;
	this.currentCamera = 0;

	this.currentGameCamera = -1;
	this.hasGameboard = false;
	this.game = null;
	
	
	this.enableTextures(true);
	
	this.listReadyToDisplay = [];
	this.activeAnimations = [];
	
	this.initGraphGlobalLighting();
	this.initGraphAxis();
	this.initGraphCameras();
	this.initCameraAnimations();
	this.initAppearances();
	this.initTextures();
	this.initGraphLights();
	this.sceneInterface.addLights();
	this.getTransformations();
	this.initPrimitives();
	this.initComponents();

	this.cameraAnimationsGo = false;
	this.canChangeCamera = true;

	if (this.hasGameboard){
		this.player1 = 0;
		this.player2 = 0;
		this.botDifficulty = 1;
		this.sceneInterface.addGameVars();
		this.sceneInterface.addGameControls();
		this.game = new Game(this,
							new GameBoard(this, 12, 12, this.gameboard_tilesize));
	}

	// setup default camera
	if(this.cameraAnimations.length > 0){
		this.camera.setPosition(this.cameraAnimations[0].from);
		this.camera.setTarget(this.cameraAnimations[0].target);
	}

};

XMLscene.prototype.getFrameDiff = function(currTime){
	if (this.currTime == -1) this.currTime = currTime;
	else{
		this.frameDiff = currTime - this.currTime;
		this.currTime = currTime;
	}
}

XMLscene.prototype.runAnimations = function(frameDiff){
	
	for (var i in this.listReadyToDisplay){	

		// Primitive has no animations
		if (this.listReadyToDisplay[i].animations.length == 0) continue;
		// Run through current animations
		for (var layer = 0; layer < this.listReadyToDisplay[i].animations.length; layer++){

			// Check if this layer has any animations first.
			if (this.listReadyToDisplay[i].animations[layer].length == 0) continue;

			// Check if this layer doesn't have an animation to do
			if (this.listReadyToDisplay[i].currentAnimations[layer] >= this.listReadyToDisplay[i].animations[layer].length) continue;

			// Animations for a given primitive: [[layer0_anim0, layer0_anim1, ...], [layer1_anim0, layer1_anim1, ...], [], [layer3_anim0], ...], current = [0,0,0,...]
			if (this.listReadyToDisplay[i].animations[layer][this.listReadyToDisplay[i].currentAnimations[layer]].isDone()){
				this.listReadyToDisplay[i].incrementCurrentAnimation(layer);
				continue;
			}

			// It it ain't done, update!
			this.listReadyToDisplay[i].animations[layer][this.listReadyToDisplay[i].currentAnimations[layer]].update(this.frameDiff);
		}

	}
}

XMLscene.prototype.updatePrimitivesRotations = function(frameDiff){

	// Update all primitive's layer's rotations according to their current animation!
	for (var i in this.listReadyToDisplay){
		var currPrim = this.listReadyToDisplay[i];
		for (var layer = 0; layer < currPrim.animations.length; layer++){
			// Current layer has any animations...?
			if (currPrim.animations[layer].length == 0) continue;

			// Current layer finished its animations
			if (currPrim.currentAnimations[layer] >= currPrim.animations[layer].length){
				continue;
			}
			// Current layer is playing an animation
			currPrim.transformations[layer][currPrim.transformations[layer].length - 1][2] = currPrim.animations[layer][currPrim.currentAnimations[layer]].getRotationAngle();
		}
	}

}

XMLscene.prototype.updatePrimitivesTranslations = function(frameDiff){

	for (var i in this.listReadyToDisplay){
		var currPrim = this.listReadyToDisplay[i];

		for (var layer = 0; layer < currPrim.animations.length; layer++){
			if (currPrim.animations[layer].length == 0) continue;
			if (currPrim.currentAnimations[layer] >= currPrim.animations[layer].length){
				continue;
			}

			var thisTranslation = currPrim.animations[layer][currPrim.currentAnimations[layer]].getTranslation();

			var x = thisTranslation[0];
			var y = thisTranslation[1];
			var z = thisTranslation[2];

			var index = currPrim.currentAnimations[layer] + 2;

			currPrim.transformations[layer][currPrim.transformations[layer].length - index][1] = x;
			currPrim.transformations[layer][currPrim.transformations[layer].length - index][2] = y;
			currPrim.transformations[layer][currPrim.transformations[layer].length - index][3] = z;
		}
	}
}

XMLscene.prototype.switchGameCamera = function(){
	if (!this.cameraAnimationsGo){
		this.cameraAnimationsGo = true;
	}
	if (this.canChangeCamera){
		this.nextGameCamera();
	}
}



XMLscene.prototype.updateGameCameras = function(frameDiff){
	this.cameraAnimations[this.currentGameCamera].update(frameDiff);

	this.camera.setPosition(this.cameraAnimations[this.currentGameCamera].getCurrentPosition());
	this.camera.setTarget(this.cameraAnimations[this.currentGameCamera].target);

	if (this.cameraAnimations[this.currentGameCamera].isDone){
		this.canChangeCamera = true;
	}
	else this.canChangeCamera = false;

}


XMLscene.prototype.update = function(currTime){
	// Update all animated objects.
	if (this.graph.loadedOk){
		this.getFrameDiff(currTime);
		this.runAnimations(this.frameDiff);
		this.updatePrimitivesTranslations(this.frameDiff);
		this.updatePrimitivesRotations(this.frameDiff);

		if (this.cameraAnimationsGo)
			this.updateGameCameras(this.frameDiff);

		if (this.game != null){

			this.game.updateCurrentPieceAnimation(this.frameDiff);

			if (this.game.runningGameFilm){
				if (!this.game.animatingPiece){
					this.nextFrame();
				}
			}
		}
	}
}

XMLscene.prototype.logPicking = function (){
	if (this.pickMode == false) {

		if (this.inBotPlay){
			return;
		}

		if (this.currentPlayerIsBot()){
			this.inBotPlay = true;
			this.requestPlay(-1);
			return;
		} else this.inBotPlay = false;

		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					var customId = this.pickResults[i][1];	

					if (this.game.runningGameFilm){
						return;
					} 

					this.requestPlay(customId);

				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}

XMLscene.prototype.currentPlayerIsBot = function(){
	if (this.game.gameboard.board.currPlayer == 1){
		if (this.game.gameboard.board.player1Type == 1 || this.game.gameboard.board.player1Type == 2){
			return true;
		}
		return false;
	}
	else {
		if (this.game.gameboard.board.player2Type == 1 || this.game.gameboard.board.player2Type == 2){
			return true;
		}
		return false;
	}
	return false;
}

XMLscene.prototype.requestPlay = function(customId){
	if (this.game.gameboard.board.currPlayer == 1){
		switch(this.game.gameboard.board.player1Type){
			case 0: {
				this.game.gameboard.setSelected(customId);
				this.game.prologinput.changeSelected(customId);
				this.pressedId = customId;
				break;
			}
			case 1: {
				if (!this.game.animatingPiece) this.game.prologinput.getBotPlay(0);
				break;
			}
			case 2: {
				if (!this.game.animatingPiece) this.game.prologinput.getBotPlay(1);
				break;
			}
			default: break;
		}
	}
	else {
		switch(this.game.gameboard.board.player2Type){
			case 0: {
				this.game.gameboard.setSelected(customId);
				this.game.prologinput.changeSelected(customId);
				this.pressedId = customId;
				break;
			}
			case 1: {
				if (!this.game.animatingPiece) this.game.prologinput.getBotPlay(0);
				break;
			}
			case 2: {
				if (!this.game.animatingPiece) this.game.prologinput.getBotPlay(1);
				break;
			}
			default: break;
		}
	}
}


XMLscene.prototype.display = function () {

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.updateProjectionMatrix();
    this.loadIdentity();
	this.applyViewMatrix();
	
	this.setDefaultAppearance();

	if (this.graph.loadedOk)
	{	

		this.updateLights();
		for (var i = 0; i < this.lights.length; i++){
			this.lights[i].update();
		}
		
		for (var i in this.listReadyToDisplay){
			this.displayPrimToAnimation(this.listReadyToDisplay[i]);
		}

		if (this.game != null) {
			this.logPicking();

			this.game.gameboard.display();

		}
	}	

};