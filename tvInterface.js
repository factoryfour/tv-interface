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

    // Just import from resources
    tvModule.schemas = require('./resources/schemas.js')(TV_API_KEY_ENC, TV_AUTH_HEADER);
    tvModule.blobs = require('./resources/blobs.js')(TV_API_KEY_ENC, TV_AUTH_HEADER);
    tvModule.documents = require('./resources/documents.js')(TV_API_KEY_ENC, TV_AUTH_HEADER);
    tvModule.groups = require('./resources/groups.js')(TV_API_KEY_ENC, TV_AUTH_HEADER);
    tvModule.vaults = require('./resources/vaults.js')(TV_API_KEY_ENC, TV_AUTH_HEADER);
    tvModule.users = require('./resources/users.js')(TV_API_KEY_ENC, TV_AUTH_HEADER);
    tvModule.search = require('./resources/search.js')(TV_API_KEY_ENC, TV_AUTH_HEADER);

    return tvModule;
}
