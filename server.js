var express = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var passport = require('passport');
var fBookStrategy = require('passport-facebook').Strategy;
var googleStrategy = require('passport-google-oauth').Strategy;

//create express app
var app = express();

//Define port for Production and Local Testing
var PORT = process.env.PORT || 3000;

// Requiring our models for syncing
var db = require("./models");

app.use(express.static('./public'));

//Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Set Handlebars as the default templating engine.
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require('./controllers/appcontroller');
app.use('/', routes);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
    app.listen(PORT, function(){
        console.log(`App is up on PORT ${PORT}`);
    });
});