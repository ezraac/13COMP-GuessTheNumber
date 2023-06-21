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
                gtn_resetLobby(clientCreateLobby[0], playerTwoDetails, gameStats)
            } else if (clientCreateLobby[0].player == 2) {
                fb_writeRec(onlineLobby, "onlineGame", {playerTwoGuess: playerguess, turn: "end", winner: "p2"});
                gtn_resetLobby(playerTwoDetails, clientCreateLobby[0], gameStats)
            }
        }
    }
}

function gtn_checkOppGuess(_onlineGame) {
    if (_onlineGame.turn == "p1" && clientCreateLobby[0].player == 1) {
        if (_onlineGame.playerTwoGuess) {
            document.getElementById("gp_opponentGuess").innerHTML = `opponent guessed: ${_onlineGame.playerTwoGuess}`;
        }
    } else if (_onlineGame.turn == "p2" && clientCreateLobby[0].player == 2) {
        if (_onlineGame.playerOneGuess) {
            document.getElementById("gp_opponentGuess").innerHTML = `opponent gussed: ${_onlineGame.playerOneGuess}`;
        }
    }

    if (_onlineGame.turn == "end") {
        if (clientCreateLobby[0].player == 1) {
            gtn_resetLobby(clientCreateLobby[0], playerTwoDetails, _onlineGame)
        } else if (clientCreateLobby[0].player == 2) {
            gtn_resetLobby(clientCreateLobby[0], playerTwoDetails, _onlineGame)
        }
    }
}

function gtn_resetLobby(_playerOne, _playerTwo, _onlineGame) {
    fb_writeRec(LOBBY, `Lobby: ${_playerOne.UID}`, null);

    if (_onlineGame.turn == "end") {
        if (_onlineGame.winner == "p1") {
            let wins = _playerOne.GTN_Wins += 1
            fb_updateRec(GAMEPATH, _playerOne.UID, {GTN_Wins: wins})

            let loss = _playerTwo.GTN_Losses += 1
            fb_updateRec(GAMEPATH, _playerTwo.UID, {GTN_Losses: loss})
        } else if (_onlineGame.winner == "p2") {
            let wins = _playerTwo.GTN_Wins += 1
            fb_updateRec(GAMEPATH, _playerTwo.UID, {GTN_Wins: wins})

            let loss = _playerOne.GTN_Losses += 1
            fb_updateRec(GAMEPATH, _playerOne.UID, {GTN_Losses: loss})
        }

        sessionStorage.setItem("clientData", JSON.stringify(clientCreateLobby[0]));
    }

    sessionStorage.removeItem("playerTwoData");
    sessionStorage.removeItem("currentGameData");
    sessionStorage.removeItem("inGame");
    console.log("removed")
}