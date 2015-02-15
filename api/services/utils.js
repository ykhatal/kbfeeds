/**
* utils.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var validator = require('validator');

module.exports = {
    checkEmail: function(email) {
        return validator.isEmail(email);
    },
    checkPassword: function(password) {
        var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        return re.test(password);
    },
    checkTokenValidity: function(date) {
        return validator.isAfter(date);
    },
    checkSamePasswords: function(password, repeatPassword) {
        return (password === repeatPassword);
    },
    checkGrantType: function(reqGrantType, grantType) {
        return (reqGrantType === grantType);
    },
    checkTokenType: function(reqTokenType, tokenType) {
        return (reqTokenType === tokenType);
    },
    generateToken: function() {
        var crypto = require('crypto');
        var key = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < 8; i++) {
            key += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return crypto.createHash('sha256').update(key).digest('hex');
    },
    addHttpToUrl: function(url) {
        if (url.toString().substring(0, 7) != "http://") {
            url = "http://" + url;
        }
        return url;
    }
};

