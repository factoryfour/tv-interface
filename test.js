var uuid = require('uuid');

var config = require('./config.js')

var TV_ACCOUNT_ID     = config.TV_ACCOUNT_ID;
var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_ORG_SCHEMA_ID  = config.TV_ORG_SCHEMA_ID
var TV_API_KEY        = config.TV_API_KEY;

var TV_API_KEY_ENC = new Buffer(TV_API_KEY + ":").toString('base64');
var TV_AUTH_HEADER = "Basic " + TV_API_KEY_ENC;

var request = require('request');
var tvInterface = require('./tvinterface.js')(config);


var org_id = uuid.v4()
var organization = {
  name: 'Fusiform',
  id: "1c98b49f-64fa-4aa5-9f43-35fb090958d2",
  vault: '',
  patient_schema: '',
  group_policy: '',
  is_vendor: false,
  is_active: true,
  admins: [],
  users: [],
  org_street:"3201 saint paul ",
  org_city:"Baltimore",
  org_state:"Maryland",
  org_zip:"21218"
}


// tvInterface.updateOrgSchema(function(error) {
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
//       tvInterface.pushOrgDocument(organization, function(error, success) {
//
//         console.log(success)
//         tvInterface.searchForOrgByName("Fusiform", function(error, results) {
//           console.log("found the organiztion")
//           console.log(results)
//         });
//       });
//     });
//   });
// });

// tvInterface.searchForOrgByID("cc93ee0e-21c1-4ad0-bc2b-f2a11a54ec32", function(error, results) {
//   if (error) {
//     throw error;
//   }
//   console.log("found the organiztion");
//   if (results > 0) {
//     throw Error("There was more than one result. WAT");
//   }
//   var org = JSON.parse(new Buffer(results[0].document, 'base64').toString('ascii'));
//   console.log(org)
//
//   var patient = {
//     first_name: "Alex",
//     last_name: "Mathews",
//     clinic_id: "00001",
//     dob:"04/11/1994",
//     email:"alexjmathews",
//     phone:"7148516800",
//     address:"4090 Santa Anita Ln, Yorba Linda, CA 92886",
//     owner_id:"hello",
//     height:"67",
//     weight:"130",
//     notes:"",
//     needs_attention:false,
//     orders:"[]",
//     media:"[]"
//   }
//
//
//   tvInterface.createPatient(org, patient, function(error, result) {
//     if(error) {
//       throw error;
//     }
//     console.log(result);
//   });
// });
//

// tvInterface.allDocuments("8ab5a786-cc69-4197-931f-8cbc32efee49", function(error, results) {
//   console.log("found all the docs")
//   console.log(results)
//   // for (i = 0; i < results.length; i++) {
//   //   console.log(JSON.parse(new Buffer(results[i].document, 'base64').toString('ascii')))
//   // }
// });

// tvInterface.searchForOrgByID("cc93ee0e-21c1-4ad0-bc2b-f2a11a54ec32", function(error, results) {
//   if (error) {
//     throw error;
//   }
//   console.log("found the organiztion");
//   if (results > 0) {
//     throw Error("There was more than one result. WAT");
//   }
//   var org = JSON.parse(new Buffer(results[0].document, 'base64').toString('ascii'));
//   console.log(org)
//   tvInterface.getPatients(org, function(error, results) {
//     if (error) {
//       throw error;
//     }
//     console.log(results);
//   });
//
// });

    // tvInterface.uniqueUsername("s.demo@me.com", function(error, results) {
    //     console.log(results)
    // });

var user_id = "d859b353-8368-4aa7-b73e-4f01bf2df679"

tvInterface.searchForOrgByID("1c98b49f-64fa-4aa5-9f43-35fb090958d2", function(error, organization){
    tvInterface.addUserToOrganization(organization, user_id, function(error, success){
    console.log(error);
    console.log(success);
    });
});
