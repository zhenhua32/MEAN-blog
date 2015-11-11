var setting = require('../set');
var mongoose = require('mongoose');

var mongourl = 'mongodb://' + setting.host + ':' + setting.port + '/' + setting.db;

var options = {
  server: { poolSize: 10, socketOptions: {keepAlive: 1} },
  replset: { socketOptions: {keepAlive: 1} },
};

mongoose.connect(mongourl, options);

//exports is an function, is a connection
module.exports = function() {
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error'));
 
};

