/**
 * isDelete
 *
 * @module      :: Policy
 * @description :: check if http method is DELETE
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  if (req.method == 'DELETE') {
    return next();
  }
  return res.status(404).json({ error: 'Http method not allowed' });
};