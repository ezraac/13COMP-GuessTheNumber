/*****************************************************/
// fb_io.js
// Written by Mr Bob 2020
// Edited and tailored by Ezra 2022
/*****************************************************/

/*****************************************************/
// fb_initialise()
// Called by setup
// Initialize firebase
// Input:  n/a
// Return: n/a
/*****************************************************/
function fb_initialise() {
    console.log('fb_initialise: ');

    var firebaseConfig = {
        apiKey: "AIzaSyACgBfQCpj4tm5GTj7B9bDG_mkYyWYvVM8",
        authDomain: "comp-2023-ezrachai.firebaseapp.com",
        databaseURL: "https://comp-2023-ezrachai-default-rtdb.firebaseio.com",
        projectId: "comp-2023-ezrachai",
        storageBucket: "comp-2023-ezrachai.appspot.com",
        messagingSenderId: "334631994952",
        appId: "1:334631994952:web:34df1f77408a2b16e1fa7d",
        measurementId: "G-KGPN9CV9LG"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log(firebase);

    database = firebase.database();
}

/*****************************************************/
// fb_login(_dataRec, permissions)
// Called by setup
// Login to Firebase
// Input:  where to save the google data
// Return: n/a
/*****************************************************/
function fb_login(_dataRec, permissions) {
    console.log('fb_login: ');
    firebase.auth().onAuthStateChanged(newLogin);

    function newLogin(user) {
        if (user) {
            // user is signed in, so save Google login details
            _dataRec.uid = user.uid;
            _dataRec.email = user.email;
            _dataRec.name = user.displayName;
            _dataRec.photoURL = user.photoURL;


            fb_readRec(DBPATH, _dataRec.uid, userDetails, fb_processUserDetails); //reads user details
            fb_readOn(DBPATH, _dataRec.uid, userDetails, fb_processReadOn)
            fb_readRec(AUTHPATH, _dataRec.uid, permissions, fb_processAuthRole); //reads user auth role
            loginStatus = 'logged in';
            console.log('fb_login: status = ' + loginStatus);
        }
        else {
            // user NOT logged in, so redirect to Google login
            loginStatus = 'logged out';
            console.log('fb_login: status = ' + loginStatus);

            var provider = new firebase.auth.GoogleAuthProvider();
            //firebase.auth().signInWithRedirect(provider); // Another method
            firebase.auth().signInWithPopup(provider).then(function (result) {
                _dataRec.uid = result.user.uid;
                _dataRec.email = result.user.email;
                _dataRec.name = result.user.displayName;
                _dataRec.photoURL = result.user.photoURL;
                loginStatus = 'logged in via popup';
                console.log('fb_login: status = ' + loginStatus);
                fb_writeRec(AUTHPATH, _dataRec.uid, 1);
            })
                // Catch errors
                .catch(function (error) {
                    if (error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        loginStatus = 'error: ' + error.code;
                        console.log('fb_login: error code = ' + errorCode + '    ' + errorMessage);

                        alert(error);
                    }
                });
        }
    }
}

/*****************************************************/
// fb_writeRec(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/*****************************************************/
function fb_writeRec(_path, _key, _data, _location) {
    console.log(`fb_WriteRec: path= ${_path} key= ${_key}`);
    writeStatus = "waiting"
    firebase.database().ref(_path + "/" + _key).set(_data, function (error) {
        if (error) {
            writeStatus = "failure"
            console.log(error)
        }
        else {
            writeStatus = "ok"
            console.log(writeStatus)
            if (_location == "reg") {
                window.location.replace("../index.html")
            }
        }
    });
    console.log("fb_writerec exit")
}

/*****************************************************/
// fb_readAll(_path, _data)
// Read all DB records for the path
// Input:  path to read from and where to save it
// Return:
/*****************************************************/
function fb_readAll(_path, _data, _processAll) {
    console.log('fb_readAll: path= ' + _path);

    readStatus = "waiting"
    firebase.database().ref(_path).once("value", gotRecord, readErr)

    function gotRecord(snapshot) {
        if (snapshot.val == null) {
            readStatus = "no record"
        }
        else {
            readStatus = "ok"
            var dbData = snapshot.val()
            console.log(dbData)
            var dbKeys = Object.keys(dbData)

            //_processall in parameter
            _processAll(dbData, _data, dbKeys, _path)
        }
    }

    function readErr(error) {
        readData = "fail"
        console.log(error)
        _processAll(_data, dbData, dbKeys)
    }
}

/*****************************************************/
// fb_readRec(_path, _key, _data)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/*****************************************************/
function fb_readRec(_path, _key, _data, _processData, _readExtraVar) {
    console.log('fb_readRec: path= ' + _path + '  key= ' + _key);


    readStatus = "waiting"
    if (_path == LOBBY) {
        firebase.database().ref(`${_path}`).once("value", gotRecord, readErr)
    } else {
        firebase.database().ref(`${_path}/${_key}`).once("value", gotRecord, readErr)
    }

    function gotRecord(snapshot) {
        let dbData = snapshot.val()
        console.log(dbData)
        if (dbData == null) {
            readStatus = "no record"
            _processData(dbData, _data)
        }
        else {
            readStatus = "ok"
            if (_path == GAMEPATH) {
                _processData(dbData, _data, _readExtraVar);
                // } else if (_path == LOBBY) {
                // _processData(dbData, _data);
            } else {
                _processData(dbData, _data);
                console.log(_data)
            }
        }
    }

    function readErr(error) {
        readStatus = "fail"
        console.log(error)
    }
}

/*
fb_processUserDetails(_dbData, _data)
called by fb_login and in fb_readRec
checks if there is data in the database
if none shows reg page
if data exists put in variable userDetails
*/
function fb_processUserDetails(_dbData, _data) {
    console.log("processing data")
    console.log(_dbData)
    //if no data in db
    //shows reg page and fills name + email in form
    if (_dbData == null) {
        sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
        window.location.replace("pages/regPage.html");
    } else {
        userDetails.uid = _dbData.uid
        userDetails.name = _dbData.name
        userDetails.email = _dbData.email
        userDetails.photoURL = _dbData.photoURL
        userDetails.sex = _dbData.sex
        userDetails.age = _dbData.age

        fb_readRec(GAMEPATH, _dbData.uid, userDetails, fb_processGameData, "all"); //reads user game data
    }
}

/*
fb_processAuthRole(_dbData, _data)
called in fb_login and fb_readRec
processes user's auth role
if no data exists makes data for user
if data exists update permissions variable (data.js)
calls function to check perms for admin button
*/
function fb_processAuthRole(_dbData, _data) {
    if (_dbData == null) {
        fb_writeRec(AUTHPATH, userDetails.uid, 1);
    } else {
        _data.userAuthRole = _dbData;
        // HTML_updateHTMLFromPerms();
    }
}

/*
fb_processGameData(_dbData, _data)
called after processing user details
if userdetails exists then game data has to exist
puts data in userGameData variable (data.js)
calls function to load page
*/
function fb_processGameData(_dbData, _data, _game) {
    if (_game == "all") {
        userGameData.gameName = _dbData.gameName
        userGameData.PTB_timeRec = _dbData.PTB_timeRec
        userGameData.PTB_avgScore = _dbData.PTB_avgScore
        userGameData.TTT_Wins = _dbData.TTT_Wins
        userGameData.TTT_Losses = _dbData.TTT_Losses
        userGameData.GTN_Wins = _dbData.GTN_Wins
        userGameData.GTN_Losses = _dbData.GTN_Losses
        userGameData.GTN_Draws = _dbData.GTN_Draws
    }

    if (HTML_checkPage() == "index.html") {
        HTML_loadPage();
    } else if (HTML_checkPage() == "gamePage.html") {
        fb_processPlayerCreateLobby()
    }
}


/*
fb_processPlayerCreateLobby()
called after logging in automatically from gamePage.html
processes the user game data into lobby array
meant to allow the player to build a lobby
*/


function fb_processPlayerCreateLobby() {
    clientCreateLobby = [
        clientCreateLobby[userDetails.uid] = {
            gameName: userGameData.gameName,
            GTN_Wins: userGameData.GTN_Wins,
            GTN_Losses: userGameData.GTN_Losses,
            GTN_Draws: userGameData.GTN_Draws,
            UID: userDetails.uid,
            player: 1,
            p2_Status: "offline",
        }
    ]
}

/*
fb_processAll(_dbData, _data, dbKeys)
processes all data
iterates through dbkeys and adds data in _data
data is a whole persons data depending on path read
*/
function fb_processAll(_dbData, _data, dbKeys, _path) {
    console.log(_data, _dbData)
    if (_path == LOBBY) {
        for (i = 0; i < dbKeys.length; i++) {
            let key = dbKeys[i]
            let user = Object.values(_dbData[key])
            
            _data.push({
                gameName: user[0].gameName,
                GTN_Wins: user[0].GTN_Wins,
                GTN_Losses: user[0].GTN_Losses,
                GTN_Draws: user[0].GTN_Draws,
                UID: user[0].UID,
            })

            html_buildTableFunc("tb_userDetails", _data)
        }
    } else if (_path == GAMEPATH) {
        for (i = 0; i < dbKeys.length; i++) {
            let key = dbKeys[i]
            _data.push({
                gameName: _dbData[key].gameName,

            })
        }
    }
}

function fb_processReadOn(_dbData, _data, _path) {
    //console.log("processing data")
    //console.log(_dbData)
    //if no data in db
    //shows reg page and fills name + email in form
    if (_dbData == null) {
        //reg_showPage();
        //reg_popUp(userDetails);
        //document.getElementById("loadingText").style.display = "none";
    } else {

        if (_path == LOBBY) {
            console.log(_dbData);
            var playerData = Object.values(_dbData);
            playerData.forEach(player => {
                for (let key in player) {
                    if (key != userDetails.uid) {
                        playerTwoDetails = player[key];
                    } else if (key == userDetails.uid) {
                        clientCreateLobby = player[key]

                        if (clientCreateLobby.p2_Status == "online") {
                            HTML_loadMultiGame();
                        }
                    }
                }
            })

            console.log(playerData)
        } else {
            userDetails.uid = _dbData.uid
            userDetails.name = _dbData.name
            userDetails.email = _dbData.email
            userDetails.photoURL = _dbData.photoURL
            userDetails.sex = _dbData.sex
            userDetails.age = _dbData.age
        }


        //fb_readRec(GAMEPATH, _dbData.uid, userDetails, fb_processGameData); //reads user game data
    }
}

function fb_readOn(_path, _key, _data, _processData) {
    //console.log('fb_readRec: path= ' + _path + '  key= ' + _key);

    readStatus = "waiting"
    if (_path == LOBBY) {
        firebase.database().ref(`${_path}`).on("value", gotRecord, readErr);
    } else if (_path == DBPATH) {
        firebase.database().ref(`${_path}/${_key}`).on("value", gotRecord, readErr);
    }


    function gotRecord(snapshot) {
        let dbData = snapshot.val()
        //console.log(dbData)
        if (dbData == null) {
            readStatus = "no record"
            _processData(dbData)
        }
        else {
            readStatus = "ok"
            _processData(dbData, _data, _path)
        }
    }

    function readErr(error) {
        readStatus = "fail"
        //console.log(error)
    }
}


function fb_updateRec(_path, _key, _data) {
    writeStatus = "waiting";
    firebase.database().ref(_path + "/" + _key).update(_data, function (error) {
        if (error) {
            writeStatus = "failure"
            console.log(error)
        }
        else {
            writeStatus = "ok"
            console.log(writeStatus)
        }
    });
    console.log("fb_updaterec exit")
}


function fb_onDisconnect() {

}
/*****************************************************/
//    END OF MODULE
/*****************************************************/