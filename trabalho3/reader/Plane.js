function Plane(scene,dimX,dimY,partsX,partsY) {
  this.dimX = dimX;
  this.dimY = dimY;
  this.partsX = partsX;
  this.partsY = partsY;

  this.initSurface();

  getSurfacePoint = function(u, v) {
		return this.nurbsSurface.getPoint(u, v);
	};
	CGFnurbsObject.call(this,scene,getSurfacePoint,partsX,partsY);

};

Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor=Plane;

Plane.prototype.initSurface = function () {
  var controlVertexes = [];
  var orderX = 1;
  var orderY = 1;
  for(var i = 0;i <= orderX;i++){
    controlVertexes.push([]);
  }
  for(var u = 0;u <= orderX;u++){
    for(var v = 0;v <= orderY;v++){
      controlVertexes[u][v] = [(u/orderX)*this.dimX-this.dimX/2,(v/orderY)*this.dimY-this.dimY/2,0,1];
    }
  }
  this.nurbsSurface = makeSurface(orderX,orderY,controlVertexes);

}

function getKnotsVector(degree) {

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
  var knots1 = this.getKnotsVector(degree1);
	var knots2 = this.getKnotsVector(degree2);

	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	return nurbsSurface;
}
