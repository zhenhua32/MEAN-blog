'use strict';

var express = require('express');
var router = express.Router();

var options = {
    root: './public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/index');
});

router.get('/index', function (req, res, next) {
    res.sendFile('start.html', options, function (err) {
        if (err) {
            console.log(err);
            res.status(404).send('Bad Request').end();
        }
    });
});

router.get(/^\/(login|main)$/, function (req, res, next) {
    res.redirect('/index');
});


module.exports = router;
