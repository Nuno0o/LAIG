// --------------------------------------------------------------------------------------

function PrologInput(scene){
    this.selectedTile = [];
    this.scene = scene;
    this.gameboard = this.scene.gameboard;
}

PrologInput.prototype.constructor = PrologInput;

PrologInput.prototype.changeSelected = function(ind){
    if (this.selectedTile.length >= 2) this.selectedTile = [];

    if (ind != 144) {

    	if (this.selectedTile.length < 1 ){
    		if (this.gameboard.board.tiles[ind].pieces.length != 0) 
    			this.selectedTile.push(ind);
    	}
    	else this.selectedTile.push(ind);

    }

    if(this.selectedTile[this.selectedTile.length-2] < 144 && this.selectedTile[this.selectedTile.length-1] < 144
    	&& this.selectedTile.length == 2){

        var convertedXY, convertedTarget;
        convertedXY = this.convertTileToCoords(this.selectedTile[0]);
        convertedTarget = this.convertTileToCoords(this.selectedTile[1]);

        var board = this.gameboard.board.convertToPrologBoard();
        var player = this.getCurrentPlayer(this.gameboard.board.currPlayer);

        var team1queen = this.gameboard.getQueenSize(1);
        var team2queen = this.gameboard.getQueenSize(2);

        var request = new Request(player, convertedXY[0], convertedXY[1], convertedTarget[0], convertedTarget[1], team1queen, team2queen, board);
		this.makeRequest(request);
    }
}

PrologInput.prototype.getCurrentPlayer = function(currPlayer){
	if (currPlayer == 1) return "ivory";
	else if (currPlayer == 2) return "cigar";
	else return "UNKNOWN PLAYER";
}

PrologInput.prototype.convertTileToCoords = function(tileID){
	var y = Math.floor(tileID / 12);
	var x = tileID % 12;
	return [x, y]; 
}

PrologInput.prototype.getPrologRequest = function(requestObject, onSuccess, onError, port) {

    if(requestObject == "quit") requestString = "quit" ; 
    else{
       var requestString = requestObject.getRequestString();
    }

    var requestPort = port || 8081  
    var request = new XMLHttpRequest();

    var prologInput = this;

    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);


    // Make request to SICstus. Check Response.
    request.onload = onSuccess || function (data) { 

        var response = data.target.response;

        // Play was successful

        if (getSuccessFromReply(response) == true) {

            var isGameOver =  getGameOverFromReply(response);

            var pieceAnimation = new PieceAnimation(prologInput.scene.gameboard.board.tiles[requestObject.y*12 + requestObject.x].pieces, 
            										requestObject.x, requestObject.y, requestObject.targetX, requestObject.targetY,  prologInput.scene.gameboard.board.tileSize,
            										new Play(requestObject.player, requestObject.x, requestObject.y, requestObject.targetX, requestObject.targetY, isGameOver),
            										true);
			prologInput.scene.setCurrentPieceAnimation(pieceAnimation);

			prologInput.scene.gameboard.board.tiles[requestObject.y*12 + requestObject.x].setInAnimation(true, prologInput.scene.currentPieceAnimation);
        }
    };


    request.onerror = onError || function () { 
        console.log("Error waiting for response"); 
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();

    return request;
}

PrologInput.prototype.makeRequest = function(request){
    this.getPrologRequest(request);
}

PrologInput.prototype.handleReply = function(data){
    if (data.target.response == "Bad Request") return;
}

// ------------------------------------------------------------------------------------

getSuccessFromReply = function(replyString){
    var replyArray = replyString.split(',');
    if (replyArray[3] == "true") return true;
    return false;
}

getGameOverFromReply = function(replyString){
    var replyArray = replyString.split(',');
    if (replyArray[2] == "true") return true;
    return false;
}

function Request(Player, X, Y, TargetX, TargetY, IvoryStackIn, CigarStackIn, Board){
    this.player = Player;
    this.x = X;
    this.y = Y;
    this.targetX = TargetX;
    this.targetY = TargetY;
    this.iIn = IvoryStackIn;
    this.cIn = CigarStackIn;
    this.board = Board;
}

Request.prototype.constructor = Request;

Request.prototype.getRequestString = function(){
    return "makePlay(("+this.player+","+this.x+","+this.y+","+this.targetX+","+this.targetY+"),("+this.iIn+","+this.cIn+","+this.board+"))";
}


// -------------------------------------------------------------------------------------

function Play(Player,X,Y,TargetX,TargetY,IsGameOver){
    this.player = Player;
    this.x = X;
    this.y = Y;
    this.targetX = TargetX;
    this.targetY = TargetY;

    this.isGameOver = IsGameOver;
}

Play.prototype.constructor = Play;