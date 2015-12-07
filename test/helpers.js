var assert = require('chai').assert,
	expect = require('Chai').expect,
	request = require('request');
	request = request.defaults({ jar: true }),
	_ = require('lodash');

var helpers = function () {
	'use strict';
	return {
		authedUser : {},
		testUser : {},
		
		authenticateAs : function(email, done){
			var _this = this;
			it('Authenticating as:' + email, function (done) {
				request.post({
					url:'http://localhost/api/auth/login',
					form: {
						email: email,
						password: 'spire4hire'
					}},

				function (err, res, body) {
					expect(res.statusCode).to.equal(200);

					request.get({ url:'http://localhost/api/users' },
					function (err, res, body) {
						var body = JSON.parse(res.body);
						expect(res.statusCode).to.equal(200);
						_this.authedUser =  _.findWhere( body, { email : email });

						done();
					});
				});

			});
		}
	};
};

module.exports = helpers();

