function Patch(scene,orderU,orderV,partsU,partsV,controlPoints) {
  this.orderU = orderU;
  this.orderV = orderV;
  this.partsU = partsU;
  this.partsV = partsV;
  this.controlPoints = controlPoints;
  this.initSurface();

  getSurfacePoint = function(u, v) {
		return this.nurbsSurface.getPoint(u, v);
	};
	CGFnurbsObject.call(this,scene,getSurfacePoint,this.partsU,this.partsV);

};

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor=Patch;

Patch.prototype.initSurface = function () {
  var controlVertexes = [];
  for(var i = 0;i <= this.orderU;i++){
    controlVertexes.push([]);
  }
  for(var u = 0;u <= this.orderU;u++){
    for(var v = 0;v <= this.orderV;v++){
		var index = u*(this.orderV+1)+v;
		controlVertexes[u][v] = [this.controlPoints[index][0],this.controlPoints[index][1],this.controlPoints[index][2],1];
    }
  }
  this.nurbsSurface = makeSurface(this.orderU,this.orderV,controlVertexes);

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
