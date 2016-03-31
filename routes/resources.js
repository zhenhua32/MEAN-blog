'use strict';

var express = require('express');
var router = express.Router();

var User = require('../model/Muser');
var Page = require('../model/Mpage');
var crypto = require('crypto');

function json500(res, error, code) {
    // 500 Internal Server Error
    res.status(500);
    res.json({
        success: false,
        code: code,
        message: error.message
    });
}
function json401(res) {
    // 401 Unauthorized
    res.status(401);
    res.json({
        success: false,
        code: 100,
        message: '用户未登录'
    })
}

router.get('/page/:id', function (req, res, next) {
    Page.findOne({ _id: req.params.id })
        .exec(function (error, page) {
            if (error) {
                json500(res, error, 200);
            } else {
                res.json({
                    success: true,
                    code: 0,
                    page: page
                })
            }
        });
});

router.post('/page/:id', function (req, res, next) {
    if (req.session.user) {
        Page.findOne({ _id: req.params.id })
            .exec(function (error, page) {
                if (error) {
                    json500(res, error, 200);
                } else {
                    if (page) {
                        if (page.author != req.session.user._id) {
                            json401(res);
                        } else {
                            page.update({ $set: { title: req.body.title, body: req.body.content } },
                                function (error, result) {
                                    if (error) {
                                        json500(res, error, 200);
                                    } else {
                                        res.json({ success: true, code: 0 });
                                    }
                                });
                        }
                    } else {
                        res.json({
                            success: false,
                            code: 401,
                            message: '文章不存在'
                        })
                    }
                }
            });
    } else {
        json401(res);
    }
});

router.delete('/page/:id', function (req, res, next) {
    if (req.session.user) {
        Page.findOne({ _id: req.params.id }, function (error, page) {
            if (error) {
                json500(res, error, 200);
            } else {
                if (page) {
                    if (page.author != req.session.user._id) {
                        json401(res);
                    } else {
                        page.remove(function (error) {
                            if (error) {
                                json500(res, error, 200);
                            } else {
                                res.json({ success: true, code: 0 });
                            }
                        });
                    }
                } else {
                    res.json({
                        success: false,
                        code: 401,
                        message: '文章不存在'
                    })
                }
            }
        });
    } else {
        json401(res);
    }
});

module.exports = router;