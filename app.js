'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// connect the mongodb
const connection = require('./model/Mconnection');
// use session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// configure
const set = require('./set');

// route define
const routes = require('./routes/index');
const api = require('./routes/api');
const resources = require('./routes/resources');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.jpg')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 1000 * 60 * 60 * 24 * 70
}));

//save cookie  in  mongodb
app.use(session({
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    secret: set.cookieSecret,
    name: 'mark',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        url: 'mongodb://' + set.host + ':' + set.port + '/' + set.db
    })
}));

//router use, should be last in app.use()
app.use('/', routes);
app.use('/api', api);
app.use('/resources', resources);

// remember the order, so, 404 handler is after other path
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            success: false,
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        success: false,
        message: err.message,
        error: {}
    });
});


module.exports = app;
