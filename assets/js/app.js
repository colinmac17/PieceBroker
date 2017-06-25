// load firebase
var config = {
    apiKey: "AIzaSyAFKkASmjO04PGg2KbBEOAlThg1rwd8Pkk",
    authDomain: "piecebroker-65733.firebaseapp.com",
    databaseURL: "https://piecebroker-65733.firebaseio.com",
    projectId: "piecebroker-65733",
    storageBucket: "piecebroker-65733.appspot.com",
    messagingSenderId: "189574691729"
<<<<<<< HEAD
  };
=======
};
>>>>>>> 3ac4412d1b7a7aac0dcc83fd369b84dae7568a0a

// initialize app
firebase.initializeApp(config);

// reference database
var database = firebase.database();

<<<<<<< HEAD
// gather user input

$('#submitBtn').on('click', function(e) {
	e.preventDefault();
});
=======
var apiKey = 'bd44f34a9f419b15bdda245f2c261942';

//set global cityID
var cityID;

// gather user input
$('#submitBtn').on('click', function(e) {
    e.preventDefault();

    //get user location
    var location = $('#locationInput').val();
    $('#locationInput').val('');

    //Set Zomato Endpoint
    var queryURL = `https://developers.zomato.com/api/v2.1/cities?q=${location}`;
    //Error message if user does not input data
    if (location.length < 1) {
        $('#failMsg').addClass('animated shake');
        $('#failMsg').html('Please enter a valid city');
    }
    // Get Zomato Data and store cityID in a variable
    else {
        $.ajax({
            url: queryURL,
            method: 'GET',
            headers: {
                'user-key': apiKey
            }
        }).done(function(response) {
            //confirm that user has entered in a city
            console.log(response);
            cityID = response.location_suggestions[0].id;
            console.log(cityID);
            $('.location-container').fadeOut();
            $('.foodType-container').show();
            return cityID;
        });
    }
});

var cuisineId;
$(".gif").on("click", function() {
    cuisineId = $(this).attr("data-id");
    console.log(cuisineId);

    var queryURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=city&cuisines=${cuisineId}&count=10`;

    $.ajax({
        url: queryURL,
        method: 'GET',
        headers: {
            'user-key': apiKey
        }
    }).done(function(response) {
        console.log(response);
    });
});
>>>>>>> 3ac4412d1b7a7aac0dcc83fd369b84dae7568a0a
