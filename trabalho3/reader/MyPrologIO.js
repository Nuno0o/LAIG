// --------------------------------------------------------------------------------------

function PrologInput(scene){
    this.selectedTile = [];
    this.scene = scene;
    this.gameboard = this.scene.gameboard;
}

PrologInput.prototype.constructor = PrologInput;

PrologInput.prototype.changeSelected = function(ind){
    if (this.selectedTile.length >= 2) this.selectedTile = [];
    if (ind != 144) this.selectedTile.push(ind);
    if(this.selectedTile[this.selectedTile.length-2] < 144 && this.selectedTile[this.selectedTile.length-1] < 144
    	&& this.selectedTile.length == 2){
        //ENVIAR COORDS PARA PROLOG

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

    var requestString = requestObject.getRequestString();

    var requestPort = port || 8081  
    var request = new XMLHttpRequest();

    var prologInput = this;

    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = onSuccess || function (data) { 
        console.log("Request successful. Reply: " + data.target.response); 
        var response = data.target.response;
        if (getSuccessFromReply(response) == true) {
            prologInput.scene.playStack.push(new Play(requestObject.player, requestObject.x, requestObject.y, requestObject.targetX, requestObject.targetY));
            prologInput.gameboard.board.nextTurn();
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

function Play(Player,X,Y,TargetX,TargetY){
    this.player = Player;
    this.x = X;
    this.y = Y;
    this.targetX = TargetX;
    this.targetY = TargetY;
}

Play.prototype.constructor = Play;