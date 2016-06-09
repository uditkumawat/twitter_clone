'use strict';

let pages = require('../Controllers/pages');

exports.endpoints = [

	{method:'GET', path:'/',config:pages.index},
	{method:'POST', path:'/login',config:pages.login},
	{method:'POST', path:'/register',config:pages.register},
	{method:'GET',path:'/logout',config:pages.logout},
	{method:'DELETE',path:'/del',config:pages.del}
];
