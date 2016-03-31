var set = require('../set');
var mongoose = require('mongoose');

//default: mongodb://127.0.0.1:27017/towrite
var mongourl = 'mongodb://' + set.host + ':' + set.port + '/' + set.db;

var options = {
    server: { poolSize: 10, socketOptions: { keepAlive: 1 } },
    replset: { socketOptions: { keepAlive: 1 } },
};

mongoose.connect(mongourl, options);


//exports is an object, is a new connection
module.exports = function () {
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));

};

