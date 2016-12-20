function MySceneInterface() {
    CGFinterface.call(this);
};

MySceneInterface.prototype = Object.create(CGFinterface.prototype);
MySceneInterface.prototype.constructor = MySceneInterface;

MySceneInterface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);
	
	this.gui = new dat.GUI();
	
    return true;
};

MySceneInterface.prototype.addLights = function(){
	var group = this.gui.addFolder("Luzes");
	group.open();
	for (var i = 0; i < this.scene.nlights; i++){
		var name = 'light' + i;
		group.add(this.scene, name);
	}
}

MySceneInterface.prototype.processKeyDown = function(event) {
    switch (event.keyCode) 
    {
    	// V
		case (86): //this.scene.cycleCamera(); this.setActiveCamera(this.scene.camera); break;
		{
			if (!this.scene.cameraAnimationsGo){
				this.scene.cameraAnimationsGo = true;
			}
			if (this.scene.canChangeCamera){
				this.scene.nextGameCamera();
			}
		}
		// M	
		case (77): this.scene.cycleMaterials(); break;
	}
}