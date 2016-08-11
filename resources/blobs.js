var request = require('request');
var fs = require('fs')
var async = require('async');

module.exports = function(TV_API_KEY_ENC, TV_AUTH_HEADER) {

    var tvModule = {};


    /**
     * create - Create a blob from a file.
     *
     * @param  {string}     vault    Vault to create in
     * @param  {ReadStream} file     File to create blob for
     * @param  {function}   callback function(error, blob_id)
     */
    tvModule.create = function(vault, file, callback) {
        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/blobs',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                file: file
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), null);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), null)
            }
            return callback(null, bodyParsed.blob_id)
        });
    }


    /**
     * create - Create a blob from a file.
     *
     * @param  {string}     vault    Vault to create in
     * @param  {ReadStream} file     File to create blob for
     * @param  {String}     fileName New name for file
     * @param  {function}   callback function(error, blob_id)
     */
    tvModule.createNameMod = function(vault, fileN, fileName, callback) {
        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/blobs',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                file: {
                    value: fileN,
                    options: {
                        filename: fileName
                    }
                }
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), null);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), null)
            }
            return callback(null, bodyParsed.blob_id)
        });
    }


    /**
     * createEmpty - Create an empty blob to overwrite.
     *
     * @param  {string}     vault    Vault to create in
     * @param  {function}   callback function(error, blob_id)
     */
    tvModule.createEmpty = function(vault, callback) {
        tvModule.create(vault, fs.createReadStream(__dirname + "/default.json"), callback);
    }

    /**
     * create - Create a blob from a file.
     *
     * @param  {string}     vault    Vault to create in
     * @param  {string}     blob_id  blob_id to update
     * @param  {ReadStream} file     File to create blob for
     * @param  {function}   callback function(error, success)
     */
    tvModule.update = function(vault, blob_id, file, callback) {
        var options = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/blobs/' + blob_id,
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                file: file
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), false);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), false)
            }
            return callback(null, true)
        });
    }

    /**
     * create - Create a blob from a file.
     *
     * @param  {string}     vault    Vault to create in
     * @param  {string}     blob_id  blob_id to update
     * @param  {ReadStream} file     File to create blob for
     * @param  {String}     fileName New name for file
     * @param  {function}   callback function(error, success)
     */
    tvModule.updateNameMod = function(vault, blob_id, fileN, fileName, callback) {
        var options = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/blobs/' + blob_id,
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                file: {
                    value: fileN,
                    options: {
                        filename: fileName
                    }
                }
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), false);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), false)
            }
            return callback(null, true)
        });
    }

    /**
     * delete - Delete a blob from a file.
     *
     * @param  {string}     vault    Vault to create in
     * @param  {string}     blob_id  Blob id to delete
     * @param  {function}   callback function(error, success)
     */
    tvModule.delete = function(vault, blob_id, callback) {
        var options = {
            method: 'DELETE',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/blobs/' + blob_id,
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), false);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), false)
            }
            return callback(null, true);
        });
    }

    /**
     * get - Get a blob from a file.
     *
     * @param  {string}     vault    Vault to get from
     * @param  {string}     blob_id  Blob id to get
     * @param  {function}   callback function(error, file)
     */
    tvModule.get = function(vault, blob_id, callback) {
        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/blobs/' + blob_id,
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), false);
            return callback(null, body)
        });
    }

    /**
     * getAll - List all blobs.
     *
     * @param  {string}     vault    Vault to list for
     * @param  {function}   callback function(error, file)
     */
    tvModule.getAll = function(vault, callback) {
        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/blobs',
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), false);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), false)
            }
            return callback(null, bodyParsed.data.items);
        });
    }

    /**
     * getAll - List all blobs.
     *
     * @param  {string}     vault    Vault to list for
     * @param  {function}   callback function(error, file)
     */
    tvModule.deleteAll = function(vault_id, callback) {
        tvModule.getAll(vault_id, function(err, blobs) {
            var tasks = [];
            blobs.forEach(function(blob, index, arr) {
                tasks.push(function(asyncCb) {
                    tvModule.delete(vault_id, blob.id, function(err, success) {
                        if (err) {
                            asyncCb(err, null);
                        } else if (!success) {
                            asyncCb(new Error("Could not delete schema: " + blob.id), null);
                        } else {
                            asyncCb(null, blob.id);
                        }
                    });
                });
            });

            async.parallel(tasks, function(err, results) {
                callback(err, results, results.length == blobs.length);
            });
        });
    }

    /**
     * get - Get a blob from a file.
     *
     * @param  {string}     vault    Vault to get from
     * @param  {string}     blob_id  Blob id to get
     * @param  {function}   callback function(error, file)
     */
    tvModule.getPipable = function(vault, blob_id, callback) {
        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/vaults/' + vault + '/blobs/' + blob_id,
            headers: {
                authorization: TV_AUTH_HEADER
            },
            encoding: null
        };

        var stream = request(options);
        return callback(null, stream)
    }

    return tvModule;

}
