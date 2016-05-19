var request = require('request');
var fs = require('fs')
var async = require('async');

module.exports = function(TV_API_KEY_ENC, TV_AUTH_HEADER) {

    var tvModule = {};


    /**
     * createVault - Create a new vault.
     *
     * @param  {string}     name     name of the vault (must be unique)
     * @param  {function}   callback function(error, vault_id)
     */
    tvModule.create = function(name, callback) {
        // Configure options with name
        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                name: name
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), null);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), null);
            }
            return callback(null, bodyParsed.vault.id);
        });
    };

    /**
     * deleteVault - Delete a new vault.
     *
     * @param  {string}     id       id of the vault
     * @param  {function}   callback function(error, success)
     */
    tvModule.delete = function(id, callback) {
        // Configure options with name
        var options = {
            method: 'DELETE',
            url: 'https://api.truevault.com/v1/vaults/' + id,
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), false);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), null);
            }
            return callback(null, true);
        });
    };

    /**
     * getAllVaults - list all vaults.
     *
     * @param  {function} callback function(error, vaults)
     */
    tvModule.getAll = function(callback) {
        // Configure options for simple GET
        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/vaults',
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
            return callback(null, bodyParsed.vaults);
        });
    };

    return tvModule;

}
