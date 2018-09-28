var yahooClientId = "dj00aiZpPWVQY2VjdGhYSnU5aCZzPWNvbnN1bWVyc2VjcmV0Jng9YTg-";

var currentLocation = null; // Contains current location
var selectedLocation = null;
var defaultLocation = new google.maps.LatLng(35.6811716, 139.7648629);
var map;
var geo = new google.maps.Geocoder(); //Geocoder service
var infoWindow = new google.maps.InfoWindow; //InfoWindow service
var autocompleteService = new google.maps.places.AutocompleteService(); // Auto Complete Service
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();

// Create a new session token.
var sessionToken = new google.maps.places.AutocompleteSessionToken();

// Initialize map when the page is opened
function initMap() {
    var mapOptions = {
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: defaultLocation
    };
    //initiate the map
    map = new google.maps.Map($("#map").get(0), mapOptions);

    //Get Current Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            // Navigate to current location
            map.setCenter(currentLocation);
            // Put a marker
            new google.maps.Marker({
                position: currentLocation,
                map: map
            });

            // Get place suggestions
            getLocationsFromYahoo('避難');

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'エラー：現在の位置を取得できません。' :
        'エラー：このブラウザはサポートしません。');
    infoWindow.open(map);
}

function geoResultCallBack(results, status) {
    console.log(results);
    if (status != google.maps.GeocoderStatus.OK) {
        alert(status);
        return;
    }
    var latlng = results[0].geometry.location;
    new google.maps.Marker({
        position: latlng,
        map: map
    });
}

function getLocations(keyword) {
    // Place predictions options
    var getPlacePredictionsOptions = {
        input: keyword,
        sessionToken: sessionToken,
        strictBounds: true
    }
    // Get Place predictions, then pass to displaySuggestions function
    autocompleteService.getPlacePredictions(getPlacePredictionsOptions, displaySuggestions);

}

function getLocationsFromYahoo(keyword) {
    console.log(keyword);
    var url = "https://map.yahooapis.jp/search/local/V1/localSearch";
    var options = {
        appid: yahooClientId,
        query: keyword,
        lat: currentLocation.lat,
        lon: currentLocation.lng,
        sort: 'geo', //Sort by distance from current location
        output: 'json'
    }

    $.ajax({
        url: url,
        dataType: "jsonp",
        data: options,
        success: displayYahooSuggestions
    });
}

function displayYahooSuggestions(results) {
    console.log(results);

    //First clear the location_list
    $('.location_item').remove();

    //Print each item to table
    var count = results.ResultInfo.Count;
    for (var i = 0; i < count; i++ ) {
        var line;
        line = '<tr class="location_item" selected="no" coordinate="' + results.Feature[i].Geometry.Coordinates + '"><td>';
        line += '<b>' + results.Feature[i].Name + '</b>';
        line += '</td></tr><hr>';
        $('#location_list').append(line);
        new google.maps.Marker({
            position: parseLatLng(String(results.Feature[i].Geometry.Coordinates)),
            map: map
        });
    }
}

//Parse lat and lng from coordinate string
function parseLatLng(coordinate) {
    var splitIndex = coordinate.indexOf(',');
    var lng = Number(coordinate.substring(0, splitIndex));
    var lat = Number(coordinate.substring(splitIndex + 1, coordinate.length));
    console.log(lat + ',' + lng);
    return {lat : lat, lng: lng};
    

}

function displaySuggestions(predictions, status) {
    //Display location from search result to location_list

    //Alert status if error occurs
    if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
    }

    //First clear the location_list
    $('.location_item').remove();

    //Print each item to table
    predictions.forEach(function (prediction) {
        var line;
        line = '<tr class="location_item" id="' + prediction.place_id + '"><td>';
        line += prediction.description;
        line += '</td></tr><hr>';
        $('#location_list').append(line);
        geo.geocode({ placeId: prediction.place_id }, geoResultCallBack);
    });

}

function calcRoute() {
    directionsDisplay.setMap(map);
    var start = currentLocation;
    var end = selectedLocation;
    var request = {
      origin: start,
      destination: end,
      travelMode: 'WALKING'
    };
    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(result);
      }
    });
  }

