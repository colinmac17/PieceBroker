// load firebase
var config = {
    apiKey: "AIzaSyAFKkASmjO04PGg2KbBEOAlThg1rwd8Pkk",
    authDomain: "piecebroker-65733.firebaseapp.com",
    databaseURL: "https://piecebroker-65733.firebaseio.com",
    projectId: "piecebroker-65733",
    storageBucket: "piecebroker-65733.appspot.com",
    messagingSenderId: "189574691729"
};

//define apiKey variable as global to use in AJAX calls
var apiKey;

// initialize app
firebase.initializeApp(config);

// reference database
var database = firebase.database();

// restaurant name, restaurant address, restaurant cuisine type, restaurant budget, restaurant rating
var recName, recAddress, recCuisine, recBudget, recRating, recDetails;

//set global vars for cityID, cuisineID 
var cityID, cuisineID, userBudget, restaurantID;

var cheapRestaurants = [];
var medRestaurants = [];
var expensiveRestaurants = [];

//get API Key from Firebase
database.ref().once("value", function(snapshot) {
  // do some stuff once
  sv = snapshot.val();

  apiKey = sv.apiKey;

});

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
            $('.foodType-container').fadeIn();
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
        //For loop to push restaurants to budget arrays
        for (var i=0; i < response.restaurants.length; i++) {
            if(response.restaurants[i].restaurant.average_cost_for_two < 40) {
                cheapRestaurants.push(response.restaurants[i]);
            } else if (response.restaurants[i].restaurant.average_cost_for_two >= 40 && response.restaurants[i].restaurant.average_cost_for_two < 80) {
                medRestaurants.push(response.restaurants[i]);
            } else {
                expensiveRestaurants.push(response.restaurants[i]);
            }
        }
        $('.foodType-container').fadeOut();
        $('.price-container').fadeIn();
        return cuisineID;
    });
});

$('.budget-gif').on('click', function() {
    var userResult;
    userBudget = $(this).attr("data-id");

    if (userBudget === 'cheap') {
        var cheapRandNum = Math.floor(Math.random() * cheapRestaurants.length);
        userResult = cheapRestaurants[cheapRandNum].restaurant;
        console.log(userResult);
    } else if (userBudget === 'medium') {
        var medRandNum = Math.floor(Math.random() * medRestaurants.length);
        userResult = medRestaurants[medRandNum].restaurant;
        console.log(userResult);
    } else {
        var expensiveRandNum = Math.floor(Math.random() * expensiveRestaurants.length);
        userResult = expensiveRestaurants[expensiveRandNum].restaurant;
        console.log(userResult);
    }

    //Set data for Database variables
    recName = userResult.name;
    recAddress = userResult.location.address;
    recCuisine = userResult.cuisines;
    recBudget = userResult.average_cost_for_two;
    recRating = userResult.user_rating.aggregate_rating;
    recDetails = userResult.url;

    //add data to results page
    $('#recName').text(recName);
    $('#recAddress').text(recAddress);
    $('#recRating').text(recRating);
    $('#recLink').attr('href', recDetails);

    //push data to firebase
    addItemToFirebase(recName, recAddress, recCuisine, recBudget, recRating);

    $('.price-container').fadeOut();
    $('.results-container').fadeIn();
});

// snapshot
database.ref().on('child_added', function(childSnapshot){
    var sv = childSnapshot.val();
    //append elements to DOM
    renderItem(sv.recName, sv.recAddress, sv.recCuisine, sv.recBudget, sv.recRating);
});

// add items to firebase
function addItemToFirebase (name,address,cuisine,budget,rating) {
    if (recName && recAddress && recCuisine && recBudget && recRating) {
        database.ref().push({
            recName: name,
            recAddress: address,
            recCuisine: cuisine,
            recBudget: budget,
            recRating: rating
        });
    console.log(`Name: ${recName} Address: ${recAddress} Cuisine: ${recCuisine} Budget: ${recBudget} Rating: ${recRating}`);
    } else {
        console.log('data missing in firebase');
    };
}

// return items to DOM
function renderItem (recName,recAddress,recCuisine,recBudget,recRating) {
    var row = [recName,recAddress,recCuisine,recBudget,recRating].map(function (val) {
        return "<td>" + val + "</td>"
    }).join('');
}


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


