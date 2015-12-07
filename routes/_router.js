// require route files
var express = require('express'),
    router = express.Router(),
	api = require('./api/_controller'),
	auth = require('./auth/_controller'),
	site = require('./site/_controller');

// attach route files to paths
router.use('/api', api);
router.use('/auth', auth);
router.use('/', site);

module.exports = router;
