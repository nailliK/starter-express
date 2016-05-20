/////	  MODULE REQUIREMENTS	  /////

var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../../models/user');

require('./../../config/passport')(passport);

	




/////	  ROUTES	 /////

router.get('/',function (req, res, next) { // this should be protected, but I'm going to leave it for testing
	'use strict';

	User.find(function (err, users) {
		if (err) {
			return next(err);
		}
		res.json(users);
	});
});

router.post('/', function(req, res, next) {
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


router.get('/:id', function (req, res, next) {
	'use strict';
	
	if (req.isAuthenticated()) {
		console.log(req.params.id);

		User.findById(req.params.id, function (err, user) {
			if (err) {
				return next(err);
			}
			if (!user) {
				res.status(404).end();
			}

			res.json(user);
		});
	} else {
		req.status(401).end();
	}
});

router.put('/:id', function (req, res, next) {
	"use strict";

	if (req.isAuthenticated()) {
		User.findByIdAndUpdate(req.params.id, {$set: {foo: 'bar'}}, function (err, user) {
			if (err) {
				return next(err);
			}

			if (!user) {
				res.status(404).end();
			}

			res.send(user);
		});
	} else {
		req.status(401).end();
	}
});

router.delete('/:id', function (req, res, next) {
	'use strict';

	if (req.isAuthenticated()) {
		User.findByIdAndRemove(req.params.id, function (err, user) {
			if (err) {
				return next(err);
			}
			if (!user) {
				res.status(404).end();
			}

			res.json(user);
		});
	} else {
		res.status(401).end();
	}
});

module.exports = router;
