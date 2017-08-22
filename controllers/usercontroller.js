//Controller for the User Model
var express = require('express');

var router = express.Router();

var db = require('../models');

var user = require('../models/user');
var results = require('../models/results');

router.get('/test', function(req, res){
    res.send('test');
});

//export router
module.exports = router;