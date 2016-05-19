var should = require('should');
var root = __dirname.substring(0, __dirname.lastIndexOf('/'));
var config = require(root + '/config.js');
var uuid = require('node-uuid');
var fs = require('fs');

var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_ORG_SCHEMA_ID = config.TV_ORG_SCHEMA_ID
var tvInterface = require(root + '/TruevaultInterface.js')(config);

var testFile = fs.createReadStream(__dirname + "/sample-files/Fusiform_Logo.png")


describe('Blob Methods', function() {

    var vaultName = "TvInterfaceTest-"+uuid.v4();
    var created_vault_id;
    var created_blob_id;


    before(function(done) {
    // runs before all tests in this block
        tvInterface.vaults.create(vaultName, function(error, results) {
            should.not.exist(error);
            created_vault_id = results;
            console.log("Created a vault for testing.")
            done();
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

    it('blobTests-01 - should list all blobs', function(done) {
        tvInterface.blobs.getAll(created_vault_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            done();
        });
    });


    it('blobTests-02 - should be able to create a blob', function(done) {
        tvInterface.blobs.createEmpty(created_vault_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            created_blob_id = results;
            done();
        });
    });

    it('blobTests-02 - should have created a blob', function(done) {
        tvInterface.blobs.getAll(created_vault_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            var blobs = results;
            console.log(results)
            var flag = false;
            for (blob in results) {
                if (created_blob_id == blobs[blob].id) {
                    done();
                }
            }

            flag.should.equal(true);
            done();
        });
    });

    it('blobTests-04 - should be able to update blob', function(done) {
        tvInterface.blobs.update(created_vault_id, created_blob_id, testFile, function(error, results) {
            should.not.exist(error);
            results.should.equal(true);
            done();
        });
    });

    it('blobTests-05 - should be able to delete a blob', function(done) {
        tvInterface.blobs.delete(created_vault_id, created_blob_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            done();
        });
    });

    it('blobTests-05 - should have deleted the blob', function(done) {
        tvInterface.blobs.getAll(created_vault_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            var flag = false;
            for (blob in results) {
                if (created_blob_id == results[blob].id) {
                    flag.should.equal(true);
                    done();
                }
            }
            done();
        });
    });



});
