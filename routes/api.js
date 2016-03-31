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
    });
}

function json400(res) {
    // 400 Bad Request
    res.status(400);
    res.json({
        success: false,
        code: 104,
        message: 'POST数据不完整'
    })
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json({
        register: '/api/register',
        login: '/api/login',
        logout: '/api/logout',
        page: '/api/page',

    });
});

/**
 * register
 * */
router.post('/register', function(req, res, next) {
    let name = req.body.newName;
    let password = req.body.newPassword;
    let email = req.body.newEmail;
    let avatar = req.body.avatar;

    if (!(name && password && email && avatar)) {
        json400(res);
        return;
    }

    var sha256 = crypto.createHash('sha256');

    //once open, query the user's name, it is unique
    User.findOne({ name: name }, function(error, userone) {
        if (error) {
            json500(res, error, 200);
        };
        if (userone) {
            res.json({
                success: false,
                code: 101,
                message: '用户名已存在'
            });
        } else {
            let user = new User({
                name: name,
                password: sha256.update(password).digest('hex'),
                email: email,
                date: new Date(),
                avatar: avatar
            });
            user.save(function(error, user) {
                if (error) {
                    json500(res, error, 200);
                }
                else {
                    //start a  session
                    req.session.user = user;
                    res.json({
                        success: true,
                        code: 0,
                        message: '用户注册成功'
                    });
                }
            });
        }
    });
});

/**
 * login
 *  */
router.post('/login', function(req, res, next) {
    let name = req.body.userName;
    let password = req.body.userPassword;

    if (!(name && password)) {
        json400(res);
        return;
    }

    let sha256 = crypto.createHash('sha256');

    User.findOne({ name: name }, function(error, userone) {
        if (error) {
            json500(res, error, 200);
        }
        if (userone) {
            if (userone.password === sha256.update(password).digest('hex')) {
                //start a  session
                req.session.user = userone;
                res.json({
                    success: true,
                    code: 0,
                    message: '用户登录成功'
                });
            } else {
                res.json({
                    success: false,
                    code: 102,
                    message: '密码错误, 重新登陆'
                });
            }
        } else {
            res.json({
                success: false,
                code: 103,
                message: '用户不存在, 请注册'
            });
        }
    });
});

/* logout */
router.get('/logout', function(req, res, next) {
    if (req.session.user) {
        req.session.destroy(function(error) {
            if (error) json500(res, error, 300);
        });
        res.clearCookie('mark');
        res.json({
            success: true,
            code: 0
        });
    } else {
        json401(res);
    }
});

/* get all pages */
router.get('/page/all', function(req, res, next) {
    Page.find({})
        .populate('author')
        .sort({ createdAt: -1 })
        .exec(function(error, pages) {
            if (error) {
                json500(res, error, 200);
            } else {
                res.json({
                    success: true,
                    code: 0,
                    pages: pages
                })
            }
        });
});
router.get('/page/all/:uid', function(req, res, next) {
    Page.find({ author: req.params.uid })
        .populate('author')
        .sort({ createdAt: -1 })
        .exec(function(error, pages) {
            if (error) {
                json500(res, error, 200);
            } else {
                res.json({
                    success: true,
                    code: 0,
                    pages: pages
                })
            }
        });
});
/* find a page */
/**
 * query
 * skip
 * limit default=10
 */
router.get('/page/find', function(req, res, next) {
    let query = req.query;
    let limit = 10;
    let sortby = '-createdAt';
    if (query.limit) limit = query.limit;
    if (query.sortby) {
        switch (query.sortby) {
            case '0':
                sortby = '-createdAt'
                break;

            case '1':
                sortby = 'createdAt'
                break;

            case '2':
                sortby = '-updateAt'
                break;

            case '3':
                sortby = 'updateAt'
                break;

            default:
                sortby = '-createdAt'
                break;
        }
    }

    // query的属性是string, 需要转换为 number
    if (query && query.skip) {
        Page.find({})
            .populate('author')
            .sort(sortby)
            .skip(parseInt(query.skip))
            .limit(parseInt(limit))
            .exec(function(error, pages) {
                if (error) {
                    json500(res, error, 200);
                } else {
                    res.json({
                        success: true,
                        code: 0,
                        pages: pages
                    })
                }
            });
    } else {
        Page.find({})
            .populate('author')
            .sort({ createdAt: -1 })
            .exec(function(error, pages) {
                if (error) {
                    json500(res, error, 200);
                } else {
                    res.json({
                        success: true,
                        code: 0,
                        pages: pages
                    })
                }
            });
    }
});

/* count page */
router.get('/page/count', function(req, res, next) {
    let query = req.query;
    Page.count({}, function(error, count) {
        if (error) {
            json500(res, error, 200);
        }
        else {
            res.json({
                success: true,
                code: 0,
                count: count
            })
        }
    })
});

/* count user page */
router.get('/page/count/:uid', function(req, res, next) {
    let query = req.query;
    Page.count({ author: req.params.uid }, function(error, count) {
        if (error) {
            json500(res, error, 200);
        }
        else {
            res.json({
                success: true,
                code: 0,
                count: count
            })
        }
    })
});

/* create a new page */
router.post('/page/new', function(req, res, next) {
    let title = req.body.title;
    let body = req.body.content;

    if (!(title && body)) {
        json400(res);
        return;
    }

    if (!req.session.user) {
        json401(res);
        return;
    }

    let page = new Page({
        title: title,
        author: req.session.user._id,
        body: body,
        date: new Date()
    });

    page.save(function(error, page) {
        if (error) {
            json500(res, error, 200);
        } else {
            res.json({
                success: true,
                code: 0,
                message: '已经保存'
            });
        }
    });
});
/* update a page */
router.post('/page/update', function(req, res, next) {
    let title = req.body.title;
    let body = req.body.content;
    let id = req.body.id;

    if (!(title && body && id)) {
        json400(res);
        return;
    }

    if (req.session.user) {
        Page.findOne({ _id: id }, function(error, doc) {
            if (error) {
                json500(res, error, 200);
            } else {
                if (doc) {
                    if (doc.author != req.session.user._id) {
                        //注意,doc.author和req.session.user._id不严格相等
                        //doc.author是objectID,是object
                        //req.session.user._id是string
                        json401(res);
                    } else {
                        doc.update({ $set: { title: title, body: body } },
                            function(error, result) {
                                if (error) {
                                    json500(res, error, 200);
                                } else {
                                    res.json({
                                        success: true,
                                        code: 0,
                                        message: '已更新'
                                    });
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
        })
    } else {
        json401(res);
    }
});
/* delete a page */
router.delete('/page/delete/:id', function(req, res, next) {
    if (req.session.user) {
        Page.findOne({ _id: req.params.id }, function(error, doc) {
            if (error) {
                json500(res, error, 200);
            } else {
                if (doc) {
                    if (doc.author != req.session.user._id) {
                        json401(res);
                    } else {
                        doc.remove(function(error) {
                            if (error) {
                                json500(res, error, 200);
                            } else {
                                res.json({
                                    success: true,
                                    code: 0
                                })
                            }
                        })
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
/* user */
router.get('/session', function(req, res, next) {
    if (req.session.user) {
        res.json({
            success: true,
            code: 0,
            session: req.session
        });
    } else {
        res.json({
            success: false,
            code: 301,
            message: 'session不存在'
        });
    }
});
//好像可以和上面的API合并，难道这也是优化，他们说每个Byte都是不必要的浪费
router.get('/session/islogin', function(req, res, next) {
    if (req.session.user) {
        res.json({
            success: true,
            code: 0
        });
    } else {
        //混乱的语义, 这里 success 用来表明是否已登录
        res.json({
            success: false,
            code: 0
        })
    }
});

module.exports = router;
