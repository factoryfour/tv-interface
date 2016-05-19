var should = require('should');
var root = __dirname.substring(0, __dirname.lastIndexOf('/'));
var config = require(root + '/config.js');
var uuid = require('node-uuid');
var async = require('async');

var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_ORG_SCHEMA_ID = config.TV_ORG_SCHEMA_ID
var tvInterface = require(root + '/TruevaultInterface.js')(config);

var org_schemas = [];
org_schemas.push(require(root + '/test/sample-files/test_schema.js'));
org_schemas.push(require(root + '/test/sample-files/test_schema_2.js'));

describe('Document Methods', function() {

    var vaultName = "TvInterfaceTest-" + uuid.v4();
    var created_vault_id;
    var schemaName = "TvInterfaceTest-" + uuid.v4();
    var created_schemas;
    var created_documents;

    var test = {
        hello: "hi"
    }

    before(function(done) {
        // runs before all tests in this block
        tvInterface.vaults.create(vaultName, function(error, results) {
            should.not.exist(error);
            created_vault_id = results;
            console.log("Created test vault.")
            var tasks = [];
            org_schemas.forEach(function(schema, index, arr) {
                tasks.push(function(callback) {
                    tvInterface.schemas.create(created_vault_id, schema, function(error, results) {
                        should.not.exist(error);
                        should.exist(results);
                        console.log("Created test schema.")
                        callback(null, results);
                    })
                });
            });
            for (var i = 0; i < 3; i++) {
                tasks.push(function(callback) {
                    tvInterface.documents.createEmpty(created_vault_id, null, function(error, results) {
                        should.not.exist(error);
                        should.exist(results);
                        console.log("Created test document.")
                        callback(null, results);
                    })
                });
            }
            for (var i = 0; i < 3; i++) {
                tasks.push(function(callback) {
                    tvInterface.blobs.createEmpty(created_vault_id, function(error, results) {
                        should.not.exist(error);
                        should.exist(results);
                        console.log("Created test blob.")
                        callback(null, results);
                    })
                });
            }
            async.parallel(tasks, function(err, results) {
                // All tasks are done now
                done();
            });
        });
    });

    after(function(done) {
        // runs before all tests in this block
        tvInterface.vaults.delete(created_vault_id, function(error, results) {
            should.not.exist(error);
            created_vault_id = results;
            console.log("Deleted test vault.")
            done();
        });
    });

    it('deleteTests-01 - should delete all schemas', function(done) {
        tvInterface.schemas.deleteAll(created_vault_id, function(error, results, success) {
            should.not.exist(error);
            success.should.equal(true);
            done();
        });
    });

    it('deleteTests-02 - should delete all documents', function(done) {
        tvInterface.documents.deleteAll(created_vault_id, function(error, results, success) {
            should.not.exist(error);
            success.should.equal(true);
            done();
        });
    });

    it('deleteTests-03 - should delete all blobs', function(done) {
        tvInterface.blobs.deleteAll(created_vault_id, function(error, results, success) {
            should.not.exist(error);
            success.should.equal(true);
            done();
        });
    });

});
