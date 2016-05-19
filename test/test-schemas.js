var should = require('should');
var root = __dirname.substring(0, __dirname.lastIndexOf('/'));
var config = require(root + '/config.js');
var uuid = require('node-uuid');

var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_ORG_SCHEMA_ID = config.TV_ORG_SCHEMA_ID
var tvInterface = require(root + '/TruevaultInterface.js')(config);

var org_schema = require(root + '/test/sample-files/test_schema.js');

describe('Schema Methods', function() {

    var vaultName = "TvInterfaceTest-" + uuid.v4();
    var created_vault_id;
    var schemaName = "TvInterfaceTest-" + uuid.v4();
    var created_schema_id;


    before(function(done) {
        // runs before all tests in this block
        tvInterface.createVault(vaultName, function(error, results) {
            should.not.exist(error);
            created_vault_id = results;
            console.log("Created a vault for testing.")
            done();
        });
    });

    after(function(done) {
        // runs before all tests in this block
        tvInterface.deleteVault(created_vault_id, function(error, results) {
            should.not.exist(error);
            created_vault_id = results;
            console.log("Deleted test vault.")
            done();
        });
    });

    it('schemaTests-01 - should list all schemas', function(done) {
        tvInterface.schemas.getAll(created_vault_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            for (schema in results) {
                should.exist(results[schema].id);
            }
            done();
        });
    });


    it('schemaTests-02 - should be able to create a schema', function(done) {
        tvInterface.schemas.create(created_vault_id, org_schema, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            created_schema_id = results;
            done();
        });
    });

    it('schemaTests-02 - should have created a schema', function(done) {
        tvInterface.schemas.getAll(created_vault_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            var flag = false;
            for (schema in results) {
                if (created_schema_id == results[schema].id) {
                    done();
                }
            }
            flag.should.equal(true);
            done();
        });
    });

    it('schemaTests-03 - should be able to handle duplicate error gracefully', function(done) {
        tvInterface.schemas.create(created_vault_id, org_schema, function(error, results) {
            should.exist(error);
            should.not.exist(results);
            done();
        });
    });

    it('schemaTests-04 - should be able to update schema', function(done) {
        tvInterface.schemas.update(created_vault_id, created_schema_id, org_schema, function(error, results) {
            should.not.exist(error);
            results.should.equal(true);
            done();
        });
    });

    it('schemaTests-05 - should be able to delete an empty schema', function(done) {
        tvInterface.schemas.delete(created_vault_id, created_schema_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            done();
        });
    });

    it('schemaTests-05 - should have deleted the schema', function(done) {
        tvInterface.schemas.getAll(created_vault_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            var flag = false;
            for (schema in results) {
                if (created_schema_id == results[schema].id) {
                    flag.should.equal(true);
                    done();
                }
            }
            done();
        });
    });



});
