//Controller for the User Model
var express = require('express');
var passport = require('passport');
var router = express.Router();
var Strategy = require('passport-facebook').Strategy;
var googleStrategy = require('passport-google-oauth').Strategy;
require('dotenv').config();
var bodyParser = require('body-parser');

var app = express();
//Use models to add CRUD methods to routes
var db = require('../models');

passport.use(new Strategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/facebook/return',
    enableProof: true
  },
  function(req, accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    if (req) console.log('hey!');
    return cb('Hey There', profile);
  }));

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

  //Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

  app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions

//Home Page
router.get('/', function(req, res){
    res.render('index');
});
//Team page
router.get('/team', function(req, res){
    res.render('team');
});
//Main Application
router.get('/app', function(req, res){
    res.render('app');
});
//User Profile Page
router.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
    res.render('profile', { user: req.user });
});

router.get('/login',
function(req, res){
  res.render('login');
});

router.get('/login/facebook',
passport.authenticate('facebook'));

//Facebook Authentication routes
router.get('/auth/facebook',
passport.authenticate('facebook'));

router.get('/login/facebook/return', 
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
    res.redirect('/');
});

//export router
module.exports = router;