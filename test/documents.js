var should = require('should');
var root = __dirname.substring(0, __dirname.lastIndexOf('/'));
var config = require(root + '/config.js');
var uuid = require('node-uuid');

var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_ORG_SCHEMA_ID = config.TV_ORG_SCHEMA_ID
var tvInterface = require(root + '/TruevaultInterface.js')(config);
var org_schema = require(root + '/prebuilt/org_schema.js');

describe('Document Methods', function() {

    var vaultName = "TvInterfaceTest-" + uuid.v4();
    var created_vault_id;
    var schemaName = "TvInterfaceTest-" + uuid.v4();
    var created_schema_id;
    var created_document_id;

    before(function(done) {
        // runs before all tests in this block
        tvInterface.createVault(vaultName, function(error, results) {
            should.not.exist(error);
            created_vault_id = results;
            console.log("Created test vault.")
            tvInterface.createSchema(created_vault_id, org_schema, function(error, results) {
                should.not.exist(error);
                should.exist(results);
                created_schema_id = results;
                console.log("Created test schema.")
                done();
            });
        });
    });

    after(function(done) {
        // runs before all tests in this block
        tvInterface.deleteSchema(created_vault_id, created_schema_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            console.log("Deleted test schema.")
            tvInterface.deleteVault(created_vault_id, function(error, results) {
                should.not.exist(error);
                created_vault_id = results;
                console.log("Deleted test vault.")
                done();
            });
        });
    });

    it('documentTests-01 - should list all documents', function(done) {
        tvInterface.getAllDocuments(created_vault_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            for (schema in results) {
                should.exist(results[schema].id);
            }
            done();
        });
    });


    it('documentTests-02 - should be able to create a schema', function(done) {
        tvInterface.createEmptyDocument(created_vault_id, created_schema_id, function(error, result) {
            should.not.exist(error);
            should.exist(result);
            created_document_id = result;
            done();
        });
    });

    it('documentTests-02 - should have created a schema', function(done) {
        tvInterface.getAllDocuments(created_vault_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            var flag = false;
            for (document in results) {
                if (created_document_id == results[document].id) {
                    done();
                }
            }
            flag.should.equal(true);
            done();
        });
    });

    it('documentTests-04 - should be able to update a document', function(done) {
        tvInterface.updateDocument(created_vault_id, created_document_id, {hello:"hi"}, function(error, results) {
            should.not.exist(error);
            results.should.equal(true);
            done();
        });
    });



    it('documentTests-04 - should be able to get the document', function(done) {
        tvInterface.getDocument(created_vault_id, created_document_id, function(error, result) {
            should.not.exist(error);
            should.exist(result);
            result.hello.should.equal('hi');
            done();
        });
    });

    it('documentTests-05 - should be able to delete a document', function(done) {
        tvInterface.deleteDocument(created_vault_id, created_document_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            done();
        });
    });

    it('documentTests-05 - should have deleted the schema', function(done) {
        tvInterface.getAllDocuments(created_vault_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            var flag = false;
            for (document in results) {
                if (created_document_id == results[document].id) {
                    flag.should.equal(true);
                    done();
                }
            }
            done();
        });
    });



});
