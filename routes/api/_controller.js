var express = require('express'),
	router = express.Router(),

    auth = require('./auth'),
	users = require('./users');

router.use('/auth', auth);
router.use('/users', users);

module.exports = router;
