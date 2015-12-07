module.exports = function trim_body (req, res, next) {
	'use strict';

	function trim_input(input) {
	    if (typeof(input) === 'string') {
	        input = input.trim();
	    } else if (typeof(input) === 'object') {
	        for (var x in input) {
	            input[x] = trim_input(input[x]);
	        }
	    }
	    return input;
	}

	if (req.method == 'PUT' || req.method === 'POST') {
		req.body = trim_input(req.body);
	}

	next();
};
