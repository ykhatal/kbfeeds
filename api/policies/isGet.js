/**
 * isGet
 *
 * @module      :: Policy
 * @description :: check if http method is GET
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  if (req.method == 'GET') {
    return next();
  }
  return res.status(404).json({ error: 'Http method not allowed' });
};
