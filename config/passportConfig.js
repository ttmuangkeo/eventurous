//global variables
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var db = require('../models');



passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});



passport.deserializeUser(function(id, cb) {
    db.user.findById(id).then(function(user) {
        cb(null, user);
    }).catch(cb);
});



passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, cb) {
    db.user.findOne({
        where: { email: email }
    }).then(function(user) {
        //testing if the user entered valid information
        if (!user || !user.isValidPassword(password)) {
            cb(null, false); //bad user and pw
        } else {
            cb(null, user); //user is allowed
        }
    }).catch(cb);
}));





passport.use(new facebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.BASE_URL + '/auth/callback/facebook',
    profileFields: ['id', 'email', 'displayName'],
    enableProof: true
}, function(accessToken, refreshToken, profile, cb) {
    //see if we can get the email from the facebook profiel
    var email = profile.emails ? profile.emails[0].value : null;


    //see if the user already exist in the db
    db.user.findOne({
        where: { email: email }
    }).then(function(existingUser) {
        //this person has been here before
        if (existingUser && email) {
            existingUser.updateAttributes({
                facebookId: profile.id,
                facebookToken: accessToken
            }).then(function(updatedUser) {
                cb(null, updatedUser);
            }).catch(cb);
        } else {
            //the person is new, we need to make a new entry for them in the users table
            db.user.findOrCreate({
                where: { facebookId: profile.id },
                defaults: {
                    facebookToken: accessToken,
                    email: email,
                    firstName: profile.displayName.split(' ')[0],
                    lastName: profile.displayName.split(' ')[1]
                }
            }).spread(function(user, wasCreated) {
                if (wasCreated) {
                    //they were new, so we created them an accunt
                    cb(null, user);
                } else {
                    //they were not new after all, just update the token
                    user.facebookToken = accessToken;
                    user.save().then(function() {
                        cb(null, user);
                    }).catch(cb);
                }
            }).catch(cb);
        }
    });
}));




module.exports = passport;
