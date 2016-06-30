var request = require('request');
var fs = require('fs')
var async = require('async');

module.exports = function(TV_API_KEY_ENC, TV_AUTH_HEADER, TV_ACCOUNT_ID) {

    var tvModule = {};

    /**
     * create - Create a new user schema.
     *
     * @param  {String}     name     Name of the policy (must be unique).
     * @param  {JSON}       policy   JSON of the Schema Policy
     * @param  {function}   callback function(error, success)
     */
    tvModule.create = function(schema, callback) {
        var schema_enc = new Buffer(JSON.stringify(schema)).toString('base64')

        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/accounts/' + TV_ACCOUNT_ID + '/user_schema',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                schema: schema_enc
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), null);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), null);
            }
            return callback(null, true)
        });
    };


    /**
     * get - Get the user schema.
     *
     * @param  {function}   callback function(error, success)
     */
    tvModule.get = function(callback) {
        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/accounts/' + TV_ACCOUNT_ID + '/user_schema',
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
            return callback(null, bodyParsed.user_schema)
        });
    };

    /**
     * deleteSchema - Delete a schema.
     *
     * @param  {String}     id       Schema Policy ID.
     * @param  {function}   callback function(error, success)
     */
    tvModule.delete = function(callback) {
        // Delete just the one
        var options = {
            method: 'DELETE',
            url: 'https://api.truevault.com/v1/accounts/' + TV_ACCOUNT_ID + '/user_schema',
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), false);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), false);
            }
            return callback(null, true)
        });
    };

    /**
     * updateSchemaPolicy - Update a new schema policy
     *
     * @param  {JSON}       policy   JSON of the Schema Policy
     * @param  {function}   callback function(error, success)
     */
    tvModule.update = function(schema, callback) {
        var schema_enc = new Buffer(JSON.stringify(schema)).toString('base64')

        // Update that ID with the new policy
        var options = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/accounts/' + TV_ACCOUNT_ID + '/user_schema',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                schema: schema_enc
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), false);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), false);
            }
            return callback(null, true)
        });
    };

    return tvModule;

}
