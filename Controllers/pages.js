'use strict';

const Joi = require('joi');
let User = require('../models/user.js');

exports.index = {
	tags:['api'],
	description:'Get all users',
	notes:'Get all users',
	handler:function(request,reply){
		User.find({},function(err,res){
			
			if(err)
				throw err;
			
			return reply(res);
		});
	}
};

exports.login = {
	tags:['api'],
	description:'Login Check',
	notes:'Login Check',
	validate:{
		payload:{
			email:Joi.string().required(),
			password:Joi.string().required()
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
						reply({
							statusCode:200,
							message:'Result',
							res:isMatch
						})
					}
				});
			}
		});
					
	}
};

exports.register = {
	tags:['api'],
	description:'Register check',
	notes:'Register Check',
	validate:{
		payload:{
			name:Joi.string().required(),
			username:Joi.string().required(),
			email:Joi.string().required(),
			password:Joi.string().required()
		}
	},
	handler:function(request,reply)
	{
		let user = new User({
			email:request.payload.email,
			password:request.payload.password,
			name:request.payload.name,
			username:request.payload.username
		});
	
		user.save(user,(err)=>{
			
			if(err)
			{
				reply({
					statusCode:503,
					message:'User not inserted'
				});
			}
			else
			{
				reply({
					statusCode:201,
					message:'User is inserted'
				});
			}
		});
	}
};

exports.del = {
	tags:['api'],
	description:'Delete all users',
	notes:'Delete all users',
	handler:function(request,reply)
	{
		User.remove({},(err)=>{
			
			if(err){
				reply({
					statuscode:503,
					message:'Problem in deleting users'
				});
			}
			else
			{
				reply({
					statusCode:204,
					message:'All users deleted'
				})
			}
		});
	}
};

exports.logout = {
	handler:function(request,reply)
	{
		reply("all clear");
	}

};
