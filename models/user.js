var bcrypt   = require('bcrypt-nodejs'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var User_Schema = new Schema({
	email: String,
	password: String,
	admin: Boolean
});


User_Schema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User_Schema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', User_Schema);

module.exports = User;
