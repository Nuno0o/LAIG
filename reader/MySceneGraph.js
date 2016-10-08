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


MySceneGraph.prototype.addId = function(id){

	if (id == null) return false;

	for ( var i in this.idList ){
		if (this.idList[i] == id){
			return false;
		}
	}

	this.idList[this.idList.length] = id;
	return true;

}

MySceneGraph.prototype.parseScene = function(rootElement){
	var elems = rootElement.getElementsByTagName('scene');

	if(elems == 'null'){
		return "scene is missing";
	}
	if(elems.length != 1){
		return "too many scenes";
	}

	var scenes = elems[0];
	/* Elementos da scene*/
	
	this.root = this.reader.getString(scenes,'root');

	if(!this.addId(this.root)){
		return "Bad Id found " + this.root;
	}
	
	this.axis_length = this.reader.getFloat(scenes,'axis_length');
}

//Parse perspectives
MySceneGraph.prototype.parsePerspective = function(rootElement){
	var elems = rootElement.getElementsByTagName('views');
	
	if(elems == 'null'){
		return "view missing";
	}
	
	if(elems.length != 1){
		return "too many views";
	}

    this.listviews = [];

	var nperspectives = elems[0].children.length;

	for (var i = 0; i < nperspectives; i++){

		//get current perspective from the list
		var curr_per = elems[0].children[i];

		//process it
		this.listviews[curr_per.id] = new Perspective(curr_per);

		if(!this.addId(curr_per.id)){
			return "Bad Id found: " + curr_per.id;
		}

		//console.log("This Perspective: " + this.listviews[curr_per.id].printPerspective());
		
	}
}
// A simple class in which we store a perspective's attributes
function Perspective(perspective){

	this.id = perspective.id;

	this.near = perspective.attributes.getNamedItem("near").value;
	this.far = perspective.attributes.getNamedItem("far").value;
	this.angle = perspective.attributes.getNamedItem("angle").value;

	//console.log("near: " + this.near + ", far: " + this.far + ", angle: " + this.angle);

	this.from = perspective.children[0];
	this.to = perspective.children[1];

	//deteção de erros...
	if (this.from == null || this.to == null){
		console.log("no from or to found in a perspective!");
		return null;
	}

	this.from_x = this.from.attributes.getNamedItem("x").value;
	this.from_y = this.from.attributes.getNamedItem("y").value;
	this.from_z = this.from.attributes.getNamedItem("z").value;

	//console.log("FROM: x: " + this.from_x + ", y: " + this.from_y + ", z: " + this.from_z);

	this.to_x = this.to.attributes.getNamedItem("x").value;
	this.to_y = this.to.attributes.getNamedItem("y").value;
	this.to_z = this.to.attributes.getNamedItem("z").value;

	//console.log("TO: x: " + this.to_x + ", y: " + this.to_y + ", z: " + this.to_z);
}
// Print a perspective's attributes to the console
Perspective.prototype.printPerspective = function(){
	return 	"id: " + this.id + "\n" +
			"near= " + this.near + "\n" +
			"far= " + this.far + "\n" +
			"angle= " + this.angle + "\n" + 
			"from: x = " + this.from_x + ", y = " + this.from_y + ", z = " + this.from_z + "\n" +
			"to: x = " + this.to_x + ", y = " + this.to_y + ", z = " + this.to_z + "\n";
}

MySceneGraph.prototype.parseTexture = function(rootElement){
	var elems = rootElement.getElementsByTagName('textures');
	
	this.textures = [];
	
	var ntextures = elems[0].children.length;
	
	if (ntextures < 1){
		return "not enough textures!";
	}

	for (var i = 0; i < ntextures; i++){

		// get current texture
		var curr_tex = elems[0].children[i];
		
		// process it
		this.textures[i] = new Texture(curr_tex);

		if(!this.addId(curr_tex.id)){
			return "Bad Id found: " + curr_tex.id;
		}
	}
}


function Texture(texture){

	this.id = texture.id;
	this.file = texture.attributes.getNamedItem("file").value;
	this.length_s = texture.attributes.getNamedItem("length_s").value;
	this.length_t = texture.attributes.getNamedItem("length_t").value;

	// verificar valores invalidos...
}

Texture.prototype.printTexture = function(){
	return 	"id: " + this.id + "\n" +
			"file: " + this.file + "\n" +
			"length_s: " + this.length_s + "\n" + 
			"length_t: " + this.length_t + "\n";
}

MySceneGraph.prototype.parseTransformation = function(rootElement){
	elems = rootElement.getElementsByTagName('transformations');

	this.transformations = [];

	var ntransforms = elems[0].children.length;

	if(ntransforms <1){
		return "not enough transformations!";
	}
	for(var i = 0;i < ntransforms;i++){
		var curr_trans = elems[0].children[i];
		this.textures[curr_trans.id] = new Transformation(curr_trans);
		if(!this.addId(curr_trans.id)){
			return "Bad Id found: " + curr_trans.id;
		}
	}
}

function Transformation(trans){
	this.id = trans.id;

	this.translate = trans.getElementsByTagName('translate');
	this.rotate = trans.getElementsByTagName('rotate');
	this.scale = trans.getElementsByTagName('scale');

	this.xtrans = this.translate[0].attributes.getNamedItem("x").value;
	this.ytrans = this.translate[0].attributes.getNamedItem("y").value;
	this.ztrans = this.translate[0].attributes.getNamedItem("z").value;

	this.axis = this.rotate[0].attributes.getNamedItem("axis").value;
	this.angle = this.rotate[0].attributes.getNamedItem("angle").value;

	this.scalex = this.scale[0].attributes.getNamedItem("x").value;
	this.scaley = this.scale[0].attributes.getNamedItem("y").value;
	this.scalez = this.scale[0].attributes.getNamedItem("z").value;

}

// A function to read .dsx Illumination without cluttering the main function
MySceneGraph.prototype.parseIllumination=function(rootElement){
	var elems = rootElement.getElementsByTagName('illumination');

	if(elems == 'null'){
		return "illumination missing";
	}
	
	if(elems.length != 1){
		return "too many instances of illumination";
	}

	var illumination = elems[0];

	this.doublesidedIllumination = this.reader.getBoolean(illumination, 'doublesided');
	this.localIllumination = this.reader.getBoolean(illumination, 'local');

	// [ r, g, b, a]
	this.ambient = [];
	this.background =[];

	this.ambient = [];
	this.background = [];

	this.ambient[0] = illumination.children[0].attributes.getNamedItem("r").value;
	this.ambient[1] = illumination.children[0].attributes.getNamedItem("g").value;
	this.ambient[2] = illumination.children[0].attributes.getNamedItem("b").value;
	this.ambient[3] = illumination.children[0].attributes.getNamedItem("a").value;

	this.background[0] = illumination.children[1].attributes.getNamedItem("r").value;
	this.background[1] = illumination.children[1].attributes.getNamedItem("g").value;
	this.background[2] = illumination.children[1].attributes.getNamedItem("b").value;
	this.background[3] = illumination.children[1].attributes.getNamedItem("a").value;
		
}

MySceneGraph.prototype.parsePrimitives = function(rootElement){
	var elems = rootElement.getElementsByTagName('primitives');

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
    	if(!this.addId(curr_primitive.id)){
			return "Bad Id found: " + curr_primitive.id;
		}
    }
}

function Primitive(prim){
	this.id = prim.id;

	if(prim.children.length != 1){
		console.log("So pode haver 1 forma dentro de primitive, no entanto há " + prim.children.length);
		return 0;
	}

	this.name = prim.children[0].tagName;

	if(this.name == "rectangle"){
		this.x1 = prim.children[0].attributes.getNamedItem("x1").value;
		this.x2 = prim.children[0].attributes.getNamedItem("x2").value;
		this.y1 = prim.children[0].attributes.getNamedItem("y1").value;
		this.y2 = prim.children[0].attributes.getNamedItem("y2").value;
		if(this.x1 != null && this.x2 != null && this.y1 != null && this.y2 != null)
		    return 1;
	}
	if(this.name == "triangle"){
		this.x1 = prim.children[0].attributes.getNamedItem("x1").value;
		this.x2 = prim.children[0].attributes.getNamedItem("x2").value;
		this.x3 = prim.children[0].attributes.getNamedItem("x3").value;
		this.y1 = prim.children[0].attributes.getNamedItem("y1").value;
		this.y2 = prim.children[0].attributes.getNamedItem("y2").value;
		this.y3 = prim.children[0].attributes.getNamedItem("y3").value;
		this.z1 = prim.children[0].attributes.getNamedItem("z1").value;
		this.z2 = prim.children[0].attributes.getNamedItem("z2").value;
		this.z3 = prim.children[0].attributes.getNamedItem("z3").value;
		if(this.x1 != null && this.x2 != null && this.x3 != null && this.y1 != null && this.y2 != null && this.y3 != null && this.z1 != null && this.z2 != null && this.z3 != null) 
		    return 1;
	}
	if(this.name == "cylinder"){
		this.base = prim.children[0].attributes.getNamedItem("base").value;
		this.top = prim.children[0].attributes.getNamedItem("top").value;
		this.height = prim.children[0].attributes.getNamedItem("height").value;
		this.slices = prim.children[0].attributes.getNamedItem("slices").value;
		this.stacks = prim.children[0].attributes.getNamedItem("stacks").value;
		if(this.top != null && this.height != null && this.slices != null && this.stacks != null)
		    return 1;
	}
	if(this.name == "sphere"){
		this.radius = prim.children[0].attributes.getNamedItem("radius").value;
		this.slices = prim.children[0].attributes.getNamedItem("slices").value;
		this.stacks = prim.children[0].attributes.getNamedItem("stacks").value;
		if(this.radius != null && this.slices != null && this.stacks != null)
		    return 1;
	}
	if(this.name == torus){
		this.inner = prim.children[0].attributes.getNamedItem("inner").value;
		this.outer = prim.children[0].attributes.getNamedItem("outer").value;
		this.slices = prim.children[0].attributes.getNamedItem("slices").value;
		this.loops = prim.children[0].attributes.getNamedItem("loops").value;
		if(this.loops != null && this.inner != null && this.outer != null && this.slices != null)
			return 1;
	}
	return 0;

}


MySceneGraph.prototype.dsxParser=function (rootElement) {

	console.log("XML Loading finished.");
	this.parseScene(rootElement);

	//console.log("Values read: root: " + this.root + ", axis_length: " + this.axis_length);

	// read views and perspectives
	
	this.errMsg = "";

	this.errMsg = this.parsePerspective(rootElement);

	if (this.errMsg != null) return this.errMsg;
	
	// read illumination

	this.errMsg = this.parseIllumination(rootElement);
	
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
	
}