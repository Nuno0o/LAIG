function MySceneInterface() {
    CGFinterface.call(this);
};

MySceneInterface.prototype = Object.create(CGFinterface.prototype);
MySceneInterface.prototype.constructor = MySceneInterface;

MySceneInterface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);
    return true;
};

MySceneInterface.prototype.processKeyDown = function(event) {
    switch (event.keyCode) 
    {
    	// V
		case (86): this.scene.cycleCamera(); this.setActiveCamera(this.scene.camera); break;
	}
}