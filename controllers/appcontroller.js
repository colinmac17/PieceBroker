//Controller for the User Model
var express = require('express');
var passport = require('passport');
var router = express.Router();
var session = require('express-session');
require('dotenv').config();
var bodyParser = require('body-parser');
var app = express();

//Use models to add CRUD methods to routes
var db = require('../models');
//Load in authController to create auth routes
var authController = require('./authcontroller');

//Home & Signup Page
router.get('/', function(req, res){
    res.render('index');
});
//Signup page
router.get('/signup', authController.signup);

//Login Page
router.get('/login', authController.signin);

//Team page
router.get('/team', function(req, res){
    res.render('team');
});
//Main Application
router.get('/app', function(req, res){
    res.render('app');
});
//User Profile Page
router.get('/profile', isLoggedIn, authController.userpage);

router.get('/logout', authController.logout);

router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup'
    }
));

router.post('/login', passport.authenticate('local-signin',{
      successRedirect: '/profile',
      failureRedirect: '/login'
    }
));

//export router
module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}