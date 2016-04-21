var request = require('request')

module.exports = function(TV_API_KEY, TV_ACCOUNT_ID) {
  var TV_API_KEY_ENC = new Buffer(TV_API_KEY + ":").toString('base64');
  var TV_AUTH_HEADER = "Basic " + TV_API_KEY_ENC;

  if (!TV_API_KEY || !TV_ACCOUNT_ID) {
    throw Error("001-TV Interface must be instantiated with an API Key and Accout ID.")
  }

  var tvModule = {};

  /**
    Create a new Organization Vault
      pass: organization_JSON
      Will create a new org vault and store ID in vault_id of organization_JSON
      Name is senstive to organization.is_vendor
      callback(error, updated_organization_JSON)
    **/
  tvModule.createOrganizationVault = function(organization, callback) {
    var prefix = "cli_";
    if (organization.is_vendor) {
      prefix = "ven_"
    }

    var vaultCreateOptions = {
      method: 'POST',
      url: 'https://api.truevault.com/v1/vaults',
      headers: {
        authorization: TV_AUTH_HEADER
      },
      formData: {
        name: prefix + organization.id
      }
    };

    request(vaultCreateOptions, function(error, response, vaultCreatedBody) {
      if (error) return callback(Error(error), null);
      var vaultCreatedParsed = JSON.parse(vaultCreatedBody);
      var vault_id = vaultCreatedParsed.vault.id;
      organization.vault_id = vault_id;

      return callback(null, organization);
    });

  }


  tvModule.createOrgGroupPolicy = function(organization, callback) {

    var group_policy = [{
      Resources: [
        "Vault::" + organization.vault_id + "::Document"
      ],
      Activities: "RUD"
    }, {
      Resources: [
        "Vault::" + organization.vault_id + "::Search::"
      ],
      Activities: "R"
    }];
    var group_policy_enc = new Buffer(JSON.stringify(group_policy)).toString('base64')

    var groupPolicyCreateOptions = {
      method: 'POST',
      url: 'https://api.truevault.com/v1/groups',
      headers: {
        authorization: TV_AUTH_HEADER
      },
      formData: {
        name: "cli_policy_" + organization.id,
        policy: group_policy_enc
      }
    };

    request(groupPolicyCreateOptions, function(error, response, policyCreatedBody) {
      if (error) return callback(Error(error), null);
      var policyCreatedParsed = JSON.parse(policyCreatedBody);
      var group_policy_id = policyCreatedParsed.group.group_id;
      organization.group_policy = group_policy_id;
      // console.log("Created group policy named " + policyCreatedParsed.group.name +" with ID " + group_policy_id);
      return callback(null, organization)
    });
  };

  tvModule.test = function() {
    return "hello world";
  }

  return tvModule;
};
