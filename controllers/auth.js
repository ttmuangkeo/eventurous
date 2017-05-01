//global variables
var express = require('express');
var db = require('../models');
var router = express.Router();
// var passport = require('../config/passportConfig');



//routes

router.get('/signup', function(req, res) {
    res.render('signupForm');
});

//router.post('/signup')


router.get('/profile', function(req, res) {
    res.render('profile');
});

//create event
router.get('/createevent', function(req, res) {
    res.render('createevent');
})



module.exports = router;
