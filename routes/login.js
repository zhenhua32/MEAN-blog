var express = require('express');
var router = express.Router();

var User = require('../model/Muser');
var crypto = require('crypto');

/* login */
router.get('/', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/user/'+req.session.user.name);
  } else {
    if (req.cookies.loginMsg) {
      res.render('login', { loginMsg: req.cookies.loginMsg });
    } else {
      res.render('login', { loginMsg: "登陆之后, 尽情享乐" });
    }
  }

});

router.post('/', function (req, res, next) {
  var name = req.body.Uname;
  var password = req.body.Upsd;

  var sha256 = crypto.createHash('sha256');

  User.findOne({ name: name }, function (error, userone) {
    if (error) return console.error(error);
    if (userone) {
      if (userone.password === sha256.update(password).digest('hex')) {
        //start a  session
        req.session.user = userone;
        res.redirect('/user/' + name);
      } else {
        res.render('login', { loginMsg: "密码错误, 重新登陆" });
      }
    } else {
      res.render('login', { loginMsg: "用户不存在, 请注册" });
    }
  });

});

module.exports = router;
