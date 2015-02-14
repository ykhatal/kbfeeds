/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var EXPIRE_IN = 24 * 60 * 60 * 1000; // 24 time to expire
var SALT_WORK_FACTOR = 10;

module.exports = {
	// Database connection
	connection: 'kbfeedsMongodb',

	// Must follow table Schema
	schema: true,

	// User table schema
	attributes: {
  		username: { type: 'email', required: true, unique: true },
  		password: { type: 'string', required: true, minLength: 6 },
  		connection_ip: { type: 'string', defaultsTo: '' },
  		token_type: { type: 'string', defaultsTo: 'Bearer' },
	    refresh_token: { type: 'string', defaultsTo: '' },
	    access_token: { type: 'string', defaultsTo: '' },
	    expire_in: { type: 'date', defaultsTo: new Date(new Date().getTime() + EXPIRE_IN) }
	},

	beforeCreate: function (attrs, next) {
    	var bcrypt = require('bcrypt');
    	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      		if (err) {
      			return next(err);
      		}
	      	bcrypt.hash(attrs.password, salt, function(err, hash) {
	    	    if (err) {
	    	    	return next(err);
	    	    }
	        	attrs.password = hash;
	        	next();
      		});
    	});
  	},

  	createTokenObject: function(tokenType) {
  		var token = {
  			token_type: tokenType,
  			refresh_token: utils.generateToken(),
  			access_token: utils.generateToken(),
  			expire_in: new Date(new Date().getTime() + EXPIRE_IN),
  		}
  		return token;
  	}
};

