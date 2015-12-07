var express = require('express'),
	router = express.Router(),
    seeder = require('./seeder'),
	trim_body = require('./../../helpers/trim_body'),
	passport = require('passport'),

    auth = require('./auth'),
	users = require('./users');


router.put('*', trim_body);
router.post('*', trim_body);

router.use('/auth', auth);
router.use('/users', passport.authenticate('local', { failureRedirect: '/login' }), users);
router.use('/seeder', seeder);

module.exports = router;
