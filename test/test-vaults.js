var should = require('should');
var root = __dirname.substring(0, __dirname.lastIndexOf('/'));
var config = require(root + '/config.js');
var uuid = require('node-uuid');

var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_ORG_SCHEMA_ID = config.TV_ORG_SCHEMA_ID;
var tvInterface = require(root + '/tvInterface.js')(config);

describe('Vault Methods', function() {

    var vaultName = "TvInterfaceTest-"+uuid.v4();
    var created_vault_id;

    it('vaultTests-01 - should be able to list all vaults', function(done) {
        tvInterface.vaults.getAll(function(error, results) {
            should.not.exist(error);
            should.exist(results);
            for (vault in results) {
                should.exist(results[vault].id);
            }
            done();
        });
    });

    it('vaultTests-02 - should be able to create a vault', function(done) {
        tvInterface.vaults.create(vaultName, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            created_vault_id = results;
            done();
        });
    });

    it('vaultTests-03 - should have created a vault', function(done) {
        tvInterface.vaults.getAll(function(error, results) {
            should.not.exist(error);
            should.exist(results);
            var flag = false;
            for (vault in results) {
                if (created_vault_id == results[vault].id) {
                    done();
                }
            }
            flag.should.equal(true);
            done();
        });
    });

    it('vaultTests-04 - should be able to handle duplicate error gracefully', function(done) {
        tvInterface.vaults.create(vaultName, function(error, results) {
            should.exist(error);
            should.not.exist(results);
            done();
        });
    });

    it('vaultTests-05 - should be able to delete an empty vault', function(done) {
        tvInterface.vaults.delete(created_vault_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            done();
        });
    });

    it('vaultTests-06 - should have deleted the vault', function(done) {
        tvInterface.vaults.getAll(function(error, results) {
            should.not.exist(error);
            should.exist(results);
            var flag = false;
            for (vault in results) {
                if (created_vault_id == results[vault].id) {
                    flag.should.equal(true);
                    done();
                }
            }
            done();
        });
    });
});
