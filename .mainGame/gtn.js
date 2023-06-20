var randomNum = Math.floor(Math.random() * 101)

function gtn_guessNum() {
    var playerguess = parseInt(document.getElementById("gtn_guess").value);
    
    if (gameStats.turn == `p${clientCreateLobby[0].player}`) {
        if (playerguess != randomNum) {
            if (clientCreateLobby[0].player == 1) {
                fb_writeRec(onlineLobby, "onlineGame", {playerOneGuess: playerguess, turn: "p2"});
            } else if (clientCreateLobby[0].player == 2) {
                fb_writeRec(onlineLobby, "onlineGame", {playerTwoGuess: playerguess, turn: "p1"});
            }
        } else {
            if (clientCreateLobby[0].player == 1) {
                fb_writeRec(onlineLobby, "onlineGame", {playerOneGuess: playerguess, turn: "end", winner: "p1"});
            } else if (clientCreateLobby[0].player == 2) {
                fb_writeRec(onlineLobby, "onlineGame", {playerTwoGuess: playerguess, turn: "end", winner: "p2"});
            }
        }
    }
}
