var should = require('should');
var root = __dirname.substring(0, __dirname.lastIndexOf('/'));
var config = require(root + '/config.js');
var uuid = require('node-uuid');

var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_ORG_SCHEMA_ID = config.TV_ORG_SCHEMA_ID
var tvInterface = require(root + '/TruevaultInterface.js')(config);

var org_schema = require(root + '/test/sample-files/test_schema.js');
var org_schema_2 = require(root + '/test/sample-files/test_schema_2.js');

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
        tvInterface.createVault(vaultName, function(error, results) {
            should.not.exist(error);
            created_vault_id = results;
            console.log("Created test vault.")
            var tasks = [];
            tasks.push(tvInterface.createSchema(created_vault_id, org_schema, function(error, results) {
                should.not.exist(error);
                should.exist(results);
                created_schemas.push(results);
                console.log("Created test schema.")
            }));
            tasks.push(tvInterface.createSchema(created_vault_id, org_schema_2, function(error, results) {
                should.not.exist(error);
                should.exist(results);
                created_schemas.push(results);
                console.log("Created test schema.")
            }));
        });
    });

    // after(function(done) {
    //     // runs before all tests in this block
    //     tvInterface.deleteVault(created_vault_id, function(error, results) {
    //         should.not.exist(error);
    //         created_vault_id = results;
    //         console.log("Deleted test vault.")
    //         done();
    //     });
    // });

    it('deleteTest-01 - should delete all schemas', function(done) {
        tvInterface.deleteAllSchemas(created_vault_id, function(error, results) {
            should.not.exist(error);
            results.should.equal(true);
            done();
        });
    });

});
