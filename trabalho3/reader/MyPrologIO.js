function getPrologRequest(requestString, onSuccess, onError, port) {
    var requestPort = port || 8081  
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = onSuccess || function (data) { 
        console.log("Request successful. Reply: " + data.target.response); 
    };
    request.onerror = onError || function () { 
        console.log("Error waiting for response"); 
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

function makeRequest(requestString) {
    // Make Request
    console.log(requestString);
    getPrologRequest(requestString, handleReply);
}

//Handle the Reply
function handleReply(data) {
	if (data.target.response == "Bad Request") return;
    console.log(data.target.response);
    //document.querySelector("#query_result").innerHTML = data.target.response;
}

function PrologInput(gameboard){
    this.selectedTile = [];
    this.gameboard = gameboard;
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

        // TODO: GET STACKS AND SEND THEM
		makeRequest("makePlay(("+player+","+convertedXY[0]+","+convertedXY[1]+","+convertedTarget[0]+","+convertedTarget[1]+"),(20,20,"+board+"))");
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