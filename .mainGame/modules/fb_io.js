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
    console.log(`fb_WriteRec: path= ${_path} key= ${_key} data= ${_data.name}`);
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
            _processAll(snapshot, _data, dbKeys, _path)
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
function fb_readRec(_path, _key, _data, _processData, _gameRead) {
    console.log('fb_readRec: path= ' + _path + '  key= ' + _key);

    readStatus = "waiting"
    firebase.database().ref(`${_path}/${_key}`).once("value", gotRecord, readErr)

    function gotRecord(snapshot) {
        let dbData = snapshot.val()
        //console.log(dbData)
        if (dbData == null) {
            readStatus = "no record"
            _processData(dbData)
        }
        else {
            readStatus = "ok"
            if (_path == GAMEPATH) {
                _processData(dbData, _data, _gameRead);
            } else {
                _processData(dbData, _data);
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
        userGameData.GTN_wins = _dbData.GTN_wins
        userGameData.GTN_losses = _dbData.GTN_losses
        userGameData.GTN_draws = _dbData.GTN_draws
    }

    console.log("finished processing data")
    HTML_loadPage();
}

/*
fb_processAll(_dbData, _data, dbKeys)
processes all data
iterates through dbkeys and adds data in _data
data is a whole persons data depending on path read
*/
function fb_processAll(_dbData, _data, dbKeys, _path) {
    console.log(_data)
    if (_path == GAMEPATH) {
        for (i = 0; i < dbKeys.length; i++) {
            let key = dbKeys[i]
            _data.push({
                gameName: _dbData[key].gameName,
                GTN_Wins: _dbData[key].GTN_Wins,
                GTN_Losses: _dbData[key].GTN_Losses,
                GTN_Draws: _dbData[key].GTN_Draws,
                UID: _dbData[key].uid,
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
        }
        userDetails.uid = _dbData.uid
        userDetails.name = _dbData.name
        userDetails.email = _dbData.email
        userDetails.photoURL = _dbData.photoURL
        userDetails.sex = _dbData.sex
        userDetails.age = _dbData.age


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
/*****************************************************/
//    END OF MODULE
/*****************************************************/