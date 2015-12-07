/////	  MODULE REQUIREMENTS	  /////

var express = require('express'),
	router = express.Router(),
	error_formatter = require('../../helpers/error_formatter')(),
	bad_request_helper = require('../../helpers/bad_request_helper'),
	passport = require('passport'),
	User = require('../../models/user'),
	Mailer = require('../../helpers/mailer');
/////	  ROUTES	 /////

router.get('/',function (req, res, next) {
	'use strict';
	User.find(function (err, users) {
		if (err) {
			return next(error_formatter.cleanErrors(err));
		}
		res.json(users);
	});
});

router.get('/:id', function (req, res, next) {
	'use strict';
	User.findById(req.params.id, function (err, user) {
		if (err) {
			return next(error_formatter.cleanErrors(err));
		}
		if (!user) {
			return next(error_formatter.resourceNotFound('user'));
		}

		res.json(user);
	});
});

router.put('/:id', function (req, res, next) {
	'use strict';

	//only user and admin can edit account
	if ((req.user._id != req.params._id) && !req.user.admin) {
		return next(error_formatter.unauthorizedResource('user'));
	}

	var changeableAttributes = {};

	//only allow these properties to change
	if(req.body.phone) {
		changeableAttributes.phone = req.body.phone;
	}
	if(req.body.facebook) {
		changeableAttributes.facebook = req.body.facebook;
	}

	User.findByIdAndUpdate(req.params.id, changeableAttributes, {
		//return modified document and run validators
        new: true,
        runValidators: true
    }, function (err, user) {
        if (err) {
            return next(error_formatter.cleanErrors(err));
        }
        if (!user) {
            return next(error_formatter.resourceNotFound('user'));
        }

        User.findById(user._id, function (err, user) {
            if (err) {
                return next(error_formatter.cleanErrors(err));
            }
            if (!user) {
                return next(error_formatter.resourceNotFound('user'));
            }
			user.save(function (err) {
				if (err) {
					return next(err);
				}

				res.json({
					data: user,
					status: 200
				});
			});
        });

    });
});

router.delete('/:id', function (req, res, next) {
	'use strict';
	User.findOneAndRemove({_id: req.params.id}, function (err, user) {
		if (err) {
			return next(error_formatter.cleanErrors(err));
		}
		if (!user) {
			return next(error_formatter.resourceNotFound('user'));
		}

		res.json({
			data: user,
			status: 200
		});
	});
});


/////	  ERRORS	 /////
router.all('*', function (req, res, next) {
	'use strict';
	// this regex matches '/:id'
	var routeRegex = /^\/confirm\/[a-z0-9]+$/i;

	if (routeRegex.test(req.path)) {
		return next({status: 405, errors: { "method": req.method + " not allowed. PUT is allowed."}});
	}

	bad_request_helper(req, res, next);

});

module.exports = router;
