var request = require('request');
var fs = require('fs')
var async = require('async');

module.exports = function(TV_API_KEY_ENC, TV_AUTH_HEADER) {

    var tvModule = {};

    /**
     * search - Search for documents in a vault with a search option.
     *
     * @param  {String}     vault_id      vault to search in
     * @param  {JSON}       search_option search option formatted a la Truevault
     * @param  {function}   callback      function(error, info, documents)
     */
    tvModule.runQuery = function(vault_id, search_option, callback) {
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
            return callback(null, bodyParsed.data.info, docs)
        });
    };

    return tvModule;

}
