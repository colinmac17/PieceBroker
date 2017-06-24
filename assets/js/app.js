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

var apiKey = 'bd44f34a9f419b15bdda245f2c261942';

//set global cityID
var cityID;

// gather user input
$('#submitBtn').on('click', function(e) {
	e.preventDefault();

	var location = $('#locationInput').val();
  	$('#locationInput').val('');
	  var queryURL = `https://developers.zomato.com/api/v2.1/cities?q=${location}`;
	  $.ajax({
	    url: queryURL,
	    method: 'GET',
	    headers: {
	      'user-key': apiKey
	    }
	  }).done(function(response) {
	    console.log(response);
	    cityID = response.location_suggestions[0].id;
	    console.log(cityID);
	    return cityID;
	 });
});