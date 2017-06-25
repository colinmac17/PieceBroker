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

//set global vars for cityID, cuisineID 
var cityID, cuisineID userName;

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

$(".gif").on("click", function() {
    cuisineID = $(this).attr("data-id");
    console.log(cuisineID);

    var queryURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=city&cuisines=${cuisineID}&count=10`;

    $.ajax({
        url: queryURL,
        method: 'GET',
        headers: {
            'user-key': apiKey
        }
    }).done(function(response) {
        console.log(response);
        $('.foodType-container').fadeOut();
        $('.price-container').show();
        return cuisineID;
    });
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

// grab title and fade
// grab gifs and fade











