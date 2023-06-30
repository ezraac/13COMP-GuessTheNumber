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

var dbArray = [];

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
  let check = HTML_checkLogin()

  if (check == false) {
    fb_login(userDetails, permissions);
  } else if (check == true) {
    userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    userGameData = JSON.parse(sessionStorage.getItem("userGameData"));
    clientCreateLobby[0] = JSON.parse(sessionStorage.getItem("clientData"));

    if (HTML_checkPage() == "index.html") {
      HTML_loadPage()
    }
  }
}

function db_lobbyOnReadSort(_dbData) {
  var playerData = Object.values(_dbData);
  playerData.forEach(player => {
      for (let key in player) {

          if (key != userDetails.uid && key != "onlineGame") {
              playerTwoDetails = player[key];
              console.log(playerTwoDetails)
              sessionStorage.setItem("playerTwoData", JSON.stringify(playerTwoDetails))
              db_checkStart();
          }
          if (key == userDetails.uid) {
              clientCreateLobby[0] = player[key]
              console.log(clientCreateLobby[0])
              sessionStorage.setItem("clientData", JSON.stringify(clientCreateLobby[0]))
          }
          if (key == "onlineGame") {
            gameStats = player[key]
            sessionStorage.setItem("currentGameData", JSON.stringify(gameStats));

            gtn_checkDisconnect(gameStats);
            gtn_checkOppGuess(gameStats);
          }
      }
  })
}

function db_checkStart() {
  if (gameStats.p1_Status == "online" && gameStats.p2_Status == "online" && inGame == false) {
    console.log("yes")
    inGame = true;
    sessionStorage.setItem("inGame", inGame)
    onlineLobby = sessionStorage.getItem("onlineLobby");
    fb_updateRec(onlineLobby, "onlineGame", {turn: "p1"});
    HTML_loadMultiGame();
  }
}
/*****************************************************/
//    END OF PROG
/*****************************************************/