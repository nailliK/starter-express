var mongoose = require('mongoose'),
	Role = require('../models/role'),
	models = [
		{
			name: 'Admin',
			access: 0
		},
		{
			name: 'User',
			access: 10
		}
	];

module.exports = function() {
	var r = 0;

	function check_for_model() {
		Role.findOne({'name': models[r].name}, function(err, model) {
			if (!model) {
				Role.create(models[r], function (err, model) {
					r++;
					if (r < models.length) {
						check_for_model();
					}
				});
			}
		});
	}

	check_for_model();
}