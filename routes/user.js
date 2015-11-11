var express = require('express');
var router = express.Router();

var User = require('../model/Muser');
var crypto = require('crypto');
var setting = require('../set');

var options = {
	domain: 'localhost',
	path: '/',
	httpOnly: true,
	maxAge: 1000 * 60 * 10
}

//$ is the end of line, ^ is the begin of line
router.get('/*/$', function (req, res, next) {
	if (req.session.user) {
		res.render('user', { userName: req.session.user.name });
	} else {
		res.cookie('loginMsg', '用户未登录, 请登录', setting.options);
		res.redirect('/login');
	}
});


router.get('/*/content$', function (req, res, next) {
	if (req.session.user) {
		res.render('user_content', { userName: req.session.user.name });
	} else {
		res.cookie('loginMsg', '用户未登录, 请登录', setting.options);
		res.redirect('/login');
	}
});

router.get('/info', function (req, res, next) {

});

router.get('/explore', function (req, res, next) {

});

router.get('/more', function (req, res, next) {

});

module.exports = router;

