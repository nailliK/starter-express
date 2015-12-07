var express = require('express'),
	mongoose = require('mongoose'),
	router = express.Router(),

    models = './../../models',
    seeds = './../../seeds',

    // require seed files
	userSeeder = require(seeds + '/userSeeder'),

    // require models
    User = require(models + '/user');

function assertCountsAreCorrect(res) {
	'use strict';

	User.find({}, function (err, users) {
		if((users.length != 3)){
			res.status = 500;
			res.json({
				error : "incorrect user count"
			});
			return;
		} else {
			res.status = 200;
			res.json({
				message : "success"
			});
		}
	});
}

//call all seed files
function run(res) {
    'use strict';
    userSeeder(function () {
    	assertCountsAreCorrect(res);
    });
}

router.get('/', function (req, res, next) {
	'use strict';

	mongoose.connection.db.dropDatabase(function(err, result) {
		if (err) {
			res.send(err);
		} else {
			// seed the database
			run(res);
		}
	});
});

module.exports = router;
