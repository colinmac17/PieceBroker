var apiKey = 'bd44f34a9f419b15bdda245f2c261942';
var cityID;

//Get City ID for User Search
$('#locationBtn').on('click', function(e) {
    e.preventDefault();
    var location = $('#userLocation').val();
    $('#userLocation').val('');
    var queryURL = `https://developers.zomato.com/api/v2.1/locations?query=${location}`;
    $.ajax({
        url: queryURL,
        method: 'GET',
        headers: {
            'user-key': apiKey
        }
    }).done(function(response) {
        console.log(response);
        cityID = response.location_suggestions[0].city_id;
        console.log(cityID);
        $('#location').html(response.location_suggestions[0].city_name);
        return cityID;
    });
    //Search Click function inside location function
    
});

$('#clickMe').on('click', function(e) {
        e.preventDefault();

        var userSearch = $('#userSearch').val();
        $('#userSearch').val('');
        var queryURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=city&cuisines=${userSearch}&count=10`;
        //Ajax call to Zomato API
        $.ajax({
            url: queryURL,
            method: 'GET',
            headers: {
                'user-key': apiKey
            }
        }).done(function(response) {
            console.log(response);
            console.log(cityID);
            $('#restaurantName').html(response.restaurants[1].restaurant.name);
            $('#type').html(response.restaurants[1].restaurant.cuisines);
            $('#costForTwo').html(response.restaurants[1].restaurant.average_cost_for_two);
            $('#userRating').html(response.restaurants[1].restaurant.user_rating.aggregate_rating);
        });
    });