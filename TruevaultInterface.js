var request = require('request')

module.exports = function(config) {

    var TV_API_KEY = config.TV_API_KEY;
    var TV_ACCOUNT_ID = config.TV_ACCOUNT_ID;

    if (!config.TV_API_KEY || !config.TV_ACCOUNT_ID) {
        throw Error('001-TV Interface must be instantiated with an API Key and Account ID.')
    }

    var TV_API_KEY_ENC = new Buffer(config.TV_API_KEY + ':').toString('base64');
    var TV_AUTH_HEADER = 'Basic ' + TV_API_KEY_ENC;


    var tvModule = {};

    // Section 1 - Vault Methods ===============================================

    /**
     * createVault - Create a new vault
     *
     * @param  {string}     name     name of the vault (must be unique)
     * @param  {function}   callback function(error, vault_id)
     */
    tvModule.createVault = function(name,callback) {
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
            return callback(null, bodyParsed.vault.id);
        });
    }

    // Section 2 - User Methods ================================================

        // Access Key
        // Verify

    // Section 3 - Group Methods ===============================================

        // Create group_policy
        // Update group_policy
        // Add User to Group Policy

    // Section 4 - Schema Methods ==============================================

    // Section 5 - Document Methods ============================================

    // Section 6 - Search Methods ==============================================

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
    }




    return tvModule;
}
