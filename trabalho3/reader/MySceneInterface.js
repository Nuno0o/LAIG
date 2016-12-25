function MySceneInterface() {
    CGFinterface.call(this);
};

MySceneInterface.prototype = Object.create(CGFinterface.prototype);
MySceneInterface.prototype.constructor = MySceneInterface;

MySceneInterface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);
	
	this.gui = new dat.GUI( {autoplace: false, width: 300 });
	
    return true;
};

MySceneInterface.prototype.addGameControls = function(){
	var group = this.gui.addFolder("Game Controls");
	group.open();
	group.add(this.scene, 'switchGameCamera');
	group.add(this.scene, 'resetGame');
	group.add(this.scene, 'undo');
	group.add(this.scene, 'runGameFilm');
}

MySceneInterface.prototype.addGameVars = function(){
	var group = this.gui.addFolder("Game Config");
	group.open();
	group.add(this.scene, "p1IsHuman", {Human: 0, Bot: 1});
	group.add(this.scene, "p2IsHuman", {Human: 0, Bot: 1});
	group.add(this.scene, "botDifficulty", { Random: 0, Smart: 1 });
}

MySceneInterface.prototype.addLights = function(){
	var group = this.gui.addFolder("Lights");
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
			this.scene.switchGameCamera();
			break;
		}
		// M	
		case (77): this.scene.cycleMaterials(); break;

		case (81): {
			this.scene.prologinput.makeRequest("quit");
			break;
		}
	}
}