var uuid = require('uuid');

var config = require('./config.js')

var TV_ACCOUNT_ID = config.TV_ACCOUNT_ID;
var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;
var TV_ORG_SCHEMA_ID = config.TV_ORG_SCHEMA_ID
var TV_API_KEY = config.TV_API_KEY;

var TV_API_KEY_ENC = new Buffer(TV_API_KEY + ":").toString('base64');
var TV_AUTH_HEADER = "Basic " + TV_API_KEY_ENC;

var request = require('request');
var tvInterface = require('./tvinterface.js')(config);

var org_doc = {
    name: 'Fusiform',
    id: '7804d806-13cd-40c9-84d2-373824ddc922',
    vault: '81e2d7c8-0db8-4dbf-9a55-1235d9df9ee2',
    patient_schema: '8bdcf0a8-2c78-42cf-943e-7d13f1b3b0fb',
    group_policy: '1a7e6490-7707-4abe-95d3-c73e260f0932',
    is_vendor: false,
    is_active: true,
    admins: [],
    users: [],
    org_street: '3201 Saint Paul St',
    org_city: 'Baltimore',
    org_state: 'MD',
    org_zip: '21218',
    admin: '[dad51e97-7d1a-4dd1-a77b-d57518d3fefa]'
}

tvInterface.createPatient(org_doc, function(error, document_id) {
    if (error) {
        throw error;
    }
    var patient = {
       first_name:"Alex",
       last_name:"Mathews",
       needs_attention:true
   }
   tvInterface.tokenUpdatePatient(org_doc, token, document_id, patient, function(error, result){
       if (error){
           throw error;
       }
       console.log(result)
   });
})

// tvInterface.updateOrgGroupPolicy(org_doc, function(error, result){
//         if (error) {
//             throw error;
//         }
//         console.log(result)
// });

var token = ".eJwljcsOgjAQAP-lV91k-9qWnv0ED3IiC9smxKBE4IDGf7fqdTKTeal1nPKy8jSrpAxqAnRg_FlTspSwOSAmRHX8ed0171WTp7_s7cnEtvJtyY9ulC9m8To3AYJoBieigUPoQXzwOootuXANeBju2239N0iE5KnU60DgMBZgLAh9jMZZa0MTe_X-ADKXLc4.Cf_Y-Q.JUghoniUZmnT9gw2BpeibbSe9BY";
// tvInterface.tokenSearchAllPatients(org_doc, token, function(error, result){
//     if (error) {
//         throw error;
//     }
//     console.log(result[1])
//     var patient = {
//         first_name:"Alex",
//         last_name:"Mathews",
//         needs_attention:true
//     }
//     tvInterface.tokenUpdatePatient(org_doc, token, result[1].document_id, patient, function(error, result){
//         if (error){
//             throw error;
//         }
//         console.log(result)
//     });
//
// });
// tvInterface.verifyToken(, function(error, result) {
//     if (error) {
//         throw error;
//     }
//     console.log(result);
// })

// var org_id = uuid.v4()
// var organization = {
//   name: 'Fusiform',
//   id: "1c98b49f-64fa-4aa5-9f43-35fb090958d2",
//   vault: '',
//   patient_schema: '',
//   group_policy: '',
//   is_vendor: false,
//   is_active: true,
//   admins: [],
//   users: [],
//   org_street:"3201 saint paul ",
//   org_city:"Baltimore",
//   org_state:"Maryland",
//   org_zip:"21218"
// }


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

// var user_id = "d859b353-8368-4aa7-b73e-4f01bf2df679"
//
// tvInterface.searchForOrgByID("1c98b49f-64fa-4aa5-9f43-35fb090958d2", function(error, organization){
//     tvInterface.addUserToOrganization(organization, user_id, function(error, success){
//     console.log(error);
//     console.log(success);
//     });
// });
