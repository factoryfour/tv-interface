var request = require('request');
var fs = require('fs')
var async = require('async');

module.exports = function(TV_API_KEY_ENC, TV_AUTH_HEADER) {

    var tvModule = {};


    /**
     * create - Create a new document.
     *
     * @param  {String}     vault    vault_id to add document to
     * @param  {String}     schema   schema_id of the document
     * @param  {JSON}       document JSON representation of Document
     * @param  {function}   callback function(error, document_id)
     */
    tvModule.create = function(vault, schema, document, callback) {
        // Encode the document and POST for a particular schema
        var doc_enc = new Buffer(JSON.stringify(document)).toString('base64');
        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/documents',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                document: doc_enc,
                schema_id: schema || ""
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), null);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), null);
            }
            var doc_id = bodyParsed.document.id;
            return callback(null, doc_id)
        });
    };

    /**
     * createEmpty - Create a new empty document.
     *
     * @param  {String}     vault    vault to add document to
     * @param  {String}     schema   schema_id of the document
     * @param  {function}   callback function(error, document_id)
     */
    tvModule.createEmpty = function(vault, schema, callback) {
        // Just call the previous method with an empty JSON
        tvModule.create(vault, schema, {}, callback);
    };

    /**
     * update - Update an existing document.
     *
     * @param  {String}     vault       vault_id to add document to
     * @param  {String}     document_id document_id of the document
     * @param  {JSON}       document    JSON representation of Document
     * @param  {function}   callback    function(error, success)
     */
    tvModule.update = function(vault, document_id, document, callback) {
        // Encode the document and POST for a particular schema
        var doc_enc = new Buffer(JSON.stringify(document)).toString('base64');
        var options = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/documents/' + document_id,
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                document: doc_enc
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
     * delete - Delete a document.
     *
     * @param  {String}     vault       vault_id to add document to
     * @param  {String}     document_id document_id of the document
     * @param  {function}   callback    function(error, success)
     */
    tvModule.delete = function(vault, document_id, callback) {
        // Encode the document and POST for a particular schema
        var options = {
            method: 'DELETE',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/documents/' + document_id,
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
     * get - Get a single document.
     *
     * @param  {String}     vault       vault_id to add document to
     * @param  {String}     document_id document_id of the document
     * @param  {function}   callback    function(error, success)
     */
    tvModule.get = function(vault, document_id, callback) {
        // Encode the document and POST for a particular schema
        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/documents/' + document_id,
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), false);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), false);
            }
            var result = JSON.parse(new Buffer(body, 'base64').toString('ascii'));
            return callback(null, result)
        });
    };

    /**
     * getAll - Return all documents.
     *
     * @param  {String}     vault       vault_id to add document to
     * @param  {String}     document_id document_id of the document
     * @param  {function}   callback    function(error, success)
     */
    tvModule.getAll = function(vault, callback) {
        // Encode the document and POST for a particular schema
        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/documents',
            qs: {
                full: 'true'
            },
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
            return callback(null, bodyParsed.data.items)
        });
    };


    /**
     * tvModule - description
     *
     * @param  {type} vault_id description
     * @param  {type} callback description
     */
    tvModule.deleteAll = function(vault_id, callback) {
        tvModule.getAll(vault_id, function(err, documents) {
            var tasks = [];
            documents.forEach(function(document, index, arr) {
                tasks.push(function(asyncCb) {
                    tvModule.delete(vault_id, document.id, function(err, success) {
                        if (err) {
                            asyncCb(err, null);
                        } else if (!success) {
                            asyncCb(new Error("Could not delete schema: " + document.id), null);
                        } else {
                            asyncCb(null, document.id);
                        }
                    });
                });
            });

            async.parallel(tasks, function(err, results) {
                callback(err, results, results.length == documents.length);
            });
        });

    }

    return tvModule;

}
