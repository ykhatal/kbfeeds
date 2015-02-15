/**
 * OAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated query
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
	var authorization = req.headers.authorization;
    if (!authorization) {
    	return res.status(404).json({ error: 'Missing authorization header' });
    }
    authorization = authorization.toString().split(' ');
	if (utils.checkTokenType(authorization[0], 'Bearer')) {
		User.findOneByAccessToken(authorization[1]).populate('feeds').populate('categories').exec(function (err, user) {
			if (err) {
				return res.status(500).json({ error: 'DB error' });
			}
			if (user) {
				if (!utils.checkTokenValidity(user.expireIn)) {
					return res.status(403).json({ error: 'Access token has expired, use refresh token to update it' });
				}
				req.user = user;
				return next();
			} else {
  				return res.status(404).json({ error: 'Wrong token type or access token' });
			}
		});
  	} else {
  		return res.status(404).json({ error: 'Wrong token type or access token' });
  	}
};
