'use strict';

let Hapi = require('hapi');
let Inert = require('inert');
let Vision = require('vision');
let HapiSwagger = require('hapi-swagger');
let Joi = require('joi');
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');

let config = require('./config');

let User = require('./models/user.js');

let Routes = require('./Routes/routes.js');

//db connection


mongoose.connect('mongodb://'+config.database.host+'/'+config.database.dbname);

//server creation and configuration
const server = new Hapi.Server();

server.connection(config.runtime_server);

//options for Swagger
const Options={
	info:{
		'title':'Twitter clone API'
	}
};

server.register([
	Inert,
	Vision,
	{
		'register':require('hapi-swagger'),
		'options':Options
	}],
	function(err)
	{
		if(err)
			server.log(['error'],'hapi-swagger load error:'+err);
		else
			server.log(['start'],'hapi-swagger interface loaded');
	}
);

//middleware route that will track all requests
server.ext('onRequest',function(request,reply){
	//console.log('middle');
	//console.log(request.path,request.query);
	
	return reply.continue();
});

server.route(Routes.endpoints);


server.start((err)=>{
	
	if(err)
		throw err;
	
	console.log('Server is started at '+server.info.uri);
		
});
