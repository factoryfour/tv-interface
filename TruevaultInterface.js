var request = require('request')

module.exports = function(config) {

var TV_API_KEY = config.TV_API_KEY;
var TV_ACCOUNT_ID = config.TV_ACCOUNT_ID;

if (!config.TV_API_KEY || !config.TV_ACCOUNT_ID) {
    throw Error("001-TV Interface must be instantiated with an API Key and Account ID.")
}

var TV_API_KEY_ENC = new Buffer(config.TV_API_KEY + ":").toString('base64');
var TV_AUTH_HEADER = "Basic " + TV_API_KEY_ENC;


var tvModule = {};

tvModule.test = function() {
    console.log("hello world");
}

});
