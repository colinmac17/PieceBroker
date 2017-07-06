// // Grabs user location
// window.onload = function() {
//     var startPos;
//     var geoOptions = {
//         timeout: 10 * 1000
//     }

//     var geoSuccess = function(position) {
//         startPos = position;
//         document.getElementById('startLat').innerHTML = startPos.coords.latitude;
//         document.getElementById('startLon').innerHTML = startPos.coords.longitude;
//     };
//     var geoError = function(error) {
//         console.log('Error occurred. Error code: ' + error.code);
//         // error.code can be:
//         //   0: unknown error
//         //   1: permission denied
//         //   2: position unavailable (error response from location provider)
//         //   3: timed out
//     };

//     navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
// };

// var DirectionsService = {
//     DirectionsService.route() {
//         origin: LatLng | String |,
//         destination: LatLng | String |,
//         travelMode: DRIVING,
//         transitOptions: {
//                arrivalTime: Date,
//                departureTime: Date,
//                modes[]: TransitMode,
//                routingPreference: TransitRoutePreference
//            }
//         drivingOptions: {
//              departureTime: new Date(),
//              trafficModel: 'pessimistic'
//          },
//         unitSystem: UnitSystem,
//         waypoints[]: DirectionsWaypoint,
//         optimizeWaypoints: Boolean,
//         provideRouteAlternatives: false,
//         avoidHighways: Boolean,
//         avoidTolls: Boolean,
//         region: String
//     }
//     unitSystem: google.maps.UnitSystem.IMPERIAL
// }

// // Display map via API
// displayMap = function () {
//     $('#showMap').html('Preparing map!');
//         // grab user zomato returned address
//         // convert user zomato returned address into long lat
//         $.ajax({
//             url: queryURL,
//             method: "GET"
//         }).done(function(response) {
//             $('#showMap').html('');
//             var mapResults = response.data;
//         })
// }

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

// userResult, restaurant name, restaurant address, restaurant cuisine type, restaurant budget, restaurant rating
var userResult, recName, recAddress, recCity, recCuisine, recBudget, recRating, recDetails;

//set global vars for cityID, cuisineID 
var cityID, cuisineID, userBudget, restaurantID;

//set empty arrays for restaurant types
var cheapRestaurants = [];
var medRestaurants = [];
var expensiveRestaurants = [];

//get API Key from Firebase
database.ref().once("value", function(snapshot) {
    var sv = snapshot.val();
    //set value of apiKey
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
        $('#failMsg').show();

        function removeMessage() {
            message = setTimeout(hideFailMessage, 3000);
        }
        removeMessage();
    }
    // Get Zomato Data and store cityID in a variable
    else {
        $('.location-container').hide();
        $('.loader').show();
        $.ajax({
            url: queryURL,
            method: 'GET',
            headers: {
                'user-key': apiKey
            }
        }).done(function(response) {
            $('.loader').hide();
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
    $('.foodType-container').hide();
    $('.loader').show();
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
    recBudget = userResult.average_cost_for_two/2;
    recRating = userResult.user_rating.aggregate_rating;
    recDetails = userResult.url;

    //add data to results page
    $('#recName').text(recName);
    $('#recAddress').text(recAddress);
    $('#recRating').text(recRating);
    $('#recLink').attr('href', recDetails);

    //push data to firebase
    addItemToFirebase(recName, recAddress, recCity, recCuisine, recBudget, recRating);

    $('.price-container').hide();
    $('.results-container').show();
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

    //Set Zomato Endpoint
    var locationURL = `https://developers.zomato.com/api/v2.1/cities?q=${location}`;
    //Error message if user does not input data
    if (location.length < 1) {
        $('#failMsg').addClass('animated shake');
        $('#failMsg').show();

        function removeMessage() {
            message = setTimeout(hideFailMessage, 3000);
        }
        removeMessage();
    }
    //Get Zomato data for random restaurants
    else {

        $('.location-container').hide();
        $('.loader').show();

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
                recBudget = userResult.average_cost_for_two/2;
                recRating = userResult.user_rating.aggregate_rating;
                recDetails = userResult.url;

                //add data to results page
                $('#recName').text(recName);
                $('#recAddress').text(recAddress);
                $('#recRating').text(recRating);
                $('#recLink').attr('href', recDetails);

                //push data to firebase
                addItemToFirebase(recName, recAddress, recCity, recCuisine, recBudget, recRating);
                $('.results-container').show();
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
