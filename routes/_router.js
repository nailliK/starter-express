// require route files
var express = require('express'),
    router = express.Router(),
	api = require('./api/_controller'),
	site = require('./site/_controller');

// attach route files to paths
router.use('/api', api);
router.use('/', site);

module.exports = router;
