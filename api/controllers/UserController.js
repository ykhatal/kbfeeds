/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	signup: function (req, res) {
        var bcrypt = require('bcrypt');
        if (utils.checkEmail(req.body.username)) {
      		if (utils.checkPassword(req.body.password)) {
        		if (utils.checkSamePasswords(req.body.password, req.body.repeat_password)) {
        			User.findOneByUsername(req.body.username).exec(function (err, user) {
	      				if (err) {
				      		return res.status(500).json({ error: 'DB error' });
				      	}
	      				if (!user) {
		            		User.create({ username: req.body.username, password: req.body.password }).
		            		exec(function(error, user) {
					        	if(error) {
					            	return res.status(500).json({ error: 'DB error' });
					        	} else {
					            	return res.status(200).json({ success: 'User was successfully added' });
					        	}
					    	});
		          		} else {
		            		return res.status(404).json({ error: 'Username already exist' });
		          		}
	        		});
        		} else {
        			return res.status(403).json({ error: 'Passwords don\'t match' });
        		}
    		} else {
    			return res.status(403).json({ error: 'password is in an invalid format, must contain'
           		+ ' at least one digit/lowercase/uppercase letter and be at least six characters long' });
    		}
		} else {
			return res.status(403).json({ error: 'Username invalid, must be like : email@example.com' });
		}
    },
    login: function (req, res) {
        var bcrypt = require('bcrypt');
        if (utils.checkGrantType(req.body.grant_type, 'password')) {
        	User.findOneByUsername(req.body.username).exec(function (err, user) {
		      	if (err) {
		      		return res.status(500).json({ error: 'DB error' });
		      	} 
		      	if (user) {
		        	bcrypt.compare(req.body.password, user.password, function (err, match) {
			          	if (err) {
			          		return res.status(500).json({ error: 'Server error' });
			          	} 
			          	if (match) {
			            	// password match
			            	var token = User.createTokenObject('Bearer');
			            	user.tokenType = token.tokenType;
			            	user.accessToken = token.accessToken;
			            	user.refreshToken = token.refreshToken;
			            	user.expireIn = token.expireIn;
			            	user.save(function(error) {
						        if(error) {
						            return res.status(500).json({ error: 'DB error' });
						        } else {
						            return res.status(200).json({ success: {
						            	userId: user.id,
					            		username: user.username,
					            		token: token,
			            			} });
						        }
						    });
			          	} else {
			            	res.status(404).json({ error: 'Invalid username or password' });
			          	}
		        	});
		      	} else {
		        	res.status(404).json({ error: 'Invalid username or password' });
		      	}
    		});
        } else {
        	return res.status(403).json({ error: 'grant_type don\'t match' });
        }
  	}
};

