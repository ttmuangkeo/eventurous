var geocoder = require('geocoder');
geocoder.geocode('Seattle, WA', function(err, data) {
    console.log(data.results[0].geometry.location);
});
