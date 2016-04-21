var uuid = require('uuid');

var TV_API_KEY = "b99c56f7-efad-4d44-a513-fec0036fee4b";
var TV_ACCOUNT_ID = "0660656f-04c6-408f-a0f0-b8824333798b";
var tvInterface = require('./tvinterface.js')(TV_API_KEY, TV_ACCOUNT_ID);


var org_id = uuid.v4()
var organization = {
  name: 'Fusiform',
  id: org_id,
  is_vendor: false,
  is_active: true,
  vault_id: '',
  patient_schema: '',
  group_policy: '',
  admins: [],
  users: []
}

console.log(tvInterface.test())
tvInterface.createOrganizationVault(organization, function(error, organization) {
  if (error) throw error;
  console.log(organization)
  tvInterface.createOrgGroupPolicy(organization, function(error, organization) {
    if (error) throw error;
    console.log(organization)
  });
});
