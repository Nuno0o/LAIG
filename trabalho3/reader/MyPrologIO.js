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
    console.log(data.target.response);
    //document.querySelector("#query_result").innerHTML = data.target.response;
}

function PrologInput(){
    this.selectedTile = [];
    this.selectedTile.push(144);
}

PrologInput.prototype.constructor = PrologInput;

PrologInput.prototype.changeSelected = function(ind){
    this.selectedTile.push(ind);
    if(this.selectedTile[this.selectedTile.length-2] < 144 && this.selectedTile[this.selectedTile.length-1] < 144){
        //ENVIAR COORDS PARA PROLOG
        console.log("coords para prolog");
    }
}