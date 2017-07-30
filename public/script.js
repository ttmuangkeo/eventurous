/* globals google, markers */
var initMap = function() {

    var map = new google.maps.Map(document.getElementById('map-container'), {
        center: { lat: 47.6, lng: -122.344 },
        zoom: 10,
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
        });

    // if brower support available, ask user for location data and set the map view
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var initialLocation = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
                );
            map.setCenter(initialLocation);
        });
    }

    // for each marker passed through, add it to the map with a popup
    markers.forEach(function(marker) {
        console.log(marker);
        var position = new google.maps.LatLng(marker.lat, marker.lng);
        var googleMarker = new google.maps.Marker({
            position: position,
            title: marker.name,
            map: map
        });
        // Bind a popup to the marker
        googleMarker.addListener('mouseover', function() {
            var infoWindow = new google.maps.InfoWindow({
                content: '<h3>' + marker.name + '</h3>'
            });
            infoWindow.open(map, googleMarker);
            googleMarker.addListener('mouseout', function() {
                infoWindow.close();
            });
        });
    });

}

$('.edit-form').submit(function(e) {
    e.preventDefault();
    var url = $(this).attr('action');
    var data = $(this).serialize();

    $.ajax({
        url: url,
        method: 'PUT',
        data: data
    }).done(function() {
        window.location.href = '/profile';
    });
});

$('.delete-btn').click(function(e) {
    e.preventDefault();
    var url = $(this).attr('href');

    $.ajax({
        url: url,
        method: 'DELETE'
    }).done(function() {
        window.location.href = '/profile';
    });
});
