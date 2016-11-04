function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	this.idList = [];
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.dsxParser(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


MySceneGraph.prototype.addId = function(id, type){

	if (id == null) return false;
	
	var pair = [id, type];

	for ( var i in this.idList ){
		if (this.idList[i][0] == id && this.idList[i][1] == type){
			return false;
		}
	}

	this.idList[this.idList.length] = [id, type];
	return true;

}

function getDirectChildrenByTagName(rootElement,tagName){
	var retvalue = [];
	for(var i = 0;i < rootElement.children.length;i++){
		if(rootElement.children[i].tagName == tagName)
		retvalue.push(rootElement.children[i]);
	}
	return retvalue;
}

// ------------------------------------------------------------------------------------------
// --------------------------------- SCENE ELEMENTS PARSING ---------------------------------
// ------------------------------------------------------------------------------------------

// -------------------------------------------------------
// --------------------- ROOT AND AXIS -------------------
// -------------------------------------------------------

MySceneGraph.prototype.parseScene = function(rootElement){
	var elems = rootElement.getElementsByTagName('scene');

	if(elems[0] == null){
		return "no scene tag";
	}
	
	if(elems.length != 1){
		return "too many scene tags";
	}

	var scenes = elems[0];
	/* Elementos da scene*/
	
	this.root = this.reader.getString(scenes,'root');
	
	this.axis_length = this.reader.getFloat(scenes,'axis_length');
}

// --------------------------------------------------------------------------
// ----------------------------- PERSPECTIVE PARSING ------------------------
// --------------------------------------------------------------------------

function Perspective(perspective){

	this.id = perspective.id;

	this.near = parseFloat(perspective.attributes.getNamedItem("near").value);
	this.far = parseFloat(perspective.attributes.getNamedItem("far").value);
	this.angle = parseFloat(perspective.attributes.getNamedItem("angle").value);

	var from = perspective.getElementsByTagName('from');
	var to = perspective.getElementsByTagName('to');

	//deteção de erros...
	if (from == null || to == null){
		console.log("no from or to found in a perspective!");
		return null;
	}

	this.from_x = parseFloat(from[0].attributes.getNamedItem("x").value);
	this.from_y = parseFloat(from[0].attributes.getNamedItem("y").value);
	this.from_z = parseFloat(from[0].attributes.getNamedItem("z").value);

	this.to_x = parseFloat(to[0].attributes.getNamedItem("x").value);
	this.to_y = parseFloat(to[0].attributes.getNamedItem("y").value);
	this.to_z = parseFloat(to[0].attributes.getNamedItem("z").value);
}

Perspective.prototype.printPerspective = function(){
	return 	"id: " + this.id + "\n" +
			"near= " + this.near + "\n" +
			"far= " + this.far + "\n" +
			"angle= " + this.angle + "\n" + 
			"from: x = " + this.from_x + ", y = " + this.from_y + ", z = " + this.from_z + "\n" +
			"to: x = " + this.to_x + ", y = " + this.to_y + ", z = " + this.to_z + "\n";
}

MySceneGraph.prototype.parsePerspective = function(rootElement){
	var elems = rootElement.getElementsByTagName('views');
	
	if(elems[0] == null){
		return "no views tag";
	}
	
	if(elems.length != 1){
		return "too many views tags";
	}

    this.listviews = [];

	var nperspectives = elems[0].children.length;

	for (var i = 0; i < nperspectives; i++){

		//get current perspective from the list
		var curr_per = elems[0].children[i];

		//process it
		this.listviews[i] = new Perspective(curr_per);

		if(!this.addId(curr_per.id, "view")){
			return "Bad Id found: " + curr_per.id;
		}		
	}
}

// --------------------------------------------------------------------------
// --------------------------- ILLUMINATION PARSING -------------------------
// --------------------------------------------------------------------------

MySceneGraph.prototype.parseIllumination=function(rootElement){
	var elems = rootElement.getElementsByTagName('illumination');

	if(elems[0] == null){
		return "no illumination tag";
	}
	
	if(elems.length != 1){
		return "too many illumination tags";
	}

	var illumination = elems[0];

	this.doublesidedIllumination = this.reader.getBoolean(illumination, 'doublesided');
	this.localIllumination = this.reader.getBoolean(illumination, 'local');

	// [ r, g, b, a]
	this.ambient = [];
	this.background =[];

	this.ambient[0] = illumination.children[0].attributes.getNamedItem("r").value;
	this.ambient[1] = illumination.children[0].attributes.getNamedItem("g").value;
	this.ambient[2] = illumination.children[0].attributes.getNamedItem("b").value;
	this.ambient[3] = illumination.children[0].attributes.getNamedItem("a").value;

	this.background[0] = illumination.children[1].attributes.getNamedItem("r").value;
	this.background[1] = illumination.children[1].attributes.getNamedItem("g").value;
	this.background[2] = illumination.children[1].attributes.getNamedItem("b").value;
	this.background[3] = illumination.children[1].attributes.getNamedItem("a").value;
}

// -------------------------------------------------------------------------
// ------------------------------- LIGHT PARSING ---------------------------
// -------------------------------------------------------------------------

function LightOmni(light){

	this.id = light.id;
	this.enabled = parseInt(light.attributes.getNamedItem('enabled').value);

	var locations, ambient, diffuse, specular;

	locations = light.getElementsByTagName('location');
	ambient = 	light.getElementsByTagName('ambient');
	diffuse = 	light.getElementsByTagName('diffuse');
	specular = 	light.getElementsByTagName('specular');

	this.location_x = parseFloat(locations[0].attributes.getNamedItem("x").value);
	this.location_y = parseFloat(locations[0].attributes.getNamedItem("y").value); 
	this.location_z = parseFloat(locations[0].attributes.getNamedItem("z").value);
	this.location_w = parseFloat(locations[0].attributes.getNamedItem("w").value);

	this.ambient_r = parseFloat(ambient[0].attributes.getNamedItem("r").value);
	this.ambient_g = parseFloat(ambient[0].attributes.getNamedItem("g").value); 
	this.ambient_b = parseFloat(ambient[0].attributes.getNamedItem("b").value);
	this.ambient_a = parseFloat(ambient[0].attributes.getNamedItem("a").value);

	this.diffuse_r = parseFloat(diffuse[0].attributes.getNamedItem("r").value);
	this.diffuse_g = parseFloat(diffuse[0].attributes.getNamedItem("g").value); 
	this.diffuse_b = parseFloat(diffuse[0].attributes.getNamedItem("b").value);
	this.diffuse_a = parseFloat(diffuse[0].attributes.getNamedItem("a").value);

	this.specular_r = parseFloat(specular[0].attributes.getNamedItem("r").value);
	this.specular_g = parseFloat(specular[0].attributes.getNamedItem("g").value); 
	this.specular_b = parseFloat(specular[0].attributes.getNamedItem("b").value);
	this.specular_a = parseFloat(specular[0].attributes.getNamedItem("a").value);
}

function LightSpot(light){
	this.id = light.id;
	this.enabled = parseInt(light.attributes.getNamedItem("enabled").value);
	this.angle = parseFloat(light.attributes.getNamedItem("angle").value);
	this.exponent = parseFloat(light.attributes.getNamedItem("exponent").value);

	var locations, ambient, diffuse, specular;
	
	target = 	light.getElementsByTagName("target");
	locations = 	light.getElementsByTagName("location");
	ambient = 	light.getElementsByTagName("ambient");
	diffuse = 	light.getElementsByTagName("diffuse");
	specular = 	light.getElementsByTagName("specular");

	this.target_x = parseFloat(target[0].attributes.getNamedItem("x").value);
	this.target_y = parseFloat(target[0].attributes.getNamedItem("y").value); 
	this.target_z = parseFloat(target[0].attributes.getNamedItem("z").value);

	this.location_x = parseFloat(locations[0].attributes.getNamedItem("x").value);
	this.location_y = parseFloat(locations[0].attributes.getNamedItem("y").value); 
	this.location_z = parseFloat(locations[0].attributes.getNamedItem("z").value);

	this.ambient_r = parseFloat(ambient[0].attributes.getNamedItem("r").value);
	this.ambient_g = parseFloat(ambient[0].attributes.getNamedItem("g").value); 
	this.ambient_b = parseFloat(ambient[0].attributes.getNamedItem("b").value);
	this.ambient_a = parseFloat(ambient[0].attributes.getNamedItem("a").value);

	this.diffuse_r = parseFloat(diffuse[0].attributes.getNamedItem("r").value);
	this.diffuse_g = parseFloat(diffuse[0].attributes.getNamedItem("g").value); 
	this.diffuse_b = parseFloat(diffuse[0].attributes.getNamedItem("b").value);
	this.diffuse_a = parseFloat(diffuse[0].attributes.getNamedItem("a").value);

	this.specular_r = parseFloat(specular[0].attributes.getNamedItem("r").value);
	this.specular_g = parseFloat(specular[0].attributes.getNamedItem("g").value); 
	this.specular_b = parseFloat(specular[0].attributes.getNamedItem("b").value);
	this.specular_a = parseFloat(specular[0].attributes.getNamedItem("a").value);
}

MySceneGraph.prototype.parseLights = function(rootElement){
	var elems = rootElement.getElementsByTagName('lights');

	if (elems[0] == null) {
		return "no lights tag";
	}

	if (elems.length != 1){
		return "too many lighs tags";
	}

	this.lightsOmni = elems[0].getElementsByTagName('omni');
	this.lightsSpot = elems[0].getElementsByTagName('spot');

	this.listOmni = [];
	this.listSpot = [];

	for (var i = 0; i < this.lightsOmni.length; i++){
		this.listOmni[i] = new LightOmni(this.lightsOmni[i]);
		if(!this.addId(this.listOmni[i].id, "light")){
			return "Bad Id found: " + this.listOmni[i].id;
		}	
	}

	for (var i = 0; i < this.lightsSpot.length; i++){
		this.listSpot[i] = new LightSpot(this.lightsSpot[i]);
		if(!this.addId(this.listSpot[i].id, "light")){
			return "Bad Id found: " + this.listSpot[i].id;
		}	
	}
}

// --------------------------------------------------------------------
// --------------------------- TEXTURE PARSNG -------------------------
// --------------------------------------------------------------------

function Texture(texture){
	this.id = texture.id;
	this.file = texture.attributes.getNamedItem("file").value;
	this.length_s = parseFloat(texture.attributes.getNamedItem("length_s").value);
	this.length_t = parseFloat(texture.attributes.getNamedItem("length_t").value);
}

Texture.prototype.printTexture = function(){
	return 	"id: " + this.id + "\n" +
			"file: " + this.file + "\n" +
			"length_s: " + this.length_s + "\n" + 
			"length_t: " + this.length_t + "\n";
}

MySceneGraph.prototype.parseTexture = function(rootElement){
	var elems = rootElement.getElementsByTagName('textures');

	if(elems[0] == null){
		return "no textures tag";
	}
	
	if(elems.length != 1){
		return "too many textures tags";
	}
	
	this.textures = [];
	
	var ntextures = elems[0].children.length;
	
	if (ntextures < 1){
		return "not enough textures!";
	}

	for (var i = 0; i < ntextures; i++){
		var curr_tex = elems[0].children[i];
		this.textures[i] = new Texture(curr_tex);
		if(!this.addId(curr_tex.id, "texture")){
			return "Bad Id found: " + curr_tex.id;
		}
	}
}

// -------------------------------------------------------------------------
// ------------------------------ MATERIAL PARSING -------------------------
// -------------------------------------------------------------------------

function Material(material){
	this.id = material.id;
	
	//emission
	var emission = material.getElementsByTagName('emission');
	if(emission[0] == null){
		return "no emissions tag in materials";
	}
	if(emission.length != 1){
		return "too many emissions tags in materials";
	}
	this.emission_r = parseFloat(emission[0].attributes.getNamedItem("r").value);
	this.emission_g = parseFloat(emission[0].attributes.getNamedItem("g").value);
	this.emission_b = parseFloat(emission[0].attributes.getNamedItem("b").value);
	this.emission_a = parseFloat(emission[0].attributes.getNamedItem("a").value);
	
	//ambient
	var ambient = material.getElementsByTagName('ambient');
	if(ambient[0] == null){
		return "no ambient tag in materials";
	}
	if(ambient.length != 1){
		return "too many ambient tags in materials";
	}
	this.ambient_r = parseFloat(ambient[0].attributes.getNamedItem("r").value);
	this.ambient_g = parseFloat(ambient[0].attributes.getNamedItem("g").value);
	this.ambient_b = parseFloat(ambient[0].attributes.getNamedItem("b").value);
	this.ambient_a = parseFloat(ambient[0].attributes.getNamedItem("a").value);
	
	//difuse
	var diffuse = material.getElementsByTagName('diffuse');
	if(diffuse[0] == null){
		return "no diffuse tag in materials";
	}
	if(diffuse.length != 1){
		return "too many diffuse tags in materials";
	}
	this.diffuse_r = parseFloat(diffuse[0].attributes.getNamedItem("r").value);
	this.diffuse_g = parseFloat(diffuse[0].attributes.getNamedItem("g").value);
	this.diffuse_b = parseFloat(diffuse[0].attributes.getNamedItem("b").value);
	this.diffuse_a = parseFloat(diffuse[0].attributes.getNamedItem("a").value);
	
	//specular
	var specular = material.getElementsByTagName('specular');
	if(specular[0] == null){
		return "no specular tag in materials";
	}
	if(specular.length != 1){
		return "too many specular tags in materials";
	}
	this.specular_r = parseFloat(specular[0].attributes.getNamedItem("r").value);
	this.specular_g = parseFloat(specular[0].attributes.getNamedItem("g").value);
	this.specular_b = parseFloat(specular[0].attributes.getNamedItem("b").value);
	this.specular_a = parseFloat(specular[0].attributes.getNamedItem("a").value);
	
	//shininess
	var shininess = material.getElementsByTagName('shininess');
	if(shininess[0] == null){
		return "no shininess tag in materials";
	}
	if(shininess.length != 1){
		return "too many shininess tags in materials";
	}
	this.shininess = parseFloat(shininess[0].attributes.getNamedItem("value").value);

}

MySceneGraph.prototype.parseMaterials = function(rootElement){
	var elems = getDirectChildrenByTagName(rootElement,'materials');

	if(elems[0] == null){
		return "no materials tag";
	}
	
	if(elems.length != 1){
		return "too many materials tags";
	}

	this.materials = [];

	var nmaterials = elems[0].children.length;

	if(nmaterials < 1){
		return "not enough materials";
	}

	for (var i = 0; i < nmaterials; i++){

		var curr_mat = elems[0].children[i];
		
		this.materials[i] = new Material(curr_mat);

		if(!this.addId(curr_mat.id, "material")){
			return "Bad Id found: " + curr_tex.id;
		}
	}
}

// ---------------------------------------------------------------------
// ------------------------- TRANSFORMATION PARSING --------------------
// ---------------------------------------------------------------------

function Change(chng){
	this.type = chng.tagName;
	if(this.type == 'scale'){
		this.scalex = parseFloat(chng.attributes.getNamedItem("x").value);
		this.scaley = parseFloat(chng.attributes.getNamedItem("y").value);
		this.scalez = parseFloat(chng.attributes.getNamedItem("z").value);
	}
	if(this.type == 'rotate'){
		this.axis = chng.attributes.getNamedItem("axis").value;
		this.angle = parseFloat(chng.attributes.getNamedItem("angle").value);
	}
	if(this.type == 'translate'){
		this.xtrans = parseFloat(chng.attributes.getNamedItem("x").value);
		this.ytrans = parseFloat(chng.attributes.getNamedItem("y").value);
		this.ztrans = parseFloat(chng.attributes.getNamedItem("z").value);
	}
}

function Transformations(trans){
	this.id = trans.id;
	var nchanges = trans.children.length;
	this.changes = [];
	for(var i = 0 ;i < nchanges;i++){
		var curr_change = trans.children[i];
		this.changes[i] = new Change(curr_change);
	}
}

MySceneGraph.prototype.parseTransformation = function(rootElement){
	elems = rootElement.getElementsByTagName('transformations');

	if(elems[0] == null){
		return "no transformations tag";
	}
	
	if(elems.length != 1){
		return "too many transformations tags";
	}

	this.transformations = [];

	var ntransforms = elems[0].children.length;

	if(ntransforms <1){
		return "not enough transformations!";
	}
	for(var i = 0;i < ntransforms;i++){
		var curr_trans = elems[0].children[i];
		this.transformations[i] = new Transformations(curr_trans);
		if(!this.addId(curr_trans.id, "transformation")){
			return "Bad Id found: " + curr_trans.id;
		}
	}
}

// ----------------------------------------------------------------------------
// ----------------------------- ANIMATION PARSING ----------------------------
// ----------------------------------------------------------------------------
function controlPoint(xx, yy, zz){
	this.xx = xx;
	this.yy = yy;
	this.zz = zz;
}

function parsedAnimation(anim){
	this.id = anim.id;
	this.span = parseFloat(anim.attributes.getNamedItem("span").value);
	this.type = anim.attributes.getNamedItem("type").value;
	
	if (this.type == "linear"){
		var points = anim.getElementsByTagName('controlpoint');
		var nControlPoints = points.length;
		this.controlPoints = [];
		for (var i = 0; i < nControlPoints; i++){
			this.controlPoints[i] = new controlPoint(	parseFloat(points[i].attributes.getNamedItem("xx").value),
														parseFloat(points[i].attributes.getNamedItem("yy").value),
														parseFloat(points[i].attributes.getNamedItem("zz").value));
		}
	}
	else if (this.type == "circular"){
		this.center = anim.attributes.getNamedItem("center").value.split(" ");
		this.center_x = parseFloat(this.center[0]);
		this.center_y = parseFloat(this.center[1]);
		this.center_z = parseFloat(this.center[2]);
		this.radius = parseFloat(anim.attributes.getNamedItem("radius").value);
		this.startang = parseFloat(anim.attributes.getNamedItem("startang").value);
		this.rotang = parseFloat(anim.attributes.getNamedItem("rotang").value);
	}
}

MySceneGraph.prototype.parseAnimations = function(rootElement){
	var elems = rootElement.getElementsByTagName('animations');

	if(elems[0] == null){
		return "no animations tag";
	}
	
	if(elems.length != 1){
		return "too many animations tags";
	}

    this.animations = [];

    var nanimations = elems[0].children.length;

    if(nanimations < 1){
    	return "not enough primitives";
    }
    for(var i = 0;i < nanimations;i++){
    	var curr_anim = elems[0].children[i];
    	this.animations[i] = new parsedAnimation(curr_anim);
    	if(!this.addId(curr_anim.id, "animation")){
			return "Bad Id found: " + curr_anim.id;
		}
    }
}


// ----------------------------------------------------------------------------
// ------------------------------ PRIMITIVE PARSING ---------------------------
// ----------------------------------------------------------------------------

function Primitive(prim){
	this.id = prim.id;

	if(prim.children.length != 1){
		console.log("So pode haver 1 forma dentro de primitive, no entanto há " + prim.children.length);
		return "erro a ler primitivas";
	}

	this.name = prim.children[0].tagName;

	if(this.name == "rectangle"){
		this.x1 = parseFloat(prim.children[0].attributes.getNamedItem("x1").value);
		this.x2 = parseFloat(prim.children[0].attributes.getNamedItem("x2").value);
		this.y1 = parseFloat(prim.children[0].attributes.getNamedItem("y1").value);
		this.y2 = parseFloat(prim.children[0].attributes.getNamedItem("y2").value);
		if(this.x1 != null && this.x2 != null && this.y1 != null && this.y2 != null)
		    return null;
	}
	if(this.name == "triangle"){
		this.x1 = parseFloat(prim.children[0].attributes.getNamedItem("x1").value);
		this.x2 = parseFloat(prim.children[0].attributes.getNamedItem("x2").value);
		this.x3 = parseFloat(prim.children[0].attributes.getNamedItem("x3").value);
		this.y1 = parseFloat(prim.children[0].attributes.getNamedItem("y1").value);
		this.y2 = parseFloat(prim.children[0].attributes.getNamedItem("y2").value);
		this.y3 = parseFloat(prim.children[0].attributes.getNamedItem("y3").value);
		this.z1 = parseFloat(prim.children[0].attributes.getNamedItem("z1").value);
		this.z2 = parseFloat(prim.children[0].attributes.getNamedItem("z2").value);
		this.z3 = parseFloat(prim.children[0].attributes.getNamedItem("z3").value);
		if(this.x1 != null && this.x2 != null && this.x3 != null && this.y1 != null && this.y2 != null && this.y3 != null && this.z1 != null && this.z2 != null && this.z3 != null) 
		    return null;
	}
	if(this.name == "cylinder"){
		this.base = parseFloat(prim.children[0].attributes.getNamedItem("base").value);
		this.top = parseFloat(prim.children[0].attributes.getNamedItem("top").value);
		this.height = parseFloat(prim.children[0].attributes.getNamedItem("height").value);
		this.slices = parseFloat(prim.children[0].attributes.getNamedItem("slices").value);
		this.stacks = parseFloat(prim.children[0].attributes.getNamedItem("stacks").value);
		if(this.top != null && this.height != null && this.slices != null && this.stacks != null)
		    return null;
	}
	if(this.name == "sphere"){
		this.radius = parseFloat(prim.children[0].attributes.getNamedItem("radius").value);
		this.slices = parseFloat(prim.children[0].attributes.getNamedItem("slices").value);
		this.stacks = parseFloat(prim.children[0].attributes.getNamedItem("stacks").value);
		if(this.radius != null && this.slices != null && this.stacks != null)
		    return null;
	}
	if(this.name == "torus"){
		this.inner = parseFloat(prim.children[0].attributes.getNamedItem("inner").value);
		this.outer = parseFloat(prim.children[0].attributes.getNamedItem("outer").value);
		this.slices = parseFloat(prim.children[0].attributes.getNamedItem("slices").value);
		this.loops = parseFloat(prim.children[0].attributes.getNamedItem("loops").value);
		if(this.loops != null && this.inner != null && this.outer != null && this.slices != null)
			return null;
	}
	return "Error parsing primitives";
}

MySceneGraph.prototype.parsePrimitives = function(rootElement){
	var elems = rootElement.getElementsByTagName('primitives');

	if(elems[0] == null){
		return "no primitives tag";
	}
	
	if(elems.length != 1){
		return "too many primitives tags";
	}

    this.primitives = [];

    if(elems.length != 1){
    	return "no primitives tag";
    }
    var nprimitives = elems[0].children.length;

    if(nprimitives< 1){
    	return "not enough primitives";
    }
    for(var i = 0;i < nprimitives;i++){
    	var curr_primitive = elems[0].children[i];
    	this.primitives[i] = new Primitive(curr_primitive);
    	if(!this.addId(curr_primitive.id, "primitive")){
			return "Bad Id found: " + curr_primitive.id;
		}
    }
}

// -----------------------------------------------------------------------
// ------------------------- COMPONENT PARSING ---------------------------
// -----------------------------------------------------------------------

function Component(graph,comp){
	this.id = comp.id;
	this.transformationref = null;
	this.materials = [];
	this.texture = null;
	this.componentrefs = [];
	this.primitiverefs = [];
	this.animationrefs = [];

	//transformation
	var transf = comp.getElementsByTagName('transformation');
	if(transf.length != 1){
		return "too many transformation tags in a component";
	}
	var tref = transf[0].getElementsByTagName('transformationref');
	//para caso de referencia a transformaçao ja existente
	if(tref.length >0){
		var found = false;
		for(var i = 0;i < graph.transformations.length;i++){
			if(graph.transformations[i].id == tref[0].id){
			    found = true;
			    break;
			}
		}
		if(found == false)
			return "id do componente nao atribuido";
		this.transformationref = tref[0].id;
	}else

	//para nova transformaçao
	{
		//tenta descobrir um novo id para a transformaçao, sendo este no formato transID
		for(var i = 0;i >= 0;i++){
			var newtransID = "trans";
			var n = this.id;
			var newid = newtransID.concat(n);
			if(graph.addId(newid,"transformation")){
				transf[0].id = newid;
				break;
			}

		}
		graph.transformations[graph.transformations.length] = new Transformations(transf[0]);
		this.transformationref = transf[0].id;
	}
	
	var aref = comp.getElementsByTagName('animationref');
	for (var i = 0; i < aref.length; i++){
		var found = false;
		for (var j = 0; j < graph.animations.length; j++){
			if (graph.animations[j].id == aref[i].id){
				found = true;
				break;
			}
		}
		if (!found)
			return "id de animacao no componente nao atribuido!";
		this.animationrefs[this.animationrefs.length] = aref[i].id;
	}
	
	//read children
	var child = comp.getElementsByTagName('children');
	if(child[0] == null){
		return "no children tag in a component";
	}
	if(child.length != 1){
		return "too many children tags in a component";
	}
	var compref = child[0].getElementsByTagName('componentref');
	var primref = child[0].getElementsByTagName('primitiveref');
	
	for(var j = 0;j < primref.length;j++){
		var found = false;
		for(var k = 0;k < graph.primitives.length;k++){
			if(primref[j].id == graph.primitives[k].id)
				found = true;
			}
		if(found == false)
			return "id da primitiva de um componente nao atribuida";
		this.primitiverefs[j] = primref[j].id;
	}
	

	for(var j = 0;j < compref.length;j++){
		this.componentrefs[j] = compref[j].id;
	}
	//read material
	var mater = comp.getElementsByTagName('materials');
	if(mater[0] == null){
		return "no materials tag in a component";
	}
	
	if(mater.length != 1){
		return "too many materials tags in a component";
	}
	for(var i = 0; i < mater[0].children.length;i++){
		var curr_mat = mater[0].children[i];
		var curr_id = curr_mat.id;

		if (curr_mat.id == "inherit"){
			this.materials[i] = "inherit";
		}
		else{
			var found = false;
			for(var j = 0;j < graph.materials.length;j++){
				if(graph.materials[j].id == curr_id){
					found = true;
					break;
				}
			}
			if(found == false)
				return "id do material de um componente nao atribuido";
			this.materials[i] = mater[0].children[i].id;
		}
	}
	//read texture
	var tex = comp.getElementsByTagName('texture');
	this.texture = tex[0].id;
}

MySceneGraph.prototype.parseComponents = function(rootElement){
	var elems = rootElement.getElementsByTagName('components');

	if(elems[0] == null){
		return "no components tag";
	}
	
	if(elems.length != 1){
		return "too many components tags";
	}

	this.components = [];

	if(elems.length != 1){
    	return "No components tag, or too many.";
    }

    var ncomponents = elems[0].children.length;

    if(ncomponents < 1){
    	return "not enough components";
    }

    for(var i = 0 ; i < ncomponents ; i++){
    	var curr_component = elems[0].children[i];
    	if(!this.addId(curr_component.id, "component")){
			return "Bad Id found: " + curr_component.id;
    	}
    	this.components[curr_component.id] = new Component(this,curr_component);
    }
}


MySceneGraph.prototype.verifyComponents = function(){
	for(var i = 0;i < this.components.length;i++){
		for(var j = 0;j < this.components[i].componentrefs.length;j++){
			var exists = false;
			for(var k = 0;k < this.components.length;k++){
				if(this.components[k].id == this.components[i].componentrefs[j])
					exists = true;
			}
			if(exists == false){
				return "a componente com id "+this.components[i].componentrefs[j]+ " nao existe";
			}
		}
	}

}

// -------------------------------------------------------------------------------------------
// ----------------------------------------- MAIN PARSER ------------------------------------
// ------------------------------------------------------------------------------------------

MySceneGraph.prototype.dsxParser=function (rootElement) {

	console.log("XML Loading finished.");
	this.parseScene(rootElement);

	// read views and perspectives
	
	this.errMsg = ""; 
	this.errMsg = this.parsePerspective(rootElement);
	if (this.errMsg != null) return this.errMsg;
	
	// read illumination

	this.errMsg = this.parseIllumination(rootElement);
	if (this.errMsg != null) return this.errMsg;

	// read lights

	this.errMsg = this.parseLights(rootElement);
	if (this.errMsg != null) return this.errMsg;

	// read materials

	this.errMsg = this.parseMaterials(rootElement);
	if (this.errMsg != null) return this.errMsg;

	// read Textures

	this.errMsg = this.parseTexture(rootElement);
	if (this.errMsg != null) return this.errMsg;

	//read Transformations

	this.errMsg = this.parseTransformation(rootElement);
	if (this.errMsg != null) return this.errMsg;

    //read primitives

	this.errMsg = this.parsePrimitives(rootElement);
	if (this.errMsg != null) return this.errMsg;

	// read animations
	
	this.errMsg = this.parseAnimations(rootElement);
	if (this.errMsg != null) return this.errMsg;
	
	//read components

	this.errMsg = this.parseComponents(rootElement);
	if (this.errMsg != null) return this.errMsg;
	
	//verify if components exist
	
	this.errMsg = this.verifyComponents(rootElement);
	if (this.errMsg != null) return this.errMsg;

}