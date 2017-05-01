'use strict';
module.exports = function(sequelize, DataTypes) {
  var event_user = sequelize.define('event_user', {
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return event_user;
};