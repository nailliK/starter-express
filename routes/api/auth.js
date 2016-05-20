var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('./../../models/user');

router.post('/signup', function(req, res, next) {
	passport.authenticate('local-signup', function(err, user) {
		if (err) {
			return next(err);
		} else if(!user) {
			res.status(409).end();
		} else {
			res.json(user);
		}
	})(req, res, next);
});

router.post('/login', function(req, res, next) {
	passport.authenticate('local-login', function(err, user) {
		if (err) {
			return next(err);
		} else if (!user) {
			res.status(401).end();
		} else {
			res.json(user);
		}
	})(req, res, next);
});

router.get('/logout', function(req, res, next) {
	req.logout();
	res.status(200).end();
});

module.exports = router;