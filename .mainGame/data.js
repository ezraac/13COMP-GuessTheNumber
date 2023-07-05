/*****************************************************/
// database.js
// holds all database variables

// database variables
const DBPATH = "userInformation";
const GAMEPATH = "userGameData";
const AUTHPATH = "authorizedUsers";
const LOBBY = "activeLobbies";

var loginStatus = ' ';
var readStatus = ' ';
var writeStatus = ' ';

var userDetails = {
  uid: '',
  email: '',
  name: '',
  photoURL: '',
  age: '',
  sex: '',
};

var permissions = {
  userAuthRole: null,
}

var userGameData = {
  PTB_avgScore: 0,
  PTB_timeRec: 0,
  gameName: '',
  TTT_Wins: 0,
  TTT_Losses: 0,
  GTN_Wins: 0,
  GTN_Losses: 0,
  GTN_Draws: 0,
}

var leaderboard = [];

var gameStats = []
var clientCreateLobby = []
var lobbyArray = [];
var playerTwoDetails = []

var inGame = false;
var onlineLobby;
var randomNum;
/*****************************************************/

/*****************************************************/
// login()
// Input event; called when user clicks LOGIN button
// Logs user into firebase using Google login
// Input:
// Return:
/*****************************************************/
function db_fbSync() {
  fb_login(userDetails, permissions);
  console.log(permissions);
}

function db_login() {

  if (HTML_checkLogin() == false) {
    fb_login(userDetails, permissions);
  } else {
    userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    userGameData = JSON.parse(sessionStorage.getItem("userGameData"));
    clientCreateLobby[0] = JSON.parse(sessionStorage.getItem("clientData"));

    if (HTML_checkPage() == "index.html") {
      HTML_loadPage()
    }
  }
}

function db_lobbyOnReadSort(_dbData) {
  console.log(_dbData)
  var playerData = _dbData
  let p2data, onlinegame
    for (let key in playerData) {
        if (key != userDetails.uid && key != "onlineGame") {
            p2data = playerData[key];
            console.log(p2data)
            sessionStorage.setItem("playerTwoData", JSON.stringify(p2data))
            playerTwoDetails = JSON.parse(sessionStorage.getItem("playerTwoData"))
        } else 
        if (key == userDetails.uid) {
            clientCreateLobby[0] = playerData[key]
            console.log(clientCreateLobby[0])
            sessionStorage.setItem("clientData", JSON.stringify(clientCreateLobby[0]))
        } else
        if (key == "onlineGame") {
          onlinegame = playerData[key]
          console.log(onlinegame)
          sessionStorage.setItem("currentGameData", JSON.stringify(onlinegame));
          gameStats = JSON.parse(sessionStorage.getItem("currentGameData"));
          gtn_checkDisconnect(onlinegame);
          gtn_checkOppGuess(onlinegame);
        }
    }

    if (p2data != null && onlinegame != null && inGame == false) {
      db_checkStart(p2data, onlinegame);
    }
}

function db_checkStart(_p2data, _onlineGame) {
  console.log("db_checkStart", _p2data, _onlineGame)
  if (_onlineGame.p1_Status == "online" && _onlineGame.p2_Status == "online" && inGame == false && _onlineGame.turn != "end") {
    console.log("yes", _p2data)
    inGame = true;
    sessionStorage.setItem("inGame", inGame)
    onlineLobby = sessionStorage.getItem("onlineLobby");
    fb_updateRec(onlineLobby, "onlineGame", {turn: "p1"});
    HTML_loadMultiGame(_p2data);
  }
}
/*****************************************************/
//    END OF PROG
/*****************************************************/