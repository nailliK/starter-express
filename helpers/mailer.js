var nodemailer = require('nodemailer'),
	mandrillTransport = require('nodemailer-mandrill-transport'),
	exphbs  = require('express-handlebars').create(),
	fs = require('fs'),
	path = require('path');

module.exports = function () {
    'use strict';

	this.nodemailer = nodemailer;
	this.transporter = nodemailer.createTransport(mandrillTransport({
	  auth: {
	    apiKey: '1__GmbtTJJWINHokE6h8Rg'
	  }
	}));

	this.sendActivationEmail = function (user, cb) {
		var env_url = this.getCorrectAddress(),
			url = env_url + "/auth/confirm/" + user.salt,
			email_data = {name: user.first_name, url: url},
			_this = this,
			activation_template = exphbs.handlebars.compile(data),
			html = activation_template(email_data);
		
		_this.transporter.sendMail({
		    from: '',
		    to: user.email,
		    subject: 'Activate your account',
		    html: html,
            attachments: []
		}, cb);


	};

    this.sendResetLinkEmail = function (user, cb) {

        var env_url = this.getCorrectAddress(),
			url = env_url + "/auth/confirm/" + user.salt,
			email_data = {name: user.first_name, url: url},
			_this = this;

		// We don't need no stinkin plugin
		fs.readFile(path.join(__dirname, './../views/emails/reset-password.hbs'), 'utf-8', function (err, data) {
			
			var reset_template = exphbs.handlebars.compile(data),
				html = reset_template(email_data);

			_this.transporter.sendMail({
			    from: '',
			    to: user.email,
			    subject: 'Reset Your Password',
			    html: html,
                attachments: []
			}, cb);
		});
    };

	// This method will get the correct address for the environment
	this.getCorrectAddress = function () {
		var address;
		switch (process.env.NODE_ENV) {
        case 'local':
            address = 'http://localhost';
            break;
        case 'test':
            address = 'http://localhost';
            break;
		}
		return address;
	};
};
