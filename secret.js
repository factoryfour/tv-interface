var request = require('request');
var crypto = require('crypto');


var api_key = "f2eedac7-ea5d-4013-986a-b20a8e70b8d4";

var id = "2625cccc-8f46-4f91-8487-1a7ff36e95fe";
var req = {
   blob_id: "e421299e-b470-4998-ab93-12c05cc14a41",
   vault_id:"62b93162-9f2b-41b1-a7d5-77d9e6b23e98"
}

var req_enc = new Buffer(JSON.stringify(req)).toString('base64');
var header = "Basic " + new Buffer(api_key + ":").toString('base64')

var options = {
    method: 'POST',
    url: 'https://api.truevault.com/v1/users/' + id + '/access_key',
    headers: {
        authorization: header
    }
};


request(options, function(error, response, body) {
    var bodyParsed = JSON.parse(body);
    var access_key = bodyParsed.user.access_key;
    var secret_key = bodyParsed.user.secret_key;
    console.log("Access: " + access_key);
    console.log("Secret: " + secret_key);
    console.log(secret_key)
    const hmac = crypto.createHmac('sha256', secret_key);
    var futureDate = new Date(Date.now()+1000*60*60).toISOString();
    hmac.update(futureDate);
    var signature = new Buffer(hmac.digest('hex')).toString('base64');
    console.log(signature)
    var url = "https://api.truevault.com/v1/download?access_key=" + access_key + "&expiration="+ futureDate+ "&signature="+ signature+ "&request=" + req_enc;
    console.log(url)
});
