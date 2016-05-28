var request = require('request');
var fs = require('fs')
var async = require('async');

module.exports = function(TV_API_KEY_ENC, TV_AUTH_HEADER) {

    var tvModule = {};


    /**
     * create - Create a new group.
     *
     * @param  {String}     name     Name of the policy (must be unique).
     * @param  {JSON}       policy   JSON of the Group Policy
     * @param  {function}   callback function(error, policy_id)
     */
    tvModule.create = function(name, policy, callback) {
        var policy_enc = new Buffer(JSON.stringify(policy)).toString('base64')

        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/groups',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                name: name,
                policy: policy_enc
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), null);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), null);
            }
            var policy_id = bodyParsed.group.group_id;
            return callback(null, policy_id)
        });
    };

    /**
     * delete - Delete a group.
     *
     * @param  {String}     id       Group Policy ID.
     * @param  {function}   callback function(error, success)
     */
    tvModule.delete = function(id, callback) {
        // Delete just the one
        var options = {
            method: 'DELETE',
            url: 'https://api.truevault.com/v1/groups/' + id,
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
     * updateGroupPolicy - Update a new group policy
     *
     * @param  {String}     id       ID of the policy.
     * @param  {JSON}       policy   JSON of the Group Policy
     * @param  {function}   callback function(error, policy_id)
     */
    tvModule.updatePolicy = function(id, policy, callback) {
        var policy_enc = new Buffer(JSON.stringify(policy)).toString('base64')

        // Update that ID with the new policy
        var options = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/groups/' + id,
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                policy: policy_enc
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
     * addUsersTo - Add users to the group.
     *
     * @param  {String}     id       ID of the policy.
     * @param  {Array}      users    user_ids of users to be added
     * @param  {function}   callback function(error, success)
     */
    tvModule.addUsers = function(id, users, callback) {
        // PUT stringified user_id's
        var options = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/groups/' + id,
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                user_ids: users.toString()
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
     * getAll - list all groups.
     *
     * @param  {function} callback function(error, schemas)
     */
    tvModule.getAll = function(callback) {
        // Configure options for simple GET
        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/groups?full=true',
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
            return callback(null, bodyParsed.groups);
        });
    };


    return tvModule;

}
