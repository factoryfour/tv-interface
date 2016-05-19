var request = require('request');
var fs = require('fs')
var async = require('async');

module.exports = function(config) {

    var TV_API_KEY = config.TV_API_KEY;
    var TV_ACCOUNT_ID = config.TV_ACCOUNT_ID;
    if (!config.TV_API_KEY || !config.TV_ACCOUNT_ID) {
        throw Error('001-TV Interface must be instantiated with an API Key and Account ID.');
    }

    var TV_API_KEY_ENC = new Buffer(config.TV_API_KEY + ':').toString('base64');
    var TV_AUTH_HEADER = 'Basic ' + TV_API_KEY_ENC;

    var tvModule = {};

    // Section 1 - Vault Methods ===============================================


    // Section 2 - User Methods ================================================

    /**
     * getAllUsers - Return list of all users.
     *
     * @param  {function} callback function(error, users)
     */
    tvModule.getAllUsers = function(callback) {
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
    tvModule.accessKeys = function(id, callback) {
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

    // Section 3 - Group Methods ===============================================

    // Section 4 - Schema Methods ==============================================

    // Section 5 - Document Methods ============================================

    // Section 6 - Blob Methods ================================================

    // Section 7 - Search Methods ==============================================

    /**
     * search - Search for documents in a vault with a search option.
     *
     * @param  {String}     vault_id      vault to search in
     * @param  {JSON}       search_option search option formatted a la Truevault
     * @param  {function}   callback      function(error, documents)
     */
    tvModule.search = function(vault_id, search_option, callback) {
        // Base 64 Encode Search Option
        var search_option_enc = new Buffer(JSON.stringify(search_option)).toString('base64')

        // Configure search options for particular vault
        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + vault_id + '/search',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                search_option: search_option_enc
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error));

            // Parse and decode all documents
            var bodyParsed = JSON.parse(body);
            var docs = bodyParsed.data.documents;
            for (doc in docs) {
                docs[doc].document = JSON.parse(new Buffer(docs[doc].document, 'base64').toString('ascii'))
            }
            return callback(null, docs)
        });
    };

    tvModule.schemas = require('./resources/schemas.js')(TV_API_KEY_ENC, TV_AUTH_HEADER);
    tvModule.blobs = require('./resources/blobs.js')(TV_API_KEY_ENC, TV_AUTH_HEADER);
    tvModule.documents = require('./resources/documents.js')(TV_API_KEY_ENC, TV_AUTH_HEADER);
    tvModule.groups = require('./resources/groups.js')(TV_API_KEY_ENC, TV_AUTH_HEADER);
    tvModule.vaults = require('./resources/vaults.js')(TV_API_KEY_ENC, TV_AUTH_HEADER);

    return tvModule;
}
