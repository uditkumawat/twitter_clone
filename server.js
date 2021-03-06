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

server.route({
	method:'POST',
	path:'/login',
	config:{
		tags:['api'],
		description:'Login Check',
		notes:'Login Check',
		validate:{
			payload:{
				email:Joi.string().required(),
				password:Joi.string().required()
			}
		}
	},
	handler:function(request,reply)
	{
		User.findOne({email:request.payload.email},function(err,user){
			
			if(err)
				throw err;
			if(!user)
			{
				reply({
					statuscode:200,
					message:'User not found'
				});
			}
			else
			{
				user.comparePassword(request.payload.password,function(err,isMatch){
					
					if(err)
						throw err;
					else
					{
						
						let token = jwt.sign(user,"uditkumawat",{
							expiresIn:1440 //24 hours
						});
					
						reply({
							statusCode:200,
							message:'Result',
							res:isMatch,
							token:token
						})
					}
				});
			}
		});
					
	}
});
//middleware route that will track all requests
server.ext('onRequest',function(req,reply){
	//console.log('checking for authetication');
	//console.log(request.path,request.query);
	
	let token = (req.body && req.body.token) || (req.query && req.query.token) || (req.headers['x-access-token']);
	
	if(token)
	{
		jwt.verify(token,"uditkumawat",function(err,decoded){
			if(err){
				reply({
					statusCode:503,
					message:'Failed to autheticate token',
					data:err
				});
			}
			else
			{
					req.decoded = decoded;
					return reply.continue();
			}
			
		});		
	}
	else
	{
		reply({
			statuscode:503,
			message:"no token"
		});
	}
});

server.route(Routes.endpoints);


server.start((err)=>{
	
	if(err)
		throw err;
	
	console.log('Server is started at '+server.info.uri);
		
});


