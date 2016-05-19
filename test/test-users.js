var should = require('should');
var root = __dirname.substring(0, __dirname.lastIndexOf('/'));
var config = require(root + '/config.js');
var uuid = require('node-uuid');

var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_ORG_SCHEMA_ID = config.TV_ORG_SCHEMA_ID
var tvInterface = require(root + '/TruevaultInterface.js')(config);

describe('User Methods', function() {

    it('userTests-01 - should list all users', function(done) {
        tvInterface.getAllUsers(function(error, results) {
            should.not.exist(error);
            should.exist(results);
            for (user in results) {
                should.exist(results[user].id);
            }
            done();
        });
    });

    it('userTests-02 - should generate access keys for a user', function(done) {
        tvInterface.getAllUsers(function(error, results) {
            should.not.exist(error);
            should.exist(results);
            tvInterface.accessKeys(results[0].id,function(error, access,secret){
                should.not.exist(error);
                should.exist(access);
                should.exist(secret);
            } )
            done();
        });
    });
});
