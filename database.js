'use strict';

let mongoose = require('mongoose');

let config = require('./config.js');

mongoose.connect('mongodb://'+config.database.host+'/'+config.database.dbname);

let db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error'));

db.once('open',()=>{
	console.log("connection with database successful");
});

exports.mongoose = mongoose;
exports.db = db;
