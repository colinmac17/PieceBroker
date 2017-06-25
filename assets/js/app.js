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

//set global vars for cityID, cuisineID 
var cityID, cuisineID, userBudget;

var cheapRestaurants = [];
var medRestaurants = [];
var expensiveRestaurants = [];

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

//Get User Choice for Cuisine
$(".gif").on("click", function() {
    cuisineID = $(this).attr("data-id");
    console.log(cuisineID);

    var queryURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=city&cuisines=${cuisineID}&count=20`;

    $.ajax({
        url: queryURL,
        method: 'GET',
        headers: {
            'user-key': apiKey
        }
    }).done(function(response) {
        console.log(response);
        for (var i = 0; i < response.restaurants.length; i++) {
            if (response.restaurants[i].restaurant.average_cost_for_two <= 25) {
                cheapRestaurants.push(response.restaurants[i]);
            } else if (response.restaurants[i].restaurant.average_cost_for_two > 25 && response.restaurants[i].restaurant.average_cost_for_two <= 50) {
                medRestaurants.push(response.restaurants[i]);
            } else {
                expensiveRestaurants.push(response.restaurants[i]);
            }
        }
        $('.foodType-container').fadeOut();
        $('.price-container').show();
        return cuisineID;
    });
});
<<<<<<< HEAD
>>>>>>> 3ac4412d1b7a7aac0dcc83fd369b84dae7568a0a
=======

$(".budget-gif").on('click', function() {
    userBudget = $(this).attr("data-id");


    if(userBudget === 'cheap') {
        var cheapRandNum = Math.floor(Math.random() * cheapRestaurants.length;
    }
});


//I'm Feeling Hungry click function
$('#hungryBtn').on('click', function(e) {
    e.preventDefault();

    //Array to Store Cuisine IDs
    var cuisineIDs = [73, 55, 1, 25, 148, 70, 177, 308];

    //Get randomNumbers for cuisine and restaurant data
    var randNumCuisine = Math.floor(Math.random() * (8));
    var randNumRestaurant = Math.floor(Math.random() * (10));

    //set random cuisineID
    cuisineID = cuisineIDs[randNumCuisine];

    //get user location
    var location = $('#locationInput').val();
    $('#locationInput').val('');

    //Set Zomato Endpoint
    var locationURL = `https://developers.zomato.com/api/v2.1/cities?q=${location}`;
    var searchURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=city&cuisines=${cuisineID}&count=10`;
    //Error message if user does not input data
    if (location.length < 1) {
        $('#failMsg').addClass('animated shake');
        $('#failMsg').html('Please enter a valid city');
    }
    //Get Zomato data for random restaurants
    else {
        $.ajax({
            url: locationURL,
            method: 'GET',
            headers: {
                'user-key': apiKey
            }
        }).done(function(response) {
            console.log(response);
            cityID = response.location_suggestions[0].id;

            $.ajax({
                url: searchURL,
                method: 'GET',
                headers: {
                    'user-key': apiKey
                }
            }).done(function(response) {
                //get random restaurant name
                console.log(response.restaurants[randNumRestaurant].restaurant.name);
            });
        });
    }
});
<<<<<<< HEAD
>>>>>>> 2e94c814207394c99d836eb6a9ab78348071d45d
=======

// grab title and fade
// grab gifs and fade










<<<<<<< HEAD
>>>>>>> 38369a56e0d64d6f3d50e2bc8433812c8e5d8eb7
=======

>>>>>>> a02881c48448fd787ace62f4f4061afc3a4bc266
