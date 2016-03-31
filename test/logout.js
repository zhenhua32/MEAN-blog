'use strict';

var should = require('should');
var app = require('../app');

var Request = require('supertest');
// var request = Request('http://127.0.0.1:3000');
// var request = Request(app);
// use agent save cookie
var agent = Request.agent(app);

var User = require('../model/Muser');

describe('Retful API form: routes/api.js', function() {
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

    describe('Restful API: /logout', function() {
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

        it('test /api/logout', function(done) {
            agent
                .get('/api/logout')
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(0);
                    done();
                })
        });

        it('again /api/logout should return 401', function(done) {
            agent
                .get('/api/logout')
                .expect(401)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(100);
                    done();
                })
        });

        it('test /api/login should ok', function(done) {
            agent
                .post('/api/login')
                .send({
                    userName: 'testname',
                    userPassword: 'testpassword',
                })
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    (res.body.code).should.be.exactly(0);
                    done();
                })
        });

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
    });





});