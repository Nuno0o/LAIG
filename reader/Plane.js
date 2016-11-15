function Plane(scene,dimX,dimY,partsX,partsY) {
  this.dimX = dimX;
  this.dimY = dimY;
  this.partsX = partsX;
  this.partsY = partsY;

  this.initSurface();

  getSurfacePoint = function(u, v) {
		return this.nurbsSurface.getPoint(u, v);
	};
	CGFnurbsObject.call(this,scene,getSurfacePoint,20,20);

};

Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor=Plane;

Plane.prototype.initSurface = function () {
  var controlVertexes = [];
  for(var i = 0;i <= this.partsX;i++){
    controlVertexes.push([]);
  }
  for(var u = 0;u <= this.partsX;u++){
    for(var v = 0;v <= this.partsY;v++){
      controlVertexes[u][v] = [(u/this.partsX)*this.dimX-this.dimX/2,(v/this.partsY)*this.dimY-this.dimY/2,0,1];
    }
  }
  this.nurbsSurface = makeSurface(this.partsX,this.partsY,controlVertexes);

}

function getKnotsVector(degree) { // TODO (CGF 0.19.3): add to CGFnurbsSurface

	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}

function makeSurface(degree1,degree2,controlvertexes){
  var knots1 = this.getKnotsVector(degree1); // to be built inside webCGF in later versions ()
	var knots2 = this.getKnotsVector(degree2); // to be built inside webCGF in later versions

	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes); // TODO  (CGF 0.19.3): remove knots1 and knots2 from CGFnurbsSurface method call. Calculate inside method.
	return nurbsSurface;
}