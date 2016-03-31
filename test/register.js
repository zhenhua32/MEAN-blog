'use strict';

var should = require('should');
var app = require('../app');

var Request = require('supertest');
// var request = Request('http://127.0.0.1:3000');
var request = Request(app);

var User = require('../model/Muser');

describe('Restful API from: routes/api.js', function() {
    // warn: will not clear session in mongodb, clear it yourself
    // the session number should add 2
    before(function() {
        User.remove({}, function(err) {
            if (err) console.log(err);
        })
    });

    after(function() {
        User.remove({}, function(err) {
            if (err) console.log(err);
        })
    });

    describe('Restful API: /register', function() {
        it('test /api/register', function(done) {
            request
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

        it('again /api/reidrect should return code 101', function(done) {
            request
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
                    //用户已存在
                    (res.body.code).should.be.exactly(101);
                    done();
                });
        });

        it('post data is not completed should return 400', function(done) {
            request
                .post('/api/register')
                .send({
                    newName: '',
                    newPassword: 'testpassword',
                    avatar: 'data:image/png;base64,iVBORw0KGgo'
                })
                .expect(400)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(104);
                    done();
                })
        });

    });
    
    describe('Restful API: /login', function() {
        it('test /api/login', function(done) {
            request
                .post('/api/login')
                .send({
                    userName: 'testname',
                    userPassword: 'testpassword'
                })
                .expect(200)
                .end(function(err, res) {
                    //每个it里必须有个should断言, 不然不会报错
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(0);
                    done();
                })
        });

        it('agin /api/login with false password should return code 102 ', function(done) {
            request
                .post('/api/login')
                .send({
                    userName: 'testname',
                    userPassword: 'test'
                })
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(102);
                    done();
                })
        });

        it('agin /api/login with false name should return code 103 ', function(done) {
            request
                .post('/api/login')
                .send({
                    userName: 'test',
                    userPassword: 'testpassword'
                })
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(103);
                    done();
                })
        });

        it('post data is not completed should return 400', function(done) {
            request
                .post('/api/login')
                .send({
                    userName: 'testname'
                })
                .expect(400)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(104);
                    done();
                })
        });

    });
})
