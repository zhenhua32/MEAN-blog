var express = require('express');
var router = express.Router();

var User = require('../model/Muser');
var Paper = require('../model/Mpaper');
var crypto = require('crypto');
var setting = require('../set');

var options = {
	domain: 'localhost',
	path: '/',
	httpOnly: true,
	maxAge: 1000 * 60 * 10
}

//user login judge
var isLogin = function (req, res, next, callback) {
	if (callback && callback instanceof Function) {
		if (req.session.user) {
			callback();
		} else {
			res.cookie('loginMsg', '用户未登录, 请登录', setting.options);
			res.redirect('/login');
		}
	} else {
		next(new Error('callback miss'));
	}
}



//$ is the end of line, ^ is the begin of line
//match "/username" or "/username/"
router.get(/^\/(\w)+(\/)?$/, function (req, res, next) {
	/*if (req.session.user) {
		res.render('user', { userName: req.session.user.name });
	} else {
		res.cookie('loginMsg', '用户未登录, 请登录', setting.options);
		res.redirect('/login');
	}*/
	isLogin(req, res, next, function () {
		res.render('user', { userName: req.session.user.name });
	});
});

//match "/username/content"
router.get(/^\/(\w)+\/content$/, function (req, res, next) {
	isLogin(req, res, next, function () {
		Paper.find({ 'author': req.session.user.name })
			.sort({ createdAt: -1 })
			.exec(function (error, papers) {
				if (error) next(error);
				else res.render('user_content', { userName: req.session.user.name, Paper: papers });
			});
	});
});

//match "/username/editNew"
router.get(/^\/(\w)+\/editNew$/, function (req, res, next) {
	isLogin(req, res, next, function () {
		res.render('user_edit_new', { userName: req.session.user.name });
	});
});
//match "/username/editNew"
router.post(/^\/(\w)+\/editNew$/, function (req, res, next) {
	isLogin(req, res, next, function () {
		var title = req.body.title;
		var body = req.body.body;

		var paper = new Paper({
			title: title,
			author: req.session.user.name,
			body: body,
			date: new Date()
		});

		paper.save(function (error, paper) {
			if (error) return console.error(error);
			else console.log('new paper');
		});

		res.redirect('/user/' + req.session.user.name + '/content');
	});
});

router.get(/^\/(\w)+\/edit$/, function (req, res, next) {
	isLogin(req, res, next, function () {
		var title = req.query.q;
		Paper.findOne({ title: title }, function (error, paper) {
			if (error) return console.error(error);
			res.render('user_edit', { userName: req.session.user.name, paperTitle: paper.title, paperBody: paper.body });
		});

	});
});

router.post(/^\/(\w)+\/edit$/, function (req, res, next) {
	isLogin(req, res, next, function () {
		var title = req.body.title;
		Paper.update({ title: title }, { body: req.body.body }, function (error, raw) {
			if (error) return console.error(error);
			res.redirect('/user/' + req.session.user.name + '/content');
		});

	});
});

router.get('/info', function (req, res, next) {
	isLogin(req, res, next, function () {

	});
});

router.get('/explore', function (req, res, next) {
	isLogin(req, res, next, function () {

	});
});

router.get('/more', function (req, res, next) {
	isLogin(req, res, next, function () {

	});
});

module.exports = router;

