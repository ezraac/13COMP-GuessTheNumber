var checkWrite = false

function gtn_guessNum() {
    var playerguess = parseInt(document.getElementById("gtn_guess").value);

    if (playerguess > 100 || playerguess < 0) {
        alert("please enter a number between 0 and 100")
    } else {
        if (gameStats.turn == `p${clientCreateLobby[0].player}`) {
            if (playerguess != randomNum) {
                document.getElementById("gp_gtnInfo").innerHTML = "turn: opponent";
                if (clientCreateLobby[0].player == 1) {
                    fb_updateRec(onlineLobby, "onlineGame", {playerOneGuess: playerguess, turn: "p2"});
                } else if (clientCreateLobby[0].player == 2) {
                    fb_updateRec(onlineLobby, "onlineGame", {playerTwoGuess: playerguess, turn: "p1"});
                }
            } else {
                checkWrite = true;
                fb_readOff(LOBBY, `LOBBY: ${gameStats.p1_uid}`);
                gameStats.turn = "end";
                if (clientCreateLobby[0].player == 1) {
                    fb_updateRec(onlineLobby, "onlineGame", {playerOneGuess: playerguess, turn: "end", winner: "p1"});
                    alert("you guessed the correct number!");
                } else if (clientCreateLobby[0].player == 2) {
                    fb_updateRec(onlineLobby, "onlineGame", {playerTwoGuess: playerguess, turn: "end", winner: "p2"});
                    alert("you guessed the correct number!");
                }

                gtn_resetLobby(clientCreateLobby[0], playerTwoDetails, gameStats);
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

    if (_onlineGame.turn == "end" && _onlineGame.p1_Status != "offline" && _onlineGame.p2_Status != "offline") {
        if (checkWrite == false) {
            fb_readOff(LOBBY, `LOBBY: ${_onlineGame.p1_uid}`)
            gtn_resetLobby(playerTwoDetails, clientCreateLobby[0], _onlineGame)
        }
    }
}


function gtn_resetLobby(_winner, _loser, _onlineGame) {
    console.log(_winner, _onlineGame)
    fb_onDisconnectOff(onlineLobby, "onlineGame", `p${clientCreateLobby[0].player}`);

    if (_winner.UID == clientCreateLobby[0].UID) {
        if (_onlineGame.turn == "end") {
            fb_writeRec(LOBBY, `LOBBY: ${_onlineGame.p1_uid}`, null);
            let wins = _winner.GTN_Wins += 1
            console.log(wins)
            fb_updateRec(GAMEPATH, _winner.UID, {GTN_Wins: wins})
        }
    }

    if (_loser.UID == clientCreateLobby[0].UID) {
        if (_onlineGame.turn == "end") {
            let loss = _loser.GTN_Losses += 1
            fb_updateRec(GAMEPATH, _loser.UID, {GTN_Losses: loss})
            userGameData.GTN_Losses += 1;
            clientCreateLobby[0].GTN_Losses = userGameData.GTN_Losses;
            alert("opponent guessed their random number");
        }
    }

    if (document.getElementById(`${_onlineGame.p1_uid}`)) {
        document.getElementById(`${_onlineGame.p1_uid}`).remove();
    }
    sessionStorage.setItem("clientData", JSON.stringify(clientCreateLobby[0]));

    sessionStorage.removeItem("playerTwoData");
    sessionStorage.removeItem("currentGameData");
    sessionStorage.removeItem("inGame");
    sessionStorage.removeItem("onlineGame");

    gameStats = null;
    playerTwoDetails = null;
    console.log("removed");
    checkWrite = false;
    inGame = false;
    HTML_returnLobby();
}

function gtn_checkDisconnect(_onlineGame) {
    console.log("check disconnect: " + _onlineGame.turn)
    if (inGame == true) {
        if (_onlineGame.p1_Status == "offline" || _onlineGame.p2_Status == "offline") {
            if (_onlineGame.p1_Status == "offline") {
                _onlineGame.turn = "end";
                _onlineGame.winner = "p2";
                gtn_resetLobby(clientCreateLobby[0], playerTwoDetails, _onlineGame)
            } else if (_onlineGame.p2_Status == "offline") {
                _onlineGame.turn = "end";
                _onlineGame.winner = "p1";
                gtn_resetLobby(clientCreateLobby[0], playerTwoDetails, _onlineGame)
            }
            fb_writeRec(LOBBY, `Lobby: ${_onlineGame.p1_uid}`, null);
            sessionStorage.removeItem("playerTwoData");
            sessionStorage.removeItem("currentGameData");
            sessionStorage.removeItem("inGame");
            sessionStorage.removeItem("onlineGame");
            HTML_returnLobby();
        }
    }
}