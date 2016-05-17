var should = require('should');
var root = __dirname.substring(0, __dirname.lastIndexOf('/'));
var config = require(root + '/config.js');
var uuid = require('node-uuid');

var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_ORG_SCHEMA_ID = config.TV_ORG_SCHEMA_ID
var tvInterface = require(root + '/TruevaultInterface.js')(config);
var org_policy_gen = require(root + '/prebuilt/org_group_policy_base.js');

describe('Group Methods', function() {


    var groupName = "TvInterfaceTest-"+uuid.v4();
    var created_group_id;
    var policy = org_policy_gen(uuid.v4())

    it('groupTests-01 - should list all groups', function(done) {
        tvInterface.getAllGroups(function(error, results) {
            should.not.exist(error);
            should.exist(results);
            for (group in results) {
                should.exist(results[group].id);
            }
            done();
        });
    });


    it('groupTests-02 - should be able to create a group', function(done) {
        tvInterface.createGroup(groupName,policy, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            created_group_id = results;
            done();
        });
    });

    it('groupTests-03 - should have created a group', function(done) {
        tvInterface.getAllGroups(function(error, results) {
            should.not.exist(error);
            should.exist(results);
            var flag = false;
            for (group in results) {
                if (created_group_id == results[group].id) {
                    done();
                }
            }
            flag.should.equal(true);
            done();
        });
    });

    it('groupTests-04 - should be able to handle duplicate error gracefully', function(done) {
        tvInterface.createGroup(groupName, policy, function(error, results) {
            should.exist(error);
            should.not.exist(results);
            done();
        });
    });

    it('groupTests-05 - should be able to delete an empty group', function(done) {
        tvInterface.deleteGroup(created_group_id, function(error, results) {
            should.not.exist(error);
            should.exist(results);
            done();
        });
    });

    it('groupTests-06 - should have deleted the group', function(done) {
        tvInterface.getAllGroups(function(error, results) {
            should.not.exist(error);
            should.exist(results);
            var flag = false;
            for (group in results) {
                if (created_group_id == results[group].id) {
                    flag.should.equal(true);
                    done();
                }
            }
            done();
        });
    });

});
