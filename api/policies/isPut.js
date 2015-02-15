/**
 * isPut
 *
 * @module      :: Policy
 * @description :: check if http method is PUT
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  if (req.method == 'PUT') {
    return next();
  }
  return res.status(404).json({ error: 'Http method not allowed' });
};