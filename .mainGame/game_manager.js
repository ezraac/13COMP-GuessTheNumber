/****************************************************/
// code to manage what game is shown in the p5 canvas
// written by Ezra 2023
/****************************************************/
var whatGame;
var pBInterval; //asigned an interval
var started = false;
var cnv;

//functions when enetering a game

//popball
function game_enterGame(chosenGame) {
	sessionStorage.setItem("chosenGame", chosenGame);
	window.location.replace('pages/gamePage.html');
}


//default p5.js functions

/*
default function called automatically by p5.js
creates a canvas and sets the parent to div "game_canvasDiv" and positions it over that same div.
*/
function setup() {
	// let element = document.getElementById("game_canvasDiv")
	// cnv = createCanvas(element.offsetWidth, element.offsetHeight); //sets width and height to same as div
	// cnv.parent("game_canvasDiv");
	// whatGame = sessionStorage.getItem("chosenGame");
	// game_gameStart()
}

/*
default function draw
called after setup
any code inside it will be automatically executed continuously
amount of "draws" per second controlled by frame rate (defaulted to 60). to be left alone.
*/
function draw() {
	if (whatGame == "GTN") {
		background(255);
	} else if (whatGame == "TTT") {
		let element = document.getElementById("game_canvasDiv")
		background(0)
		textSize(50)
		text("UNDER DEVELOPMENT", 0, 0, 500, 500)
		fill('rbg(255, 255, 255)')
	}
}

/*
function for the start button
changes button function when clicked
*/
function game_gameStart() {
	if (whatGame == "GTN") {
		gtn_mainMenu()
	}
}

//next second - called by interval
function game_nextMs() {
	PTB_ms++;

	if (PTB_ms == 10) {
		PTB_time++;
		PTB_ms = 0;
	}
}

//game_resetVars
//called by game_gameStart
//resets vars on the side ui in game page
function game_resetVars() {
	started = true;
	PTB_ms = 0;
	PTB_time = 0;
	PTB_misses = 0;
	PTB_avgScore = 0;
}