//set global var for user latitude and longitude, city and state
var userLatitude, userLongitude, userCity, userState;
//set global vars for API Keys
var apiKey, googleApiKey, mapQuestApiKey;

//load firebase
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

//get API Key from Firebase
database.ref().once("value", function(snapshot) {
    var sv = snapshot.val();
    //set value of apiKey
    apiKey = sv.apiKey;
    googleApiKey = sv.googleApiKey;
    mapQuestApiKey = sv.mapQuestApiKey;
});
$('.loader').hide();
// Only ask user for location if they are on the app
if (window.location.pathname === '/app') {
    window.onload = function() {
        //gather user location
        if (sessionStorage.getItem('latitude') !== null || sessionStorage.getItem('longitude') !== null) {
            $('#locationLoad').show();
            userLatitude = JSON.parse(sessionStorage.getItem('latitude'));
            userLongitude = JSON.parse(sessionStorage.getItem('longitude'));

            //Map Quest Reverse Geocoding API to get user Location
            var mapQuestUrl = `https://www.mapquestapi.com/geocoding/v1/reverse?key=2WVKqO9NXOy5IwHWVq4vzZZK5PZ5YjcK&location=${userLatitude}%2C${userLongitude}&outFormat=json&thumbMaps=false`;

            $.ajax({
                url: mapQuestUrl,
                method: 'GET'
            }).done(function(response) {
                userCity = response.results[0].locations[0].adminArea5;
                userState = response.results[0].locations[0].adminArea3;
                $('#locationLoad').hide();
                $('#locationInput').val(`${userCity}, ${userState}`);
            });
        } else {
            var startPos;
            var geoOptions = {
                timeout: 10 * 1000
            }
            $('#locationLoad').show();
            $('.loader').hide();
            var geoSuccess = function(position) {
                startPos = position;
                //set user latitude
                userLatitude = startPos.coords.latitude;
                //set user longitude
                userLongitude = startPos.coords.longitude;
                //push these values into local storage
                sessionStorage.setItem('latitude', userLatitude);
                sessionStorage.setItem('longitude', userLongitude);
                //Map Quest Reverse Geocoding API to get user Location
                var mapQuestUrl = `https://www.mapquestapi.com/geocoding/v1/reverse?key=2WVKqO9NXOy5IwHWVq4vzZZK5PZ5YjcK&location=${userLatitude}%2C${userLongitude}&outFormat=json&thumbMaps=false`;
                $.ajax({
                    url: mapQuestUrl,
                    method: 'GET'
                }).done(function(response) {
                    userCity = response.results[0].locations[0].adminArea5;
                    userState = response.results[0].locations[0].adminArea3;
                    //place user city and state in input box
                    $('#locationLoad').hide();
                    $('#locationInput').val(`${userCity}, ${userState}`);
                });
            };
            var geoError = function(error) {
                console.log('Error occurred. Error code: ' + error.code);
                $('#locationLoad').hide();
                // error.code can be:
                //   0: unknown error
                //   1: permission denied
                //   2: position unavailable (error response from location provider)
                //   3: timed out
            };

            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
        }
    };
}


// userResult, restaurant name, restaurant address, restaurant cuisine type, restaurant budget, restaurant rating, restaurant latitude, restaurant longitude
var userResult, recName, recAddress, recCity, recCuisine, recBudget, recRating, recDetails, destLatitude, destLongitude;

//set global vars for cityID, cuisineID 
var cityID, cuisineID, userBudget, restaurantID;

//set empty arrays for restaurant types
var cheapRestaurants = [];
var medRestaurants = [];
var expensiveRestaurants = [];

//array for progress bar messages
var progressMessages = ['You\'re getting closer to not being in an argument!', 'Having fun yet? Same here!', 'What do you like more - eating or arguing?', 'You\'re a real hero you know that?', 'If you don\'t enjoy arguing, you better go to the restaurant you match with', 'You\'re sooooo close!', 'You\'re lucky you\'re pretty cool', 'The only time to eat diet food is while you\'re waiting for the steak to cook', 'I always cook with wine. Sometimes I even add it to the food', 'Love and food are alike. Can never have enough of either', 'The trouble with eating Italian food is that five or six days later, you’re hungry again', 'Never eat more than you can lift', 'A fruit is a vegetable with looks and money. Plus, if you let fruit rot, it turns into wine, something Brussels sprouts never do'];


// gather user input
$('#submitBtn').on('click', function(e) {
    e.preventDefault();

    //get user location
    var location = $('#locationInput').val();
    $('#locationInput').val('');
    var locationNum = parseInt(location);

    //Set Zomato Endpoint
    var queryURL = `https://developers.zomato.com/api/v2.1/cities?q=${location}`;
    //Error message if user does not input data
    if (location.length < 1 || !isNaN(locationNum)) {
        $('#failMsg').addClass('animated shake');
        $('#failMsg').show();

        function removeMessage() {
            message = setTimeout(hideFailMessage, 3000);
        }
        removeMessage();
    }
    // Get Zomato Data and store cityID in a variable
    else {
        var progressMsgRandNum = Math.floor(Math.random() * progressMessages.length);
        $('#location-container').hide();
        $('.loader').show();
        $('#cuisineMsg').text(progressMessages[progressMsgRandNum]);
        $('#cuisineProgressMsg').show();
        $.ajax({
            url: queryURL,
            method: 'GET',
            headers: {
                'user-key': apiKey
            }
        }).done(function(response) {
            $('.loader').hide();
            $('#cuisineProgressMsg').hide();
            //confirm that user has entered in a city
            cityID = response.location_suggestions[0].id;
            $('#foodType-container').show();
            $('#progress1').show();
            $('#backButton1').show();
            return cityID;
        });
    }
});

//Get User Choice for Cuisine
$(".card-image").on("click", function() {
    var progressMsgRandNum = Math.floor(Math.random() * progressMessages.length);
    $('#foodType-container').hide();
    $('.loader').show();
    $('#budgetMsg').text(progressMessages[progressMsgRandNum]);
    $('#progress2').show();
    $('#budgetProgressMsg').show();
    cuisineID = $(this).attr("data-id");

    var queryURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=city&cuisines=${cuisineID}&count=20`;

    $.ajax({
        url: queryURL,
        method: 'GET',
        headers: {
            'user-key': apiKey
        }
    }).done(function(response) {
        $('.loader').hide();
        $('#backButton2').show();
        $('#budgetProgressMsg').hide();
        //For loop to push restaurants to budget arrays
        for (var i = 0; i < response.restaurants.length; i++) {
            if (response.restaurants[i].restaurant.average_cost_for_two < 40) {
                cheapRestaurants.push(response.restaurants[i]);
            } else if (response.restaurants[i].restaurant.average_cost_for_two >= 40 && response.restaurants[i].restaurant.average_cost_for_two < 80) {
                medRestaurants.push(response.restaurants[i]);
            } else {
                expensiveRestaurants.push(response.restaurants[i]);
            }
        }

        $('#budget-container').fadeIn();
        $('#backButton2').show();
        return cuisineID;
    });
});

$('.btn-large').on('click', function() {
    userBudget = $(this).attr("data-id");

    if (userBudget === 'cheap') {
        //check if there is a cheap restaurant
        if (cheapRestaurants.length === 0) {
            $('#cheapErrMsg').addClass('animated shake');
            $('#cheapErrMsg').show();

            function removeCheapMessage() {
                message = setTimeout(cheapFail, 3000);
            }
            removeCheapMessage();
        }
        var cheapRandNum = Math.floor(Math.random() * cheapRestaurants.length);
        userResult = cheapRestaurants[cheapRandNum].restaurant;
    } else if (userBudget === 'medium') {
        //check if there is a medium priced restaurant
        if (medRestaurants.length === 0) {
            $('#medErrMsg').addClass('animated shake');
            $('#medErrMsg').show();

            function removeMedMessage() {
                message = setTimeout(medFail, 3000);
            }
            removeMedMessage();
        }
        var medRandNum = Math.floor(Math.random() * medRestaurants.length);
        userResult = medRestaurants[medRandNum].restaurant;
    } else {
        //check if there is an expensive restaurant
        if (expensiveRestaurants.length === 0) {
            $('#expErrMsg').addClass('animated shake');
            $('#expErrMsg').show();

            function removeExpMessage() {
                message = setTimeout(expFail, 3000);
            }
            removeExpMessage();
        }
        var expensiveRandNum = Math.floor(Math.random() * expensiveRestaurants.length);
        userResult = expensiveRestaurants[expensiveRandNum].restaurant;
    }

    //in case there is no restaurant data
    if (userResult === undefined) {
        $('#errDiv').html(`Sorry no restaurants were found in ${location}`);
        $('#errDiv').show();
    }

    //Set data for Database variables
    recName = userResult.name;
    recAddress = userResult.location.address;
    recCity = userResult.location.city;
    recCuisine = userResult.cuisines;
    recBudget = userResult.average_cost_for_two / 2;
    recRating = userResult.user_rating.aggregate_rating;
    recDetails = userResult.url;

    //get latitude and longitude data from Zomato for Google maps
    destLatitude = userResult.location.latitude;
    destLongitude = userResult.location.longitude;

    //Data for Results Model
    var resultsData = {
        restaurant_name: recName,
        cuisine_type: recCuisine,
        city: recCity,
        budget: recBudget,
        rating: recRating,
        link: recDetails,
        saved: false
    };

    $.post('/app', resultsData, function(data) {});

    //add data to results page
    $('#recName').text(recName);
    $('#recAddress').text(recAddress);
    $('#recRating').text(recRating);
    $('#recDetails').attr("href", recDetails);
    $('#recCuisine').text(recCuisine);
    $('#recBudget').text(`$${recBudget}`);


    $('#budget-container').hide();
    $('#progress2').hide();
    $('#resultProgressMsg').show();
    $('#results-container').show();
    //set static map
    var map = $('#googleMapContainer');
    var imgSrc = `https://www.google.com/maps/embed/v1/directions?key=${googleApiKey}&origin=${userLatitude},${userLongitude}&destination=${destLatitude},${destLongitude}&avoid=tolls|highways`;
    $('.map-title').show();
    $('#showMap').attr('src', imgSrc);
    map.show();
});

//I'm Feeling Hungry click function
$('#hungryBtn').on('click', function(e) {
    e.preventDefault();

    //Array to Store Cuisine IDs
    var cuisineIDs = [73, 55, 1, 25, 148, 70, 177, 308];

    //Get randomNumbers for cuisine and restaurant data
    var randNumCuisine = Math.floor(Math.random() * (8));
    var randNumRestaurant = Math.floor(Math.random() * (20));

    //set random cuisineID
    cuisineID = cuisineIDs[randNumCuisine];

    //get user location
    var location = $('#locationInput').val();
    $('#locationInput').val('');
    var locationNum = parseInt(location);

    //Set Zomato Endpoint
    var locationURL = `https://developers.zomato.com/api/v2.1/cities?q=${location}`;
    //Error message if user does not input data
    if (location.length < 1 || !isNaN(locationNum)) {
        $('#failMsg').addClass('animated shake');
        $('#failMsg').show();

        function removeMessage() {
            message = setTimeout(hideFailMessage, 3000);
        }
        removeMessage();
    }
    //Get Zomato data for random restaurants
    else {
        var progressMsgRandNum = Math.floor(Math.random() * progressMessages.length);
        $('#location-container').hide();
        $('.loader').show();
        $('#hungryMsg').text(progressMessages[progressMsgRandNum]);
        $('#hungryProgressMsg').show();

        $.ajax({
            url: locationURL,
            method: 'GET',
            headers: {
                'user-key': apiKey
            }
        }).done(function(response) {
            cityID = response.location_suggestions[0].id;
            var searchURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=city&cuisines=${cuisineID}&count=20`;
            $.ajax({
                url: searchURL,
                method: 'GET',
                headers: {
                    'user-key': apiKey
                }
            }).done(function(response) {
                $('#hungryProgressMsg').hide();
                $('.loader').hide();
                //get random restaurant name
                userResult = response.restaurants[randNumRestaurant].restaurant;

                //in case there is no restaurant data
                if (userResult === undefined) {
                    $('#errDiv').html(`Sorry no restaurants were found in ${location}`);
                    $('#errDiv').show();
                }

                //Set data for Database variables
                recName = userResult.name;
                recAddress = userResult.location.address;
                recCity = userResult.location.city;
                recCuisine = userResult.cuisines;
                recBudget = userResult.average_cost_for_two / 2;
                recRating = userResult.user_rating.aggregate_rating;
                recDetails = userResult.url;

                //get latitude and longitude data from Zomato for Google maps
                destLatitude = userResult.location.latitude;
                destLongitude = userResult.location.longitude;

               //Data for Results Model
                var resultsData = {
                    restaurant_name: recName,
                    cuisine_type: recCuisine,
                    city: recCity,
                    budget: recBudget,
                    rating: recRating,
                    link: recDetails,
                    saved: false
                };

                $.post('/app', resultsData, function(data) {});

                //add data to results page
                $('#recName').text(recName);
                $('#recAddress').text(recAddress);
                $('#recRating').text(recRating);
                $('#recDetails').attr('href', recDetails);
                $('#recCuisine').text(recCuisine);
                $('#recBudget').text(`$${recBudget}`);


                $('#resultProgressMsg').show();
                $('#results-container').show();
                //set static map
                var map = $('#googleMapContainer');
                var imgSrc = `https://www.google.com/maps/embed/v1/directions?key=${googleApiKey}&origin=${userLatitude},${userLongitude}&destination=${destLatitude},${destLongitude}&avoid=tolls|highways`;
                $('.map-title').show();
                $('#showMap').attr('src', imgSrc);
                map.show();
            });
        });
    }
});

//Function to hide fail message
function hideFailMessage() {
    $('#failMsg').hide();
}

//functions to hide budget fail messages
function cheapFail() {
    $('#cheapErrMsg').hide();
}

function medFail() {
    $('#medErrMsg').hide();
}

function expFail() {
    $('#expErrMsg').hide();
}