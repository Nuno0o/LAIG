/*
    An object used to establish connection to SICstus and all prolog logic
*/
function PrologInput(game){

    // pair of coordinates
    this.selectedTile = [];

    // game requesting prolog
    this.game = game;

    // game's board
    this.gameboard = this.game.gameboard;
}

PrologInput.prototype.constructor = PrologInput;

/*
    Human play. Get pairs of coordinates. Send (x,y), (targetX,targetY) to SICstus.
*/
PrologInput.prototype.changeSelected = function(ind){

    if(this.selectedTile.length >= 2){
      this.selectedTile[0] = this.selectedTile[1];
      this.selectedTile.splice(1,10);
    }

    // Push selected tile
    this.selectedTile.push(ind);

    // Selected tiles are valid (not the play)
    if( this.selectedTile.length == 2 && this.selectedTile[0] < 144 && this.selectedTile[1] < 144){

        // convert index to coords
        var convertedXY, convertedTarget;
        convertedXY = this.convertTileToCoords(this.selectedTile[0]);
        convertedTarget = this.convertTileToCoords(this.selectedTile[1]);

        // convert board to prolog board
        var board = this.gameboard.board.convertToPrologBoard();

        // player making the play
        var player = this.getCurrentPlayer(this.gameboard.board.currPlayer);

        // get queen stack sizes
        var team1queen = this.gameboard.getQueenSize(1);
        var team2queen = this.gameboard.getQueenSize(2);

        // create and make request for the play
        var request = new Request(player, convertedXY[0], convertedXY[1], convertedTarget[0], convertedTarget[1], team1queen, team2queen, board, false, 0);
		this.makeRequest(request);

    }
}

/*
    Bot Play, based on difficulty. Requests play from prolog
*/
PrologInput.prototype.getBotPlay = function(difficulty){
    // convert board to prolog board
    var board = this.gameboard.board.convertToPrologBoard();

    // player making the play
    var player = this.getCurrentPlayer(this.gameboard.board.currPlayer);

    // get queen stack sizes
    var team1queen = this.gameboard.getQueenSize(1);
    var team2queen = this.gameboard.getQueenSize(2);

    // create and make request for the play based on given difficulty
    var request = new Request(player, -1, -1, -1, -1, team1queen, team2queen, board, true, difficulty);
    this.makeRequest(request);
}

/*
    Get the current player (prolog form)
*/
PrologInput.prototype.getCurrentPlayer = function(currPlayer){
	if (currPlayer == 1) return "ivory";
	else if (currPlayer == 2) return "cigar";
	else return "UNKNOWN PLAYER";
}

/*
    Convert index to Coordinates
*/ 
PrologInput.prototype.convertTileToCoords = function(tileID){
	var y = Math.floor(tileID / 12);
	var x = tileID % 12;
	return [x, y];
}

/*
    Make request to Prolog
*/
PrologInput.prototype.getPrologRequest = function(requestObject, onSuccess, onError, port) {

    // Quit server?
    if(requestObject == "quit") requestString = "quit" ;
    else if (!requestObject.isBotPlay){
        // Human play?
       var requestString = requestObject.getHumanPlay();
    }else{
        // Bot Play?
        if (requestObject.botDifficulty == 0){
            var requestString = requestObject.getRandomPlay();
        }
        else {
            var requestString = requestObject.getSmartPlay();
        }
    }

    var requestPort = port || 8081
    var request = new XMLHttpRequest();

    var prologInput = this;

    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);


    // Make request to SICstus. Check Response.
    request.onload = onSuccess || function (data) {

        if (prologInput.game.currentPieceAnimation != null) return;

        var response = data.target.response;

        // Play was successful
        // Is human play
        if (!requestObject.isBotPlay){
            // Command successful
            if (getSuccessFromReply(response) == true) {

                // Game over?
                var isGameOver =  getGameOverFromReply(response);

                // Animate piece and make play
                var pieceAnimation = new PieceAnimation(prologInput.gameboard.board.tiles[requestObject.y*12 + requestObject.x].pieces,
                										requestObject.x, requestObject.y, requestObject.targetX, requestObject.targetY,  prologInput.game.scene.gameboard_tilesize,
                										new Play(requestObject.player, requestObject.x, requestObject.y, requestObject.targetX, requestObject.targetY, isGameOver),
                										true);

    			prologInput.game.setCurrentPieceAnimation(pieceAnimation);

    			prologInput.gameboard.board.tiles[requestObject.y*12 + requestObject.x].setInAnimation(true, prologInput.game.currentPieceAnimation);

           }
        }
        else { // Is bot play
            // Save play
            var play = getPlayFromReply(response);

            // Animate piece and make play
            var pieceAnimation = new PieceAnimation(prologInput.gameboard.board.tiles[play.y*12 + play.x].pieces,
                                                    play.x, play.y, play.targetX, play.targetY,  prologInput.game.scene.gameboard_tilesize,
                                                    play,
                                                    true);
            prologInput.game.setCurrentPieceAnimation(pieceAnimation);
            prologInput.gameboard.board.tiles[play.y*12 + play.x].setInAnimation(true, prologInput.game.currentPieceAnimation);
        }
    };


    request.onerror = onError || function () {
        console.log("Error waiting for response");
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();

    return request;
}

/*
    Execute request
*/
PrologInput.prototype.makeRequest = function(request){
    this.getPrologRequest(request);
}

/*
    Handle bad requests
*/
PrologInput.prototype.handleReply = function(data){
    if (data.target.response == "Bad Request") return;
}

// ------------------------------------------------------------------------------------

/*
    Reply given on a string. Get command success bool
*/ 
getSuccessFromReply = function(replyString){
    var replyArray = replyString.split(',');
    if (replyArray[3] == "true") return true;
    return false;
}

/*
    Reply given on a string. Get game over bool
*/
getGameOverFromReply = function(replyString){
    var replyArray = replyString.split(',');
    if (replyArray[2] == "true") return true;
    return false;
}

/*
    Reply given on a string. Get bot play
*/
getPlayFromReply = function(replyString){
    var replyArray = replyString.split(',');
    var gameOver;

    if (replyArray[2] == "true") gameOver = true;
    else gameOver = false;

    return new Play(replyArray[4],
                    parseInt(replyArray[5]),
                    parseInt(replyArray[6]),
                    parseInt(replyArray[7]),
                    parseInt(replyArray[8]),gameOver);

}

/*
    Object representing a request
*/
function Request(Player, X, Y, TargetX, TargetY, IvoryStackIn, CigarStackIn, Board, IsBotPlay, BotDifficulty){

    // Player making the requested play
    this.player = Player;

    // Requested coordinates
    this.x = X;
    this.y = Y;
    this.targetX = TargetX;
    this.targetY = TargetY;

    // Current stack sizes
    this.iIn = IvoryStackIn;
    this.cIn = CigarStackIn;

    // Current board
    this.board = Board;

    // Bot tags and difficulty
    this.isBotPlay = IsBotPlay;
    this.botDifficulty = BotDifficulty;
}

Request.prototype.constructor = Request;

/*
    Request human play
*/
Request.prototype.getHumanPlay = function(){
    return "makePlay(("+this.player+","+this.x+","+this.y+","+this.targetX+","+this.targetY+"),("+this.iIn+","+this.cIn+","+this.board+"))";
}

/*
    Request Random bot play
*/
Request.prototype.getRandomPlay = function(){
    return "insistOnCorrectBotRandomPlay("+this.player+",("+this.iIn+","+this.cIn+","+this.board+"))";
}

/*
    Request smart bot play
*/
Request.prototype.getSmartPlay = function(){
    return "playBestBot("+this.player+",("+this.iIn+","+this.cIn+","+this.board+"))";
}

// -------------------------------------------------------------------------------------
/*
    Object representing a play to be made
*/
function Play(Player,X,Y,TargetX,TargetY,IsGameOver){
    // Player
    this.player = Player;

    // Current position
    this.x = X;
    this.y = Y;

    // Target
    this.targetX = TargetX;
    this.targetY = TargetY;

    // Game ended?
    this.isGameOver = IsGameOver;
}

Play.prototype.constructor = Play;
