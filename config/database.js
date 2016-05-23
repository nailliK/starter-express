var mongoose = require('mongoose');

module.exports = function() {
	var mongo_url = '';
	var options = {
		server: {},
		replset: {}
	};

	options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1 };

	switch (process.env.NODE_ENV) {
		case 'local':
		case 'test':
			mongo_url = 'mongodb://localhost/node-project-starter';
	}

	mongoose.connect(mongo_url, options, function (err) {
		'use strict';
		if (err) {
			console.log('connection error', err);
		} else {
			console.log('connection successful');
		}
	});
}