var root = __dirname.substring(0, __dirname.lastIndexOf('/'));
var config = require(root + '/config.js');
var async = require('async');

var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_ORG_SCHEMA_ID = config.TV_ORG_SCHEMA_ID
var tvInterface = require(root + '/tvInterface.js')(config);



var vault_ids;

if (process.argv.length == 3) {
    vault_ids = [process.argv[2]];
} else {
    /**
     * CHANGE THESE VALUES TO CLEAR A VAULT WITHOUT A COMMAND LINE ARG
     */
    vault_ids = [
        "e578afbc-98d7-4f96-af23-032c85b71616"];
}

vault_ids.forEach(function(vault_id, index, arr) {
    console.log("deleting vault_id " + vault_id);
    var willDelete = [tvInterface.documents, tvInterface.blobs, tvInterface.schemas];
    var tasks = [];

    willDelete.forEach(function(toDelete, index, arr) {
        tasks.push(function(callback) {
            toDelete.deleteAll(vault_id, function(error, results, success) {
                if (error) {
                    callback(error, results);
                } else if (!success) {
                    callback(new Error("Did not delete all "), results);
                } else {
                    callback(null, true);
                }
            });
        });
    });
    async.series(tasks, function(err, results) {
        console.log(results)
        var flag = true;
        results.forEach(function(value, index, arr) {
            if (!value) {
                flag = false;
            }
        });
        if (!flag) {
            console.log("Failed to delete all.")
        } else {
            tvInterface.vaults.delete(vault_id, function(error, results) {
                if(error) {
                    throw error;
                } else {
                    console.log("SUCCESS");
                }
            });
        }
    });

}) ;
