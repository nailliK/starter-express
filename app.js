/////     REQUIRED PACKAGES     /////

var express = require('express'),
	app = express(),
	path = require('path'),
	favicon = require('serve-favicon'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
	morgan = require('morgan'),
	passport = require('passport'),
	server = require('http').Server(app),
	exphbs  = require('express-handlebars'),
	passport = require('passport'),
	session = require('express-session');





/////     DATABASE     /////

require('./config/database')();
// require('./migrations/seeder')(); // uncomment for seeding





/////     WEBSOCKET     /////

// var io = require('./helpers/socket')(server); // uncomment for websocket





/////     EXPRESS SETTINGS     /////

// enable view engine (handlebars)
app.engine('.hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs'
}));
app.set('view engine', '.hbs');

// enable compression
app.use(compression({
	level : 9
}));

// logging
app.use(morgan('dev'));

// request body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cookies and session
app.use(cookieParser());
app.use(session({
	secret: 'SpireDigital',
	resave: true,
	saveUninitialized: true
}));

// set static (public) directory
app.use(express.static(path.join(__dirname, 'public')));

// favicon
// app.use(favicon(__dirname + '/public/favicon.ico'));





/////	AUTHENTICATION	  /////

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());





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
