// load firebase
var config = {
    apiKey: "AIzaSyAFKkASmjO04PGg2KbBEOAlThg1rwd8Pkk",
    authDomain: "piecebroker-65733.firebaseapp.com",
    databaseURL: "https://piecebroker-65733.firebaseio.com",
    projectId: "piecebroker-65733",
    storageBucket: "piecebroker-65733.appspot.com",
    messagingSenderId: "189574691729"
  };

// initialize app
firebase.initializeApp(config);

// reference database
var database = firebase.database();

// gather user input

$('#submitBtn').on('click', function(e) {
	e.preventDefault();
});