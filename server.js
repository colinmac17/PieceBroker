var express = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;
//create express app
var app = express();

app.use(express.static('./public'));

//Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Set Handlebars as the default templating engine.
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require('./controllers/usercontroller');
app.use('/', routes);

app.listen(PORT, function(){
    console.log(`App is up on PORT ${PORT}`);
});