//global variables
require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('./config/passportConfig');
var isLoggedin = require('./middleware/isLoggedin');
var db = require('./models');
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var cloudinary = require('cloudinary');

var app = express();

//set and use statments
app.use(require('morgan')('dev'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});

//routes

app.get('/', function(req, res) {
    res.render('home');
});


app.get('/events',
    function(req, res) {
        db.event.findAll().then(function(events) {
            res.render('events', { events: events });
        }).catch(function(error) {
            res.send({ message: 'error', error: error });
        });
    });

app.get('/createevent', function(req, res) {
    db.event.findAll().then(function(events) {
        res.render('createevent', { events: events });
    }).catch(function(error) {
        res.send({ message: 'error', error: error });
    });
});

app.post('/events', isLoggedin, function(req, res) {
    db.event.create({
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        userId: req.user.id
    }).then(function(event) {
        res.redirect('/events');
    });
});

app.get('/profile', function(req, res) {
    db.event.findAll().then(function(events) {
        res.render('profile', { events: events });
    }).catch(function(error) {
        res.send({ message: 'error', error: error })
    });
});

app.post('/profile', isLoggedin, function(req, res) {
    db.event.create({
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        userId: req.user.id
    }).then(function(event) {
        res.redirect('/profile');
    });
});





app.post('/profile', upload.single('myFile'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
        res.send(result);
    });
});

cloudinary.image('sample.jpg');

//controllers
//TO DO: auth controller
app.use('/auth', require('./controllers/auth'));



//listen
app.listen(process.env.PORT || 3000);
