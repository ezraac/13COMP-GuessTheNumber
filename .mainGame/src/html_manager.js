/*****************************************************/
// html_manager.js
// written by Ezra 2023
/*****************************************************/
window.onload = function () {

    fb_initialise();
    db_login();

    if (window.location.pathname.split("/").pop() == "gamePage.html") {
        fb_readRec(LOBBY, null, lobbyArray, fb_processLobbyData);
        fb_readOn(LOBBY, null, lobbyArray, fb_processReadOn);
    
    }
    
    // REG PAGE ONLOAD
    if (window.location.pathname.split("/").pop() == "regPage.html") {
        reg_popUp();
    }
  }
/*****************************************************/
// HTML_updateHTMLFromPerms();
// called by firebase.js in fb_processAuthRole();
// shows or destroys the admin button and admin page section according to userAuthRole
// makes ad_admin null -> cannot call ad_admin in console to show admin page
/*****************************************************/
var HTML_isAdmin = false;
function HTML_updateHTMLFromPerms() {
    console.log(permissions.userAuthRole)
    if (permissions.userAuthRole >= 2) {
        document.getElementById("lP_Admin").style.display = "block";
		HTML_isAdmin = true;
    } else {
    	document.getElementById("lP_Admin").remove();
      	document.getElementById("s_adminPage").remove();
		window.ad_admin = null; //sets function to null
    }
}

/*****************************************************/
// HTML_updateAdminPage(page);
// called by admin_manager.js in ad_user(), ad_home(), and ad_PTB()
// updates admin page tabs
/*****************************************************/
function HTML_updateAdminPage(page) {
    switch(page) {
        case "ad_user":
            document.getElementById("b_adUser").style.backgroundColor = "cyan";
            document.getElementById("b_adHome").style.backgroundColor = "grey";
            document.getElementById("b_adPTB").style.backgroundColor   = "grey";
            break;
        
        case "ad_home":
            //document.getElementById('gamePage').style.display    = "none";
            //document.getElementById("landingPage").style.display   = "block";
            //document.getElementById('s_adminPage').style.display = "none";
            window.location.replace("index.html")
            break;
        case "ad_Game":
            document.getElementById("b_adPTB").style.backgroundColor   = "cyan";
            document.getElementById("b_adUser").style.backgroundColor = "grey";
            document.getElementById("b_adHome").style.backgroundColor = "grey";
            break;
    }
}

/*****************************************************/
// HTML_editGameInfo(game);
// called by game_manager.js in setup()
// updates user info on side of game page
/*****************************************************/
function HTML_editGameInfo(game) {
    document.getElementById("username").innerHTML = `Username: ${userGameData.gameName}`;
    document.getElementById("hellouser").innerHTML = `Hello ${userDetails.name}`

	//ptb details
    if (game == "PTB") {
		document.getElementById("highavgscore").style.display = "block"
        document.getElementById("misses").innerHTML = "Misses: 0";
        document.getElementById("hitscore").innerHTML = "Average Hit Score: 0";
        document.getElementById("highavgscore").innerHTML = `Highest AHS: ${userGameData.PTB_avgScore}`;
        document.getElementById("highscore").innerHTML = `Fastest Time: ${userGameData.PTB_timeRec}s`;
        document.getElementById("game_timeDiv").style.display = "block";

	//tic tac toe details	
    } else if (game == "TTT") {
		document.getElementById("highavgscore").style.display = "none"
        document.getElementById("hitscore").innerHTML = `Wins: ${userGameData.TTT_Wins}`;
        document.getElementById("highscore").innerHTML = `Losses: ${userGameData.TTT_Losses}`;
        document.getElementById("misses").innerHTML = "";
        document.getElementById("game_timeDiv").style.display = "none";
    }
}

/*****************************************************/
// HTML_loadPage();
// called in firease.js in fb_processUserDetails
// removes login button and shows landing page
/*****************************************************/
function HTML_loadPage() {
    document.getElementById("landingPage").style.display = "block";
    document.getElementById("lP_loadingText").style.display = "none";
}

/*****************************************************/
// HTML_returnPage();
// called when user presses return button (in gamePage)
// shows landing page and hides gamepage
/*****************************************************/
function HTML_returnPage() {
    //document.getElementById("landingPage").style.display = "block";
    //document.getElementById("gamePage").style.display = "none";
}