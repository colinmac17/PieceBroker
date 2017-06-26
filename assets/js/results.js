// // load firebase
// var config = {
//     apiKey: "AIzaSyAFKkASmjO04PGg2KbBEOAlThg1rwd8Pkk",
//     authDomain: "piecebroker-65733.firebaseapp.com",
//     databaseURL: "https://piecebroker-65733.firebaseio.com",
//     projectId: "piecebroker-65733",
//     storageBucket: "piecebroker-65733.appspot.com",
//     messagingSenderId: "189574691729"
// };

// var apiKey = 'bd44f34a9f419b15bdda245f2c261942';

// // initialize app
// firebase.initializeApp(config);

// // reference database
// var database = firebase.database();

// //global variables

// // restaurant name, restaurant address, restaurant cuisine type, restaurant budget, restaurant rating
// var recName, recAddress, recCuisine, recBudget, recRating;



// // need to add method to gather user input


// // snapshot
// database.ref().on('child_added', function(childSnapshot){
// 	var sv = childSnapshot.val();
// 	//append elements to DOM
// 	renderItem(sv.recName, sv.recAddress, sv.recCuisine, sv.recBudget, sv.recRating);
// });

// // add items to firebase
// function addItem (recName,recAddress,recCuisine,recBudget,recRating) {
// 	if (recName && recAddress && recCuisine && recBudget && recRating) {
// 		database.ref().push({
// 			recName: recName,
// 			recAddress: recAddress,
// 			recCuisine: recCuisine,
// 			recBudget: recBudget,
// 			recRating: recRating
// 		});
// 	} else {
// 		console.log('data missing in firebase');
// 	};
// }

// // return items to DOM
// function renderItem (recName,recAddress,recCuisine,recBudget,recRating) {
// 	var row = [recName,recAddress,recCuisine,recBudget,recRating].map(function (val) {
// 		return "<td>" + val + "</td>"
// 	}).join('');
// 	$('#historyTable').append('<tr>'+row+'</tr>');
// }











