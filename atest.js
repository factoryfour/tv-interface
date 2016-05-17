var config = require('./config.js')

var TV_ACCOUNT_ID = config.TV_ACCOUNT_ID;
var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_ORG_SCHEMA_ID = config.TV_ORG_SCHEMA_ID
var TV_API_KEY = config.TV_API_KEY;

var TV_API_KEY_ENC = new Buffer(TV_API_KEY + ":").toString('base64');
var TV_AUTH_HEADER = "Basic " + TV_API_KEY_ENC;

var request = require('request');
var tvInterface = require('./TruevaultInterface.js')(config);

var search_option = {
    filter: {
        id: {
            type: "not",
            value: "",
            case_sensitive: false
        }
    },
    full_document: true,
    schema_id: config.TV_ORG_SCHEMA_ID
};

var org_schema = require('./prebuilt/org_schema.js')
console.log(org_schema)

var policy = require('./prebuilt/org_group_policy_base.js');
console.log(policy('asdf'));
