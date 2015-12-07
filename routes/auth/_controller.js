var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('./../../models/user'),
    error_formatter = require('../../helpers/error_formatter')();


router.get('/login', function (req, res, next) {
    'use strict';
    var logout = req.user ? false : true;
    res.render('auth/login', {
	    logout: logout,
	    title: 'Sign In'
	});
});

router.get('/register', function (req, res, next) {
    'use strict';
    var logout = req.user ? false : true;
    res.render('auth/register', {
	    logout: logout,
	    title: 'Register'
	});
});

router.get('/confirm/:salt', function (req, res, next) {
    'use strict';
    // Find the user by the given salt
    User.findOne({salt: req.params.salt}, function (err, user) {
        var clean_errors,
            not_found_err;

		if (err) {
			clean_errors = error_formatter.cleanErrors(err);
			// TODO: REDIRECT
			return next(clean_errors);
		} else if (!user) {
			not_found_err = error_formatter.resourceNotFound('user', "This user couldn't be found");
			// TODO: REDIRECT
			return next(not_found_err);
		}

		res.render('auth/create-password', {
			name: user.first_name,
			salt: user.salt,
			logout: true,
			title: 'Create A Password'
		});
	});
});

router.get('/reset-password/:salt', function (req, res, next) {
    'use strict';
    // Find the user by the given salt
    User.findOne({salt: req.params.salt}, function (err, user) {
        var clean_errors,
            not_found_err;

		if (err) {
			clean_errors = error_formatter.cleanErrors(err);
			// TODO: REDIRECT
			return next(clean_errors);
		} else if (!user) {
			not_found_err = error_formatter.resourceNotFound('user', "This link has expired");
			// TODO: REDIRECT
			return next(not_found_err);
		}

		res.render('auth/reset-password', {
			name: user.first_name,
			code: user.salt,
			logout: true,
			title: 'Reset Password'
		});
	});
});

router.get('/forgot-password', function (req, res, next) {
    'use strict';
    var logout = req.user ? false : true;

    res.render('auth/forgot-password', {
	    logout: logout,
	    title: 'Reset Password'
	});
});

router.get('/reset-password', function (req, res, next) {
    'use strict';
    var logout = req.user ? false : true;

    res.render('auth/reset-password', {
	    logout: logout,
	    title: 'Create New Password'
	});
});

// logout route
router.get('/logout', function (req, res, next) {
    'use strict';
    req.logout();
    res.redirect("/auth/login");
});

module.exports = router;
