var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var db = mongoose.connect('mongodb://127.0.0.1:27017/test');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use('/', routes);

app.listen(3000);