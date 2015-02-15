/**
* Category.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	// Database connection
	connection: 'kbfeedsMongodb',

	// Must follow table Schema
	schema: true,

	// Category table schema
	attributes: {
  		name: { type: 'string' },
  		owner: { model: 'user' },
  		feeds: { collection: 'feed', via: 'category' }
	}
};

