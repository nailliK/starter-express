var _ = require('lodash');

module.exports = function () {
	'use strict';

	// We'll return an object literal
	return {
		// This method takes a mongoose error and cleans it up
		cleanErrors: function (err, model) {
			// This is our desired api json return object
			var err_object = {errors: {}, status: 400},
				field,
				val,
                vals,
				x,
				x_formatted;
			// Uniqueness validator
			if (err.hasOwnProperty('code')) {
				// God awful workaround
				field = err.message.split('.$')[1];
				val = field.split('{ : ')[1].replace(/\'/g, '').replace(/\"/g, '').replace(/ \}/g, '');

				field = field.split(' dup key')[0];
				field = field.substring(0, field.lastIndexOf('_'));
				err_object.errors[field] = 'A record with \'' + val + '\' in \'' + field + '\' already exists.';
				err_object.status = 409;
			}

            //  This is the passport-local-mongoose error
            if (err.name === "BadRequestError") {
                vals = err.message.split(' ');
                err_object.errors[vals[0]] = "An account with the " + vals[0] + ": " + vals[1] + " already exists";
            }

			// Loop through hideous Mongoose error to get our goods:
			for (x in err.errors) {
				if (err.errors.hasOwnProperty(x)) {
					// for nested errors, we can do the following:
					var fields = x.split('.');
					var last_index = fields.length - 1;
					var field_name = fields[last_index];

					if (err.errors[x].name === 'CastError') {
						err_object.errors[field_name] = 'A valid ' + field_name + ' is required';
					} else {
						err_object.errors[field_name] = err.errors[x].message;
					}
				}
			}

			// one-off errors for bad queries
			if (err.kind === 'ObjectId') {
				return this.resourceNotFound(model);
			}

			return err_object;
		},
		// This method is for badly-formed URLs related to find by ID type requests
		resourceNotFound: function (resource) {
			// This is our desired api json return object
			var err_object = {errors: {}, status: 404};
			err_object.errors[resource] = 'not found';

			return err_object;
		},

		// This method is for badly-formed form body data, 400 status code instead of 400
		resourceNotFoundInBody: function (resource) {
			// This is our desired api json return object
			var err_object = {errors: {}, status: 400};

			// If there are multiple fields missing, we can pass an array now
			if (typeof resource === 'string') {
				err_object.errors[resource] = 'a valid ' + resource + ' is required';
			} else {
				_.forEach(resource, function (field) {
					err_object.errors[field] = 'a valid ' + field + ' is required';
				})
			}

			return err_object;
		},

        invalidPassword: function (rule) {
            // This is our desired api json return object
			var err_object = {errors: {'password': 'invalid password'}, status: 400};

            if (rule === "length") {
                err_object.errors.password = "Password must be a minimum of 8 characters";
            } else if (rule === "match") {
                err_object.errors.password = "Passwords do not match";
            } else if (rule === "missing_fields") {
				err_object.errors.password = "Both password and password_confirm are required";
			} else {
				err_object.errors.password = "Password is invalid";
			}

            return err_object;
        },

        duplicateFieldName: function (fieldName) {
			// This is our desired api json return object
			var err_object = {errors: {}, status: 409};
			err_object.errors[fieldName] = 'Duplicate field name';

			return err_object;
		},

        unauthorizedResource: function (resource) {
            // This is our desired api json return object
			var err_object = {
                errors: {resource: 'Access to this ' + resource + ' is forbidden'},
                status: 401
            };

            return err_object;
        }
	};
};
