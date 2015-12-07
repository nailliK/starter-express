/////     MODULE REQUIREMENTS     /////

var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../../models/user'),
	error_formatter = require('../../helpers/error_formatter')(),
	Mailer = require('../../helpers/mailer');

// login route
router.post('/login', function (req, res, next) {
	'use strict';

	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next({status: 500, errors: err});
		}
		if (!user) {
			return next({status: 400, errors: {"user": "Email or password is invalid. Please try again or reset your password."}});
		}

		if (!user.confirmed) {
			var msg = "You will need to activate your account in order to sign in.  Please check " + user.email + " for the activation email that was sent.";
			return next({status: 401, errors: {"user": msg}});
		}

		req.login(user, function (err) {
			if (err) {
				return next(err);
			}
			res.json({'status': 200, 'user': user});
		});

	})(req, res, next);
});

router.post('/register', function (req, res, next) {
	'use strict';

    req.body.email = req.body.email ? req.body.email.toLowerCase() : 'email';

    //required for salt gen?
    req.body.password = req.body.email + Date.now();

    User.register( new User(req.body), req.body.password, function (err, user) {
        if (err) {
            return next(error_formatter.cleanErrors(err));
        }
        // email confirmation
        var mailer = new Mailer();
        mailer.sendActivationEmail(user, function (err, info) {
            if (err) {
                return next(err);
            }
            // auth the new user
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                res.status(201);
                res.json({
					data: user,
					status: 201
				});
            });
        });
    });
});

//put new password
router.put('/confirm/:salt', function (req, res, next) {
	'use strict';

	User.findOne({salt: req.params.salt}, function (err, user) {
		if (err || !user) {
			return next(error_formatter.resourceNotFound('user'));
		}

		if (!req.body.password || !req.body.password_confirm) {
			return next(error_formatter.invalidPassword('missing_fields'));
		}
		if (req.body.password.length < 8) {
			return next(error_formatter.invalidPassword('length'));
		}
		if (req.body.password !== req.body.password_confirm) {
			return next(error_formatter.invalidPassword('match'));
		}

		// passport-local-mongoose helper method to set user PW
		user.setPassword(req.body.password, function (err, user_doc, pwErr) {
			// These probably won't be called ever
			if (err || pwErr) {
				return next(err);
			}
			// set confirmed and auth
			user_doc.confirmed = true;
			user_doc.save(function (err) {
				if (err) {
					return next(error_formatter.cleanErrors(err));
				}
                req.login(user, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200);
                    res.json({
						data: user,
						status: 200
					});
				});
			});

		});
	});
});

//post email address, get link to reset
router.post('/forgot-password', function (req, res, next) {
	'use strict';
	var  email = req.body.email ? req.body.email.toLowerCase() : null;

	User.findOne({email: email}, function (err, user) {

		if (err || !user) {
			return next({status: 400, errors: {'email': 'This email does not exist.'}});
		}
		var mailer = new Mailer();

		mailer.sendResetLinkEmail(user, function (err, info) {
			if (err) {

				return next(err);
			}
			res.status(201);
			res.json({message: "An email was sent with a link to reset your password."});
		});
	});
});

// logout route
router.get('/logout', function (req, res, next) {
	'use strict';
	req.logout();
	res.status(200);
	res.json({url: "/", status: 200});
});


/////	  ERRORS	 /////
router.all('*', function (req, res, next) {
	'use strict';

	switch(req.path) {
		case "/logout":
			return next({status: 405, errors: { "method": req.method + " not allowed. GET is allowed."}});
			break;
		case "/forgot-password":
			return next({status: 405, errors: { "method": req.method + " not allowed. POST is allowed."}});
			break;
		case "/login":
			return next({status: 405, errors: { "method": req.method + " not allowed. POST is allowed."}});
			break;
		default:
			return next({status: 404, errors: { "method": req.baseUrl + req.path + " not found."}});
	}
});

module.exports = router;
