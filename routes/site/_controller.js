var express = require('express'),
	router = express.Router();

router.get('/style-guide', function(req, res, next) {
	'use strict';
	res.render('style-guide', {
		styleguide: true,
		title: "Style Guide",
		layout: false
	});
});


router.get('/', function(req, res, next) {
	'use strict';
	return res.render('home', {
	    title: 'Home'
	});
	
});

module.exports = router;
