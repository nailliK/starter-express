var User = require('./../models/user');

function seedCustomers(cb) {
    'use strict';
    var user1 = {
		email: "user1@spiremedia.com",
		password: "tofu",
		confirmed: true,
		phone: "7201231233",
		facebook: "facebook.com/1"
	};

    var user2 = {
		email: "user2@gmail.com",
		password: "tofu",
		confirmed: true,
		phone: "7201231233",
		facebook: "facebook.com/2"
	};

    User.register(new User(user1), "spire4hire", function (err, user) {
		User.register(new User(user2), "spire4hire", function (err, user) {
			cb();
		});
    });
}

function seedAdmins(cb) {
    'use strict';

	var admin = {
		email: "user3@gmail.com",
		password: "tofu",
		confirmed: true,
		admin: true,
		phone: "7201231233",
		facebook: "facebook.com"
	};

	User.register(new User(admin), "spire4hire", function (err, user) {
		cb();
	});

}

module.exports = function (nextSeed) {
    'use strict';
    seedAdmins(function () {
        seedCustomers(function () {
            nextSeed();
        });
    });
};
