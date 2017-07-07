//set global var for user latitude and longitude, city and state
var userLatitude, userLongitude, userCity, userState;
//set global vars for API Keys
var apiKey, googleApiKey, mapQuestApiKey;

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

//get API Key from Firebase
database.ref().once("value", function(snapshot) {
    var sv = snapshot.val();
    //set value of apiKey
    apiKey = sv.apiKey;
    googleApiKey = sv.googleApiKey;
    mapQuestApiKey = sv.mapQuestApiKey;
});
window.onload = function() {
    //gather user location
    if (localStorage.getItem('latitude') !== null || localStorage.getItem('longitude') !== null) {
        $('#locationLoad').show();
        console.log('user data already stored');
        console.log(mapQuestApiKey);
        userLatitude = JSON.parse(localStorage.getItem('latitude'));
        userLongitude = JSON.parse(localStorage.getItem('longitude'));

        //Map Quest Reverse Geocoding API to get user Location
        var mapQuestUrl = `https://www.mapquestapi.com/geocoding/v1/reverse?key=2WVKqO9NXOy5IwHWVq4vzZZK5PZ5YjcK&location=${userLatitude}%2C${userLongitude}&outFormat=json&thumbMaps=false`;
        console.log(mapQuestUrl)

        $.ajax({
            url: mapQuestUrl,
            method: 'GET'
        }).done(function(response) {
            console.log(response);
            userCity = response.results[0].locations[0].adminArea5;
            userState = response.results[0].locations[0].adminArea3;
            console.log(`${userCity}, ${userState}`);
            $('#locationLoad').hide();
            $('#locationInput').val(`${userCity}, ${userState}`);
        });
    } else {
        console.log(mapQuestApiKey);
        var startPos;
        var geoOptions = {
            timeout: 10 * 1000
        }
        $('#locationLoad').show();
        var geoSuccess = function(position) {
            startPos = position;
            //set user latitude
            userLatitude = startPos.coords.latitude;
            //set user longitude
            userLongitude = startPos.coords.longitude;
            //push these values into local storage
            localStorage.setItem('latitude', userLatitude);
            localStorage.setItem('longitude', userLongitude);
            //Map Quest Reverse Geocoding API to get user Location
            var mapQuestUrl = `https://www.mapquestapi.com/geocoding/v1/reverse?key=2WVKqO9NXOy5IwHWVq4vzZZK5PZ5YjcK&location=${userLatitude}%2C${userLongitude}&outFormat=json&thumbMaps=false`;
            console.log(mapQuestUrl);
            $.ajax({
                url: mapQuestUrl,
                method: 'GET'
            }).done(function(response) {
                console.log(response);
                userCity = response.results[0].locations[0].adminArea5;
                userState = response.results[0].locations[0].adminArea3;
                console.log(`${userCity}, ${userState}`);
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
        $('.location-container').hide();
        $('.loader').show();
        $('#cusineMsg').text(progressMessages[progressMsgRandNum]);
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
            console.log(response);
            cityID = response.location_suggestions[0].id;
            console.log(cityID);
            $('.foodType-container').show();
            return cityID;
        });
    }
});

//Get User Choice for Cuisine
$(".gif").on("click", function() {
    var progressMsgRandNum = Math.floor(Math.random() * progressMessages.length);
    $('.foodType-container').hide();
    $('.loader').show();
    $('#budgetMsg').text(progressMessages[progressMsgRandNum]);
    $('#budgetProgressMsg').show();
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
        $('.loader').hide();
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

        $('.price-container').fadeIn();
        return cuisineID;
    });
});

$('.budget-gif').on('click', function() {
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
        console.log(userResult);
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
        console.log(userResult);
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
        console.log(userResult);
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


    console.log(`Latitude: ${destLatitude}, Longitude: ${destLongitude} `);

    //add data to results page
    $('#recName').text(recName);
    $('#recAddress').text(recAddress);
    $('#recRating').text(recRating);
    $('#recLink').attr('href', recDetails);

    //push data to firebase
    addItemToFirebase(recName, recAddress, recCity, recCuisine, recBudget, recRating);

    $('.price-container').hide();
    $('#resultProgressMsg').show();
    $('.results-container').show();
    //set static map
    var map = $('#themap');
    var imgSrc = `https://maps.googleapis.com/maps/api/staticmap?size=400x400&maptype=roadmap
                &format=jpg-baseline&markers=color:red%7Clabel:A%7C${userLatitude},${userLongitude}&markers=icon:https://goo.gl/eiJSZQ%7C${destLatitude},${destLongitude}&path=color:blue|weight:4|${userLatitude},${userLongitude}|${destLatitude},${destLongitude}&key=${googleApiKey}`;
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
        $('.location-container').hide();
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
            console.log(response);
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
                console.log(userResult);

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

                console.log(`Latitude: ${destLatitude}, Longitude: ${destLongitude} `);

                //add data to results page
                $('#recName').text(recName);
                $('#recAddress').text(recAddress);
                $('#recRating').text(recRating);
                $('#recLink').attr('href', recDetails);

                //push data to firebase
                addItemToFirebase(recName, recAddress, recCity, recCuisine, recBudget, recRating);
                $('#resultProgressMsg').show();
                $('.results-container').show();
                //set static map
                var map = $('#themap');
                var imgSrc = `https://maps.googleapis.com/maps/api/staticmap?size=400x400&maptype=roadmap
                &format=jpg-baseline&markers=color:red%7Clabel:A%7C${userLatitude},${userLongitude}&markers=icon:https://goo.gl/eiJSZQ%7C${destLatitude},${destLongitude}&path=color:blue|weight:4|${userLatitude},${userLongitude}|${destLatitude},${destLongitude}&key=${googleApiKey}`;
                $('.map-title').show();
                $('#showMap').attr('src', imgSrc);
                map.show();
            });
        });
    }
});

// show firebase data in user history table
database.ref().on('child_added', function(childSnapshot) {
    var sv = childSnapshot.val();
    //append elements to DOM, except for APIKEY
    if (sv.recName !== undefined) {
        $('.active').removeClass('active');
        $('.table-striped').prepend(`<tbody><tr><td class="td">${sv.recName}</td><td id="tdAddress" class="td">${sv.recAddress}</td><td class="td">${sv.recCity}</td><td class="td">${sv.recCuisine}</td><td id="tdBudget" class="td">$${sv.recBudget}</td><td class="td">${sv.recRating}</td></tr></tbody>`);
    }
});


//Get user auth data from DOM
var txtEmail = $('#email');
var txtPassword = $('#pwd');
var loginBtn = $('#loginBtn');
var signUpBtn = $('#signUpBtn');
var logOutBtn = $('#logOutBtn');
var logOutBtn2 = $('#logOutBtn2');
var account = $('#myAccount');
var signUpLink = $('#signUpLink');
var passGroup = $('#passGroup');
var emailGroup = $('#emailGroup');

//store user auth
var auth = firebase.auth();

signUpBtn.on('click', function(e) {
    e.preventDefault();
    //get email and password
    var email = txtEmail.val();
    var pass = txtPassword.val();
    $('#email').val('');
    $('#pwd').val('');
    //validate user email and password
    if (email.length < 9) {
        $('#signUpErr').addClass('animated shake');
        $('#signUpErr').show();

        function removeSignUpFailMessage() {
            message = setTimeout(signUpFail, 3000);
        }
        removeSignUpFailMessage();
        return;
    }
    if (pass.length < 6) {
        $('#signUpErr').addClass('animated shake');
        $('#signUpErr').show();

        function removeSignUpFailMessage() {
            message = setTimeout(signUpFail, 3000);
        }
        removeSignUpFailMessage();
        return;
    }

    //Sign up new users and log them in
    auth.createUserWithEmailAndPassword(email, pass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            $('#signUpErr2').addClass('animated shake');
            $('#signUpErr2').show();

            function removeSignUpFailMessage2() {
                message = setTimeout(signUpFail2, 3000);
            }
            removeSignUpFailMessage2();
        }

    });

});


//sign in existing users
loginBtn.on('click', function(e) {
    e.preventDefault();
    //get email and password
    var email = txtEmail.val();
    var pass = txtPassword.val();
    $('#email').val('');
    $('#pwd').val('');
    //login user
    auth.signInWithEmailAndPassword(email, pass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            $('#signInErr').addClass('animated shake');
            $('#signInErr').show();

            function removeSignInFailMessage() {
                message = setTimeout(signInFail, 3000);
            }
            removeSignInFailMessage();
            return;
        } else {
            $('#signInErr').addClass('animated shake');
            $('#signInErr').show();

            function removeSignInFailMessage() {
                message = setTimeout(signInFail, 3000);
            }
            removeSignInFailMessage();
        }
    });
});

//Log current user out
logOutBtn.on('click', function(e) {
    e.preventDefault();
    //sign up user
    auth.signOut();
});

//Log current user out
logOutBtn2.on('click', function(e) {
    e.preventDefault();
    //sign up user
    auth.signOut();
});

//Firebase User Auth State Changes
auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        console.log(user);
        var email = user.email;
        var uid = user.uid;
        $('.sign-up-form').hide();
        emailGroup.hide();
        passGroup.hide();
        signUpBtn.hide();
        loginBtn.hide();
        $('#guestLogin').hide();
        logOutBtn.show();
        signUpLink.hide();
        account.show();
    } else {
        // User is signed out.
        console.log('user is not logged in');
        $('.modal-header').show();
        emailGroup.show();
        passGroup.show();
        logOutBtn.hide();
        loginBtn.show();
        signUpBtn.show();
        signUpLink.show();
        $('#guestLogin').show();
        $('.sign-up-form').show();
        account.hide();
    }
});

// function to add items to firebase
function addItemToFirebase(name, address, city, cuisine, budget, rating) {
    if (recName && recAddress && recCuisine && recBudget && recRating) {
        database.ref().push({
            recName: name,
            recAddress: address,
            recCity: city,
            recCuisine: cuisine,
            recBudget: budget,
            recRating: rating
        });
        console.log(`Name: ${recName} Address: ${recAddress} Cuisine: ${recCuisine} Budget: ${recBudget} Rating: ${recRating}`);
    } else {
        console.log('data missing in firebase');
    };
}

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

function signUpFail() {
    $('#signUpErr').hide();
}

function signUpFail2() {
    $('#signUpErr2').hide();
}

function signInFail() {
    $('#signInErr').hide();
}

//----- OPEN POP UP
$('[data-popup-open]').on('click', function(e) {
    var targeted_popup_class = jQuery(this).attr('data-popup-open');
    $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
    $('.footer').hide();
    e.preventDefault();
});

//----- CLOSE POP UP
$('[data-popup-close]').on('click', function(e) {
    var targeted_popup_class = jQuery(this).attr('data-popup-close');
    $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
    $('.footer').show();
    e.preventDefault();
});
