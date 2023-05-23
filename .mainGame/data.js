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
  GTN_draws: 0,
}

var dbArray = [];

var lobbyArray = []
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
/*****************************************************/
//    END OF PROG
/*****************************************************/