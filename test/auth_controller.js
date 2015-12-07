var assert = require('chai').assert,
	expect = require('Chai').expect,
	request = require('request');
	request = request.defaults({ jar: true });

it('Should fail to log the user in with invalid credentials', function (done) {
	request.post({
		url:'http://localhost/api/auth/login',
		form: {
			email:'invalid@gmail.com',
			password: 'spire4hire'
		}},

	function (err, res, body) {
		var body = JSON.parse(res.body);

		expect(res.statusCode).to.equal(400);
		expect(body.errors.user).to.equal("Email or password is invalid. Please try again or reset your password.");

	    done();
	});
});


it('Should log the user in successfully with valid credentials', function (done) {
	request.post({
		url:'http://localhost/api/auth/login',
		form: {
			email:'user1@gmail.com',
			password: 'spire4hire'
		}},

	function (err, res, body) {
		var body = JSON.parse(res.body);
		expect(res.statusCode).to.equal(200);

	    done();
	});
});


it('Should log the user out', function (done) {
	request.get({
		url:'http://localhost/api/auth/logout'},

	function (err, res, body) {
		var body = JSON.parse(res.body);
		expect(res.statusCode).to.equal(200);

	    done();
	});
});

it('Should fail to reset a user password with an invalid email address', function (done) {
	request.post({
		url : 'http://localhost/api/auth/forgot-password',
		form : {
			email:'test@gmail.com'
		}
	},function (err, res, body) {
		var body = JSON.parse(res.body);

		expect(res.statusCode).to.equal(400);
		expect(body.errors.email).to.equal('This email does not exist.');

	    done();
	});
});

