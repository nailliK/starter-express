module.exports = function (req, res, next) {
	'use strict';

	// this regex matches '/:id'
	var routeRegex = /^\/[a-z0-9]+$/i;

	if (req.path === '/') {
		return next({status: 405, errors: { "method": req.method + " not allowed. GET and POST is allowed."}});
	} else if (routeRegex.test(req.path)) {
		return next({status: 405, errors: { "method": req.method + " not allowed. GET, PUT, and DELETE is allowed."}});
	}

	return next({status: 404, errors: { "method": req.baseUrl + req.path + " not found."}});
};
