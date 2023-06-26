var checkWrite = false

function gtn_guessNum() {
    var playerguess = parseInt(document.getElementById("gtn_guess").value);

    if (playerguess > 100 || playerguess < 1) {
        alert("please enter a number between 1 and 100")
    } else {
        if (gameStats.turn == `p${clientCreateLobby[0].player}`) {
            if (playerguess != randomNum) {
                document.getElementById("gp_gtnInfo").innerHTML = "turn: opponent";
                if (clientCreateLobby[0].player == 1) {
                    fb_writeRec(onlineLobby, "onlineGame", {playerOneGuess: playerguess, turn: "p2"});
                } else if (clientCreateLobby[0].player == 2) {
                    fb_writeRec(onlineLobby, "onlineGame", {playerTwoGuess: playerguess, turn: "p1"});
                }
            } else {
                checkWrite = true;
                if (clientCreateLobby[0].player == 1) {
                    fb_writeRec(onlineLobby, "onlineGame", {playerOneGuess: playerguess, turn: "end", winner: "p1"});
                    gtn_resetLobby(clientCreateLobby[0], playerTwoDetails, gameStats);
                    alert("you guessed the correct number!");
                } else if (clientCreateLobby[0].player == 2) {
                    fb_writeRec(onlineLobby, "onlineGame", {playerTwoGuess: playerguess, turn: "end", winner: "p2"});
                    gtn_resetLobby(playerTwoDetails, clientCreateLobby[0], gameStats);
                    alert("you guessed the correct number!");
                }
            }
        }
    }
}

function gtn_checkOppGuess(_onlineGame) {
    if (_onlineGame.turn == "p1" && clientCreateLobby[0].player == 1) {
        if (_onlineGame.playerTwoGuess) {
            document.getElementById("gp_opponentGuess").innerHTML = `opponent guessed: ${_onlineGame.playerTwoGuess}`;
            document.getElementById("gp_gtnInfo").innerHTML = "turn: you";
        }
    } else if (_onlineGame.turn == "p2" && clientCreateLobby[0].player == 2) {
        if (_onlineGame.playerOneGuess) {
            document.getElementById("gp_opponentGuess").innerHTML = `opponent gussed: ${_onlineGame.playerOneGuess}`;
            document.getElementById("gp_gtnInfo").innerHTML = "turn: you";
        }
    }

    if (_onlineGame.turn == "end") {
        if (checkWrite == false) {
            if (clientCreateLobby[0].player == 1) {
                gtn_resetLobby(clientCreateLobby[0], playerTwoDetails, _onlineGame);
            } else {
                gtn_resetLobby(playerTwoDetails, clientCreateLobby[0],  _onlineGame);
            }
        }
    }
}


function gtn_resetLobby(_playerOne, _playerTwo, _onlineGame) {

    fb_writeRec(LOBBY, `LOBBY: ${_playerOne.UID}`, null);

    if (clientCreateLobby[0].player == 1) {
        if (_onlineGame.turn == "end") {
            if (_onlineGame.winner == "p1") {
                let wins = _playerOne.GTN_Wins += 1
                console.log(wins)
                fb_updateRec(GAMEPATH, _playerOne.UID, {GTN_Wins: wins})
    
                let loss = _playerTwo.GTN_Losses += 1
                fb_updateRec(GAMEPATH, _playerTwo.UID, {GTN_Losses: loss})
            } else if (_onlineGame.winner == "p2") {
                let wins = _playerTwo.GTN_Wins += 1
                console.log(wins)
                fb_updateRec(GAMEPATH, _playerTwo.UID, {GTN_Wins: wins})
    
                let loss = _playerOne.GTN_Losses += 1
                fb_updateRec(GAMEPATH, _playerOne.UID, {GTN_Losses: loss})
                alert("opponent guessed their random number");
            }
    
            delete _playerOne.p2_Status;
            if (document.getElementById(`${_playerOne.UID}`)) {
                document.getElementById(`${_playerOne.UID}`).remove();
            }
        }
    
    } else {
        console.log("p2")
        if (_onlineGame.winner == "p1") {
            console.log("winner = p1");
            userGameData.GTN_Losses += 1;
            clientCreateLobby[0].GTN_Losses = userGameData.GTN_Losses;
            alert("opponent guessed their random number");
        } else if (_onlineGame.winner == "p2") {
            userGameData.GTN_Wins += 1;
            clientCreateLobby[0].GTN_Wins = userGameData.GTN_Wins;
        }
    }

    sessionStorage.setItem("clientData", JSON.stringify(clientCreateLobby[0]));

    sessionStorage.removeItem("playerTwoData");
    sessionStorage.removeItem("currentGameData");
    sessionStorage.removeItem("inGame");
    sessionStorage.removeItem("onlineGame");

    console.log("removed");
    checkWrite = false;
    HTML_returnLobby();
}