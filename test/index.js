'use strict';

var should = require('should');
var app = require('../app');

var Request = require('supertest');
// var request = Request('http://127.0.0.1:3000');
var request = Request(app);

describe('Restful API from: routes/index.js', function() {
    describe('Restful API: /index', function() {
        it('test /index', function(done) {
            request
                .get('/index')
                .expect(200)
                .expect('Content-Type', 'text/html; charset=UTF-8')
                .end(function(err, res) {
                    should.not.exist(err);
                    done();
                })
        });

        it('test / should reidrect /index', function(done) {
            request
                .get('/')
                .expect(302)
                .end(function(err, res) {
                    should.not.exist(err);
                    done();
                })
        });

        it('test /notfound should return 404', function(done) {
            request
                .get('/notfound')
                .expect(404)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect({
                    success: false,
                    message: 'Not Found',
                    error: { status: 404 }
                })
                .end(function(err, res) {
                    should.not.exist(err);
                    done();
                })
        });
    });
    
});

