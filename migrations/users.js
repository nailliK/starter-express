var mongoose = require('mongoose'),
	User = require('../models/user'),
	Role = require('../models/role'),
	models = [
		{
			email: 'admin@spiredigital.com',
			password: 'spire4hire',
			role: 'Admin'
		}
	];

module.exports = function() {
	var r = 0;

	function check_for_model() {
		User.findOne({'email': models[r].email}, function(err, model) {
			if (!model) {
				Role.findOne({'name' : models[r].role}, function(err, role) {
					var user = new User();
					user.email = models[r].email;
					user.password = user.generateHash(models[r].password);
					user.role = role;
					user.save(function() {
						r++;
						if (r < models.length) {
							check_for_model();
						}
					});
				});
			}
		});
	}
	check_for_model();
}