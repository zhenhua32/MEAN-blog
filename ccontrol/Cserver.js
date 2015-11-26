var mongoose = require('mongoose');
var Paper = require('../model/Mpaper');


/**use control warp the mongoose's function
 * if error return error.message, the status is 400
 * else return josn
 **/
var getErrorMessage = function (err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Unknown server error';
	}
};

exports.create = function (req, res) {
	var post = new Paper(req.body);
	post.author = req.user;
	post.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(post);
		}
	});
};

exports.list = function (req, res) {

};

exports.postByID = function (req, res, next, id) {
	Paper.findById(id).exec(function (err, paper) {
		if (err) return next(err);
		if(!paper) return next(new Error('Failed to load paper' + id));
		req.paper = paper;
		next();
	});
};

exports.read = function (req, res) {
	res.json(req.paper);
};

exports.update = function(req, res) {
	
}

exports.delete = function(req, res) {
	
}

exports.requiresLogin = function(req, res, next) {
	
	next();
}

exports.hasAuthorization = function(req, res, next) {
	
	next();
}

