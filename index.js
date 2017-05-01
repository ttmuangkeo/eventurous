//global variables
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
// var passport = require('../config/passportConfig');

var flash = require('connect-flash');

var app = express();


//set and use statements
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
// app.use(passport.initialize());

app.use(flash());


//routes

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/signup', function(req, res) {
    res.render('signupForm');
});


app.get('/profile', function(req, res) {
    res.render('profile');
});


app.get('/createevent', function(req, res) {
    res.render('createevent');
})


//controllers
app.use('/auth', require('./controllers/auth'));




//listen

app.listen(3000);
