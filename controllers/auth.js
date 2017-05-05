//global variables
var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();


//routes

router.get('/login', function(req, res) {
    res.render('loginForm');
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    successFlash: 'Good job, you logged in. Welcome',
    failureRedirect: '/auth/login',
    failureFlash: 'try again, bruh.'
}));



router.get('/signup', function(req, res) {
    res.render('signupForm');
});


router.post('/signup', function(req, res, next) {
    db.user.findOrCreate({
        where: { email: req.body.email },
        defaults: {
            'firstName': req.body.firstName,
            'lastName': req.body.lastName,
            'password': req.body.password
        }
    }).spread(function(user, wasCreated) {
        if (wasCreated) {
            //good
            passport.authenticate('local', {
                successRedirect: '/profile',
                successFlash: 'Account created and logged in',
                failureRedirect: '/login',
                failureFlash: 'Unknown error occurred, please re-login'
            })(req, res, next);
        } else {
            //bad
            req.flash('error', 'email already exist. Please login');
            res.redirect('/auth/login');
        }
    }).catch(function(error) {
        req.flash('error', error.message);
        res.redirect('/auth/signup');
    });
});



router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success, you logged out');
    res.redirect('/');
});

// FACEBOOK AUTH SECTION


router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

router.get('/callback/facebook', passport.authenticate('facebook', {
    successRedirect: '/profile',
    successFlash: 'you have loggin with facebook',
    failureRedirect: '/auth/login',
    failureFlash: 'you tried, but facebook said no'
}));




//find all events
router.get('/', function(req, res) {
    db.event.findAll().then(function(events) {
        res.render('createevent', { event: event });
    }).catch(function(err) {
        res.send({ message: 'error', error: err });
    });
});

//posting events
router.post('/events', function(req, res) {
    db.event.create({
        name: req.body.name,
        description: req.body.description,
        address: req.body.address
    }).then(function(event) {
        res.redirect('events');
    }).catch(function(err) {
        res.send({ message: 'error', error: err });
    });
});



//exports
module.exports = router;
