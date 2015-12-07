/////     REQUIRED PACKAGES     /////
var express = require('express'),
	app = express(),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
	mongoose = require('mongoose'),
	server = require('http').Server(app),
	exphbs  = require('express-handlebars'),
	passport = require('passport'),
	io = require('./helpers/socket')(server);

/////     SERVER AND DATABASE     /////
var mongo_url = '';
var options = {
	server: {},
	replset: {}
};

options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1 };

console.log('the env is: ', process.env.NODE_ENV);

switch (process.env.NODE_ENV) {
case 'local':
case 'test':
    mongo_url = 'mongodb://localhost/node-project-starter';
}

mongoose.connect(mongo_url, options, function (err) {
	'use strict';
	if (err) {
		console.log('connection error', err);
	} else {
		console.log('connection successful');
	}
});

// start server
server.listen(80);

/////     EXPRESS SETTINGS     /////

// set up handlebars
app.engine('.hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs'
}));
app.set('view engine', '.hbs');

// app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(compression({
	level : 9
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

/////	AUTHENTICATION	  /////
// passport and passport local mongoose config
var User = require('./models/user');
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/////     ROUTES     /////
var router = require('./routes/_router');
app.use(router);

/////     ERROR HANDLING     /////
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500).json(err);
});

module.exports = app;
