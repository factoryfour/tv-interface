var request = require('request');
var fs = require('fs')
var async = require('async');
var crypto = require('crypto');

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


	/**
	 * generatePersonalDownloadLink - gernate a personal blob download link.
	 *
	 * @param  {string}     user_id  id to create link for
	 * @param  {string}     vault_id vault blob is in
	 * @param  {string}     blob_id  blob to download
	 * @param  {function}   callback function(error, url)
	 */
	tvModule.generatePersonalDownloadLink = function(user_id, vault_id, blob_id, callback) {
		// Configure options for simple GET
		tvModule.getAccessKeyPair(user_id, function(error, access_key, secret_key) {
			if (error) {
				return callback(error, null);
			}
			var req = {
				blob_id: blob_id,
				vault_id: vault_id
			}
			var req_enc = new Buffer(JSON.stringify(req)).toString('base64');
			const hmac = crypto.createHmac('sha256', secret_key);
			var futureDate = new Date(Date.now() + 1000 * 60 * 60).toISOString();
			hmac.update(futureDate);
			var signature = new Buffer(hmac.digest('hex')).toString('base64');
			var url = "https://api.truevault.com/v1/download?access_key=" + access_key + "&expiration=" + futureDate + "&signature=" + signature + "&request=" + req_enc;
			return callback(null, url);
		})
	};

	/**
	 * updateUserAttributes - update a users attribues.
	 *
	 * @param  {string}     user_id  id to create link for
	 * @param  {string}     attr     attributes to use
	 * @param  {function}   callback function(error, url)
	 */
	tvModule.updateUserAttributes = function(user_id, attr, callback) {
		// Configure options for simple GET
		var doc_enc = new Buffer(JSON.stringify(attr)).toString('base64');
		var options = {
			method: 'PUT',
			url: 'https://api.truevault.com/v1/users/' + user_id,
			headers: {
				authorization: TV_AUTH_HEADER
			},
			formData: {
				attributes: doc_enc
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
	 * updateUserAttributes - update a users attribues.
	 *
	 * @param  {string}     user_id  id to create link for
	 * @param  {function}   callback function(error, url)
	 */
	tvModule.get = function(user_id, callback) {
		// Configure options for simple GET
		var options = {
			method: 'GET',
			url: 'https://api.truevault.com/v1/users/' + user_id + '?full=true',
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
			var user = bodyParsed.user;
			var attr_enc = user.attributes;
			if (!user.attributes) {
				return callback(null, {});
			}
			user.attributes = JSON.parse(new Buffer(attr_enc, 'base64').toString('ascii'))
			return callback(null, user)
		});
	};

	return tvModule;

}
