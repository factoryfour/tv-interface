var uuid = require('uuid');

var config = require('./config.js')
var TV_API_KEY = config.TV_API_KEY;
var TV_ACCOUNT_ID = config.TV_ACCOUNT_ID;
var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_API_KEY_ENC = new Buffer(TV_API_KEY + ":").toString('base64');
var TV_AUTH_HEADER = "Basic " + TV_API_KEY_ENC;
var TV_ORG_SCHEMA_ID = "5ab34eec-b33b-4f6b-a549-0e3c9c54c383"

var request = require('request');
var tvInterface = require('./tvinterface.js')(TV_API_KEY, TV_ACCOUNT_ID, TV_ADMIN_VAULT_ID);


var org_id = uuid.v4()
var organization = {
  name: 'Fusiform',
  id: org_id,
  vault: '',
  patient_schema: '',
  group_policy: '',
  is_vendor: false,
  is_active: true,
  admins: [],
  users: []
}


// tvInterface.pushOrgSchema(function(error) {
//   if (error) throw error;
//   console.log("success");
// })

// tvInterface.createOrganizationVault(organization, function(error, organization) {
//   if (error) throw error;
//   console.log(organization)
//   tvInterface.createOrgGroupPolicy(organization, function(error, organization) {
//     if (error) throw error;
//     console.log(organization)
//     tvInterface.addOrgPatientSchema(organization, function(error, organization) {
//       if (error) throw error;
//       console.log(organization)
//
//     });
//   });
// });

var organization_test = {
  name: 'Fusiform',
  id: org_id,
  vault: 'asaass2123123',
  patient_schema: 'asaass2123123',
  group_policy: 'asaass2123123',
  is_vendor: false,
  is_active: true,
  admins: [],
  users: []
}


// tvInterface.pushOrgDocument(organization_test, function(error, organization) {
//
//   console.log(organization)
// });
