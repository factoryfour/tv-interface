var uuid = require('uuid');

var TV_API_KEY = "b99c56f7-efad-4d44-a513-fec0036fee4b";
var TV_ACCOUNT_ID = "0660656f-04c6-408f-a0f0-b8824333798b";
var TV_ADMIN_VAULT_ID = "567753ae-6f80-4d63-941d-53e5701d365a"
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

tvInterface.pushOrgDocument(organization_test, function(error, organization){

  console.log(organization)
});
