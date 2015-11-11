var express = require('express');
var router = express.Router();

var User = require('../model/Muser');
var crypto = require('crypto');
var options = require('../set').options;

var options1 = options;


/* GET home page. */
router.get('/', function (req, res, next) {
  res.cookie('hello', 'WelcomeToTheNewWorld', options.cookieLong);
  res.render('index');
});

/* register */
router.post('/', function (req, res, next) {
  /* use body-parser */
  var name = req.body.Uname;
  var password = req.body.Upsd;
  var email = req.body.Uemail;
    
  var sha256 = crypto.createHash('sha256');
    
  //once open, query the user's name, it is unique
  User.findOne({ name: name }, function (error, userone) {
    if (error) return console.error(error);
    if (userone) {
      res.cookie('loginMsg', '用户已存在, 请登陆', options.cookieShort);
      res.redirect('/login');
    } else {
      var user = new User({
        name: name,
        password: sha256.update(password).digest('hex'),
        email: email,
        date: new Date()
      });
      user.save(function (error, user) {
        if (error) return console.error(error);
        else console.log('new one in');
      });
      req.session.user = user;
      res.cookie('loginMsg', '注册成功, 马上登陆', options.cookieShort);
      res.redirect('/login');
    }
  });

    
});

module.exports = router;
