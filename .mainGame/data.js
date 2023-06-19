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
/*****************************************************/

/*****************************************************/
// login()
// Input event; called when user clicks LOGIN button
// Logs user into firebase using Google login
// Input:
// Return:
/*****************************************************/
function db_login() {
  fb_login(userDetails, permissions);
}

function db_lobbyOnReadSort(_dbData) {
var playerData = Object.values(_dbData);
  playerData.forEach(player => {
      for (let key in player) {
          if (key != userDetails.uid && key != "onlineGame") {
              playerTwoDetails = player[key];
              sessionStorage.setItem("playerTwoData", JSON.stringify(playerTwoDetails))
          } else if (key == userDetails.uid) {
              clientCreateLobby[0] = player[key]
              sessionStorage.setItem("clientData", JSON.stringify(clientCreateLobby))

              if (clientCreateLobby[0].p2_Status == "online" && inGame == false) {
                  HTML_loadMultiGame();
                  inGame = true;
                  sessionStorage.setItem("inGame", inGame)
                  fb_writeRec(`${LOBBY}/LOBBY: ${userDetails.uid}`, "onlineGame", {turn: "p1"});
              }
          } else if (key == "onlineGame") {
              gameStats = player[key]
              sessionStorage.setItem("currentGameData", JSON.stringify(gameStats));

          }
      }
  })
}
/*****************************************************/
//    END OF PROG
/*****************************************************/