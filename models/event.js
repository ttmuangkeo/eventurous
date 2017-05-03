var geocoder = require('geocoder');

'use strict';
module.exports = function(sequelize, DataTypes) {
    var event = sequelize.define('event', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        address: DataTypes.STRING,
        lat: DataTypes.FLOAT,
        lng: DataTypes.FLOAT
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                // models.event.belongsToMany(models.user, { through: models.event_user });

            }
        },
        hooks: {
            beforeCreate: function(event, options, cb) {
                geocoder.geocode(event.address, function(err, data) {
                    if (err) return cb(err, null);
                    event.lat = data.results[0].geometry.location.lat;
                    event.lng = data.results[0].geometry.location.lng;
                    cb(null, event);
                });
            }
        }
    });
    return event;
};
