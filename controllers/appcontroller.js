//Controller for the User Model
var express = require('express');

var router = express.Router();

//Use models to add CRUD methods to routes
var db = require('../models');

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