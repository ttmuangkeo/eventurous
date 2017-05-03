'use strict';
var bcrypt = require('bcrypt');
module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define('user', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    msg: 'Invalid email'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [4, 32],
                    msg: 'Password must be between 4-32 character in length'
                },
                isAlphanumeric: {
                    msg: 'No special character allowed in password'
                }
            }
        },
        facebookId: DataTypes.STRING,
        facebookToken: DataTypes.STRING
    }, {
        hooks: {
            beforeCreate: function(user, options, cb) {
                if (user && user.password) {
                    var hash = bcrypt.hashSync(user.password, 10);
                    user.password = hash; //changes password value to the hash before inserting into the DB
                }
                cb(null, user);
            }
        },
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        },
        instanceMethods: {
            isValidPassword: function(passwordTyped) {
                return bcrypt.compareSync(passwordTyped, this.password);
            },
            toJSON: function() {
                var data = this.get();
                delete data.password;
                return data;
            },
            getFullName: function() {
                return this.firstName + "" + this.lastName;
            }
        }
    });
    return user;
};
