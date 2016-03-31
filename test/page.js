'use strict';

var should = require('should');
var app = require('../app');

var Request = require('supertest');
// var request = Request('http://127.0.0.1:3000');
// var request = Request(app);
// use agent save cookie
var agent = Request.agent(app);

var User = require('../model/Muser');
var Page = require('../model/Mpage');

describe('Restful API from: routes/api.js', function() {
    before(function() {
        User.remove({}, function(err) {
            if (err) console.log(err);
        })
        Page.remove({}, function(err) {
            if (err) console.log(err);
        })
    });

    after(function() {
        User.remove({}, function(err) {
            if (err) console.log(err);
        })
        Page.remove({}, function(err) {
            if (err) console.log(err);
        })
    });
    //save session in outside
    var session = null;
    var pages = null;

    describe('Restful API: /page', function() {
        it('test /api/page/new with no login should return 401', function(done) {
            agent
                .post('/api/page/new')
                .send({
                    title: 'this is title',
                    content: '<p>this is body</p>'
                })
                .expect(401)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(100);
                    done();
                })
        });

        it('first register a user for next step', function(done) {
            agent
                .post('/api/register')
                .send({
                    newName: 'testname',
                    newPassword: 'testpassword',
                    newEmail: 'test@qq.com',
                    avatar: 'data:image/png;base64,iVBORw0KGgo'
                })
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(0);
                    done();
                });
        });

        it('save session for next step', function(done) {
            agent
                .get('/api/session')
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(0);
                    session = res.body.session;
                    done();
                })
        });

        it('test /api/page/new', function(done) {
            agent
                .post('/api/page/new')
                .send({
                    title: 'this is title',
                    content: '<p>this is body</p>'
                })
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(0);
                    done();
                })
        });

        it('post data is not completed should return 400', function(done) {
            agent
                .post('/api/page/new')
                .send({
                    title: 'this is title'
                })
                .expect(400)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(104);
                    done();
                })
        });

        it('test /api/page/all', function(done) {
            agent
                .get('/api/page/all')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(0);
                    (res.body.pages.length).should.be.exactly(1);
                    done();
                })
        });

        it('test /api/page/all/:uid', function(done) {
            agent
                .get('/api/page/all/' + session.user._id)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(0);
                    (res.body.pages.length).should.be.exactly(1);
                    pages = res.body.pages;
                    done();
                })
        });

        it('test /api/page/all/:uid with wrong uid should return 500', function(done) {
            agent
                .get('/api/page/all/wrongid')
                .expect(500)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(200);
                    done();
                })
        });

        it('test /api/page/update', function(done) {
            agent
                .post('/api/page/update')
                .send({
                    title: 'new title',
                    content: '<p>something new</p>',
                    id: pages[0]._id
                })
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(0);
                    done();
                })
        });

        it('post data is not completed should return 400', function(done) {
            agent
                .post('/api/page/update')
                .send({
                    title: 'new title',
                    id: pages[0]._id
                })
                .expect(400)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(104);
                    done();
                })
        });

        it('test /api/page/delete/:id', function(done) {
            agent
                .delete('/api/page/delete/' + pages[0]._id)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(0);
                    done();
                })
        })

        it('clear session', function(done) {
            agent
                .get('/api/logout')
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(0);
                    done();
                })
        });

        it('test /api/page/update with no login should return 401', function(done) {
            agent
                .post('/api/page/update')
                .send({
                    title: 'new title',
                    content: '<p>something new</p>',
                    id: pages[0]._id
                })
                .expect(401)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(100);
                    done();
                })
        });

        it('test /api/page/delete/:id', function(done) {
            agent
                .delete('/api/page/delete/' + pages[0]._id)
                .expect(401)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(100);
                    done();
                })
        })

    });
});
