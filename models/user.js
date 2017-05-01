'use strict';
module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define('user', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        userName: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.user.belongsToMany(models.event, { through: models.event_user });
            }
        }
    });
    return user;
};
