/////     REQUIRED PACKAGES     /////

var express = require('express'),
	app = express(),
	path = require('path'),
	favicon = require('serve-favicon'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
	mongoose = require('mongoose'),
	morgan = require('morgan'),
	passport = require('passport'),
	server = require('http').Server(app),
	exphbs  = require('express-handlebars'),
	passport = require('passport'),
	session = require('express-session'),
	flash = require('connect-flash'),
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
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'SpireDigital' }));
app.use(express.static(path.join(__dirname, 'public')));





/////	AUTHENTICATION	  /////

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());





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


// start server
server.listen(80);

module.exports = app;
