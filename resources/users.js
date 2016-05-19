var request = require('request');
var fs = require('fs')
var async = require('async');

module.exports = function(TV_API_KEY_ENC, TV_AUTH_HEADER) {

    var tvModule = {};

    /**
     * getAllUsers - Return list of all users.
     *
     * @param  {function} callback function(error, users)
     */
    tvModule.getAll = function(callback) {
        // Configure options for simple GET
        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/users',
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), null);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), null);
            }
            return callback(null, bodyParsed.users);
        });
    };

    /**
     * accessKeys - Get a set of Access and Secret Keys.
     *
     * @param  {string}     id       UserID to generate keys for
     * @param  {function}   callback function(error, access_key, secret_key)
     */
    tvModule.getAccessKeyPair = function(id, callback) {
        // Configure options for simple GET
        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/users/' + id + '/access_key',
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), null);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), null);
            }
            return callback(null, bodyParsed.user.access_key, bodyParsed.user.secret_key);
        });
    };

    return tvModule;

}
