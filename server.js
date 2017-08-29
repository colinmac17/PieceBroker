var express = require('express');
var expressHandlebars = require('express-handlebars');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
require('dotenv').config();

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

  app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions

// Set Handlebars as the default templating engine.
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require('./config/passport')(passport, db.user);
var routes = require('./controllers/appcontroller');
app.use('/', routes);


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
    app.listen(PORT, function(){
        console.log(`App is up on PORT ${PORT}`);
    });
});