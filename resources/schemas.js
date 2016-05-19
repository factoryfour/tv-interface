var request = require('request');
var fs = require('fs')
var async = require('async');

module.exports = function(TV_API_KEY_ENC, TV_AUTH_HEADER) {
    
    var tvModule = {};

    /**
     * createSchema - Create a new schema.
     *
     * @param  {String}     name     Name of the policy (must be unique).
     * @param  {JSON}       policy   JSON of the Schema Policy
     * @param  {function}   callback function(error, schema_id)
     */
    tvModule.create = function(vault, schema, callback) {
        var schema_enc = new Buffer(JSON.stringify(schema)).toString('base64')

        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/schemas',
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
            var schema_id = bodyParsed.schema.id;
            return callback(null, schema_id)
        });
    };

    /**
     * deleteSchema - Delete a schema.
     *
     * @param  {String}     id       Schema Policy ID.
     * @param  {function}   callback function(error, success)
     */
    tvModule.delete = function(vault, id, callback) {
        // Delete just the one
        var options = {
            method: 'DELETE',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/schemas/' + id,
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
     * @param  {String}     id       ID of the policy.
     * @param  {JSON}       policy   JSON of the Schema Policy
     * @param  {function}   callback function(error, success)
     */
    tvModule.update = function(vault, id, schema, callback) {
        var schema_enc = new Buffer(JSON.stringify(schema)).toString('base64')

        // Update that ID with the new policy
        var options = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/schemas/' + id,
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

    /**
     * getAllSchemas - list all schemas.
     *
     * @param  {string}     vault    Vault to look at
     * @param  {function}   callback function(error, schemas)
     */
    tvModule.getAll = function(vault, callback) {
        // Configure options for simple GET
        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/schemas',
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
            return callback(null, bodyParsed.schemas);
        });
    };

    /**
     * tvModule - description
     *
     * @param  {type} vault_id description
     * @param  {type} callback description
     */
    tvModule.deleteAll = function(vault_id, callback) {
        tvModule.getAll(vault_id, function(err, schemas) {
            var tasks = [];
            schemas.forEach(function(schema, index, arr) {
                tasks.push(function(asyncCb) {
                    tvModule.delete(vault_id, schema.id, function(err, success) {
                        if (err) {
                            asyncCb(err, null);
                        } else if (!success) {
                            asyncCb(new Error("Could not delete schema: " + schema.id), null);
                        } else {
                            asyncCb(null, schema.id);
                        }
                    });
                });
            });

            async.parallel(tasks, function(err, results) {
                callback(err, results, results.length == schemas.length);
            });
        });

    }

    return tvModule;

}
