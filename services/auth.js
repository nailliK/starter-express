/////     MODULE REQUIREMENTS     /////

var User = require('../models/user'),
	Token = require('../models/token'),
	crypto = require('crypto'),
	algorithm = 'aes-256-cbc';

var Auth = {
	encrypt : function (text, salt) {
		var cipher = crypto.createCipher(algorithm,salt);
		var crypted = cipher.update(text,'utf8','hex')
		crypted += cipher.final('hex');
		return crypted;
	},
	decrypt : function (text, salt){
		var decipher = crypto.createDecipher(algorithm,salt);
		var dec = decipher.update(text,'hex','utf8')
		dec += decipher.final('utf8');
		return dec;
	},
	get_user : function(id, next) {
		User.findById(id, function(err, doc) {
			if (err) return next(err);
			return next(doc);
		});
	},
	get_token : function(user, next) {
		Token.findOne({user:user}, function(err, doc) {
			if (err) return next(err);
			return next(doc);
		}).populate('user');
	},
	get_token_by_user: function(id, next) {
		var _this = this;

		this.get_user(id, function(user) {
			if (typeof user.salt !== 'undefined' && typeof user.salt !== 'null') {
				_this.get_token(user, function(token) {
					return next(token);
				});
			}
		});
	},
	get_salted_auth_string: function(authorization, next) {
		var _this = this;

		this.get_token_by_user(authorization.id, function(token) {
			if (typeof token.client_id !== 'undefined' && typeof token.client_secret !== 'undefined') {
				var auth_token = JSON.stringify({ "client_id" : token.client_id, "client_secret" : token.client_secret });

				var auth_object = {
					"id" : token.user.id,
					"credentials" : _this.encrypt(auth_token, token.user.salt)
				};

				return next(auth_object);
			}
		});
	},
	is_authorized : function(authorization, next) {
		var _this = this;
		var is_auth = false;
		if (typeof authorization.id !== "undefined") {
			this.get_token_by_user(authorization.id, function(token) {
				var creds = JSON.parse(_this.decrypt(authorization.credentials, token.user.salt));
				return next(creds.client_id == token.client_id && creds.client_secret == token.client_secret && authorization.id == token.user._id);
			})
		} else {
			is_auth = false;
		}
		return is_auth;
	},
	log_in : function(req, res, next) {
		var _this = this;
		User.findOne({ username : req.body.username }, function (err, doc) {
			if (doc !== null) {
				if (_this.decrypt(doc.password, doc.salt) == req.body.password) {
					var tomorrow = new Date();
					tomorrow.setDate(tomorrow.getDate() + 1);
					res.clearCookie(doc._id, { path: '/' });
					res.cookie(doc._id, 'true', { expires: tomorrow });
					return next({status : true, id : doc.id});

				} else {
					return next({status : false});
				}
			} else {
				return next({status : false});
			}
		});
	},
	is_logged_in : function(req, res, id, next) {
		if (typeof req.cookies[id] !== 'undefined' && req.cookies[id] == 'true') {
			return next(true);
		} else {
			return next(false);
		}
	}
};

module.exports = Auth;
