var request = require('request');
var lodash = require('lodash');

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

    /**
     * createVault - Create a new vault.
     *
     * @param  {string}     name     name of the vault (must be unique)
     * @param  {function}   callback function(error, vault_id)
     */
    tvModule.createVault = function(name, callback) {
        // Configure options with name
        var vaultCreateOptions = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                name: name
            }
        };

        request(vaultCreateOptions, function(error, response, body) {
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
    tvModule.deleteVault = function(id, callback) {
        // Configure options with name
        var vaultCreateOptions = {
            method: 'DELETE',
            url: 'https://api.truevault.com/v1/vaults/' + id,
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(vaultCreateOptions, function(error, response, body) {
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
    tvModule.getAllVaults = function(callback) {
        // Configure options for simple GET
        var vaultCreateOptions = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/vaults',
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(vaultCreateOptions, function(error, response, body) {
            if (error) return callback(Error(error), null);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), null);
            }
            return callback(null, bodyParsed.vaults);
        });
    };

    // Section 2 - User Methods ================================================

    /**
     * getAllUsers - Return list of all users.
     *
     * @param  {function} callback function(error, users)
     */
    tvModule.getAllUsers = function(callback) {
        // Configure options for simple GET
        var vaultCreateOptions = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/users',
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(vaultCreateOptions, function(error, response, body) {
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
        var vaultCreateOptions = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/users/' + id + '/access_key',
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(vaultCreateOptions, function(error, response, body) {
            if (error) return callback(Error(error), null);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), null);
            }
            return callback(null, bodyParsed.user.access_key, bodyParsed.user.secret_key);
        });
    };

    // Section 3 - Group Methods ===============================================

    /**
     * createGroup - Create a new group.
     *
     * @param  {String}     name     Name of the policy (must be unique).
     * @param  {JSON}       policy   JSON of the Group Policy
     * @param  {function}   callback function(error, policy_id)
     */
    tvModule.createGroup = function(name, policy, callback) {
        var policy_enc = new Buffer(JSON.stringify(policy)).toString('base64')

        var groupPolicyCreateOptions = {
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

        request(groupPolicyCreateOptions, function(error, response, body) {
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
     * deleteGroup - Delete a group.
     *
     * @param  {String}     id       Group Policy ID.
     * @param  {function}   callback function(error, success)
     */
    tvModule.deleteGroup = function(id, callback) {
        // Delete just the one
        var groupPolicyCreateOptions = {
            method: 'DELETE',
            url: 'https://api.truevault.com/v1/groups/' + id,
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(groupPolicyCreateOptions, function(error, response, body) {
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
    tvModule.updateGroupPolicy = function(id, policy, callback) {
        var policy_enc = new Buffer(JSON.stringify(policy)).toString('base64')

        // Update that ID with the new policy
        var groupPolicyCreateOptions = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/groups/' + id,
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                policy: policy_enc
            }
        };

        request(groupPolicyCreateOptions, function(error, response, body) {
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
     * addUsersToGroup - Add users to the group.
     *
     * @param  {String}     id       ID of the policy.
     * @param  {Array}      users    user_ids of users to be added
     * @param  {function}   callback function(error, policy_id)
     */
    tvModule.addUsersToGroup = function(id, users, callback) {
        // PUT stringified user_id's
        var groupPolicyCreateOptions = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/groups/' + id,
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                user_ids: users.toString()
            }
        };

        request(groupPolicyCreateOptions, function(error, response, body) {
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
     * getAllGroups - list all groups.
     *
     * @param  {function} callback function(error, vaults)
     */
    tvModule.getAllGroups = function(callback) {
        // Configure options for simple GET
        var vaultCreateOptions = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/groups',
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(vaultCreateOptions, function(error, response, body) {
            if (error) return callback(Error(error), null);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), null);
            }
            return callback(null, bodyParsed.groups);
        });
    };

    // Section 4 - Schema Methods ==============================================


        /**
         * createSchema - Create a new schema.
         *
         * @param  {String}     name     Name of the policy (must be unique).
         * @param  {JSON}       policy   JSON of the Schema Policy
         * @param  {function}   callback function(error, policy_id)
         */
        tvModule.createSchema = function(vault, schema, callback) {
            var schema_enc = new Buffer(JSON.stringify(schema)).toString('base64')

            var schemaPolicyCreateOptions = {
                method: 'POST',
                url: 'https://api.truevault.com/v1/vaults/' + vault + '/schemas',
                headers: {
                    authorization: TV_AUTH_HEADER
                },
                formData: {
                    schema: schema_enc
                }
            };

            request(schemaPolicyCreateOptions, function(error, response, body) {
                if (error) return callback(Error(error), null);
                var bodyParsed = JSON.parse(body);
                if (bodyParsed.error) {
                    return callback(Error(bodyParsed.error.message), null);
                }
                var policy_id = bodyParsed.schema.id;
                return callback(null, policy_id)
            });
        };

        /**
         * deleteSchema - Delete a schema.
         *
         * @param  {String}     id       Schema Policy ID.
         * @param  {function}   callback function(error, success)
         */
        tvModule.deleteSchema = function(vault, id, callback) {
            // Delete just the one
            var schemaPolicyCreateOptions = {
                method: 'DELETE',
                url: 'https://api.truevault.com/v1/vaults/' + vault  + '/schemas/' + id,
                headers: {
                    authorization: TV_AUTH_HEADER
                }
            };

            request(schemaPolicyCreateOptions, function(error, response, body) {
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
         * @param  {function}   callback function(error, policy_id)
         */
        tvModule.updateSchema = function(vault, id, schema, callback) {
            var schema_enc = new Buffer(JSON.stringify(schema)).toString('base64')

            // Update that ID with the new policy
            var schemaPolicyCreateOptions = {
                method: 'PUT',
                url: 'https://api.truevault.com/v1/vaults/' + vault  + '/schemas/' + id,
                headers: {
                    authorization: TV_AUTH_HEADER
                },
                formData: {
                    schema: schema_enc
                }
            };

            request(schemaPolicyCreateOptions, function(error, response, body) {
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
         * @param  {function}   callback function(error, vaults)
         */
        tvModule.getAllSchemas = function(vault, callback) {
            // Configure options for simple GET
            var vaultCreateOptions = {
                method: 'GET',
                url: 'https://api.truevault.com/v1/vaults/' + vault + '/schemas',
                headers: {
                    authorization: TV_AUTH_HEADER
                }
            };

            request(vaultCreateOptions, function(error, response, body) {
                if (error) return callback(Error(error), null);
                var bodyParsed = JSON.parse(body);
                if (bodyParsed.error) {
                    return callback(Error(bodyParsed.error.message), null);
                }
                return callback(null, bodyParsed.schemas);
            });
        };

    // Section 5 - Document Methods ============================================

    // Create Document
    // Update Document
    // Delete Document
    // Get Document

    // Section 6 - Blob Methods ================================================

    // Create Blob
    // Delete Blob
    // Get Blob
    tvModule.createNewEmptyBlob = function(vault_id, callback) {
        return callback(null, false);
    }

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


    // Section 7 - Delete Methods ==============================================


    return tvModule;
}
