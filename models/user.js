var mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose'),
	Schema = mongoose.Schema;

var User_Schema = new Schema({
	admin: {
		type: Boolean,
		default: false
	},
	confirmed: {
		type: Boolean,
		default: false
	},
	phone: {
		type: String,
		required: 'Phone Number is required'
	},
	facebook: {
		type: String
	},
	email : {
		type : String,
		required : "A valid email is required",
		match : [/^([\w\.]+(\+\d+)?@([\w]+\.)+[\w]{2,4})?$/, "A valid email is required"],
		index: { unique: true }
	}
});

// Passport-local-mongoose config
User_Schema.plugin(passportLocalMongoose, {
	usernameField: 'email',
	usernameQuery: 'email',
    userExistsError: '%s'
});

User_Schema.paths.salt.selected = true;

var User = mongoose.model('User', User_Schema);

module.exports = User;
