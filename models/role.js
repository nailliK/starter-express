var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Role_Schema = new Schema({
	name: String,
	access: Number
});

var Role = mongoose.model('Role', Role_Schema);

module.exports = Role;
