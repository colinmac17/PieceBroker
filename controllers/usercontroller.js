//Controller for the User Model
var express = require('express');

var router = express.Router();

var user = require('../models/user');

router.get('/test', function(req, res){
    res.send('test');
});

//export router
module.exports = router;