var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// use cookie and session
var session = require('express-session');
var Cookiestore = require('connect-mongo')(session);
// connect the mongodb
var connection = require('./model/Mconnection');

// configure
var setting = require('./set');

// router define
var routes = require('./routes/index');
var login = require('./routes/login');
var user = require('./routes/user');
var logout = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/*app.use is in order, use connect's middleware */
//use favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.jpg')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//save cookie  in  mongodb
app.use(session({
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7},
  secret: setting.cookieSecret,
  name: 'mark-session',
  resave: true,
  saveUninitialized: false,
  store: new Cookiestore({
    db: setting.db,
    host: setting.host,
    port: setting.port
  })
}));

//router use
app.use('/', routes);
app.use('/login', login);
app.use('/user', user);
app.use('/logout', logout);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
