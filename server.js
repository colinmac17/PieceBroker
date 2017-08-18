var express = require('express');
var expressHandlebars = require('express-handlebars');

//create express app
var app = express();

var PORT = process.env.PORT || 3000;

app.use(express.static('./public'));

app.listen(PORT, function(){
    console.log(`App is up on PORT ${PORT}`);
});