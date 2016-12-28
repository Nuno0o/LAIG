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
/*
	Add game controls folder to interface
*/
MySceneInterface.prototype.addGameControls = function(){
		var group = this.gui.addFolder("Game Controls");
		group.open();
		group.add(this.scene, 'switchGameCamera');
		group.add(this.scene, 'undo');
		group.add(this.scene, 'runGameFilm');
		group.add(this.scene, "switchScene");
}
/*
	Add game variables folder to interface,along with restart button
*/
MySceneInterface.prototype.addGameVars = function(){
		var group = this.gui.addFolder("Game Config");
		group.open();
		group.add(this.scene, "player1", {Human: 0, Bot: 1});
		group.add(this.scene, "player2", {Human: 0, Bot: 1});
		group.add(this.scene, "botDifficulty", { Random: 0, Smart: 1 });
		group.add(this.scene, "turnTime", 5, 60);
		group.add(this.scene, "restartGame");
}
/*
	Add lights to interface
*/
MySceneInterface.prototype.addLights = function(){
	if(this.groupLights != null){
		for(var i = 0; i < this.listLights.length;i++){
			this.groupLights.remove(this.listLights[i]);
		}
	}else{
		this.groupLights = this.gui.addFolder("Lights");
	}
	this.groupLights.open();
	this.listLights = [];
	for (var i = 0; i < this.scene.nlights; i++){
		var name = 'light' + i;
		this.listLights[i] = this.groupLights.add(this.scene, name);
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
			this.scene.game.prologinput.makeRequest("quit");
			break;
		}
	}
}
