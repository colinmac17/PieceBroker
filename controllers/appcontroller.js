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
router.get('/', function(req, res) {
    res.render('index');
});

//Signup page
router.get('/signup', authController.signup);

//Login Page
router.get('/login', authController.signin);

//Team page
router.get('/team', function(req, res) {
    res.render('team');
});
//Main Application
router.get('/app', isLoggedIn, function(req, res) {
    res.render('app');
});
// Results page
router.get('/results', function(req, res) {
    res.render("results");
});

router.post('/app', function(req, res){
    // add userId to passing object
    req.body.userId = req.user.id;
    //Creat row for user result
    db.result.create(req.body).then(function(result){
        res.send(req.body);
    });
});

router.get('/profile', isLoggedIn, function(req, res) {
    var hbsObj = {};
    db.user.findOne({
        where: {
            id: req.user.id
        }
    }).then(function(data) {
        hbsObj.user = data;
    });
    db.result.findAll({
        where: {
            userId: req.user.id
        }
    }).then(function(resultData){
        hbsObj.result = resultData;
        res.render('profile', hbsObj);
    });
});

router.get('/logout', authController.logout);

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup'
}));

router.post('/login', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));

//export router
module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}