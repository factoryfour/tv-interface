var request = require('request')
var fs = require('fs');

module.exports = function(config) {
    var TV_API_KEY = config.TV_API_KEY;
    var TV_ACCOUNT_ID = config.TV_ACCOUNT_ID;
    var TV_ADMIN_VAULT_ID = config.TV_ADMIN_VAULT_ID;


    if (!config.TV_API_KEY || !config.TV_ACCOUNT_ID || !config.TV_ADMIN_VAULT_ID) {
        throw Error("001-TV Interface must be instantiated with an API Key, Account ID, Admin Vault ID, Org Schema ID.")
    }

    var TV_API_KEY_ENC = new Buffer(config.TV_API_KEY + ":").toString('base64');
    var TV_AUTH_HEADER = "Basic " + TV_API_KEY_ENC;

    var tvModule = {};

    /**
      Create a new Organization Vault
        pass: organization_JSON
        Will create a new org vault and store ID in vault of organization_JSON
        Name is senstive to organization.is_vendor
        callback(error, updated_organization_JSON)
      **/
    tvModule.createOrganizationVault = function(organization, callback) {
        if (organization.id == '') {
            return callback(Error("Organization must have an ID prior to being created"), null);
        }
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
            var vault = vaultCreatedParsed.vault.id;
            organization.vault = vault;

            return callback(null, organization);
        });

    }


    tvModule.createOrgGroupPolicy = function(organization, callback) {

        var group_policy = [{
            Resources: [
                "Vault::" + organization.vault + "::Document::.*",
                "Vault::" + organization.vault + "::Blob::.*"
            ],
            Activities: "RU"
        }, {
            Resources: [
                "Vault::" + organization.vault + "::Search::"
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

    tvModule.updateOrgGroupPolicy = function(organization, callback) {

        var group_policy = [{
            Resources: [
                "Vault::" + organization.vault + "::Document::.*",
                "Vault::" + organization.vault + "::Blob::.*"
            ],
            Activities: "RU"
        }, {
            Resources: [
                "Vault::" + organization.vault + "::Search::"
            ],
            Activities: "R"
        }];
        var group_policy_enc = new Buffer(JSON.stringify(group_policy)).toString('base64')

        var groupPolicyCreateOptions = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/groups/' + organization.group_policy,
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
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

    tvModule.addOrgPatientSchema = function(organization, callback) {

        var patient_schema = {
            name: "patient",
            fields: [{
                name: "first_name",
                index: true,
                type: "string"
            }, {
                name: "last_name",
                index: true,
                type: "string"
            }, {
                name: "clinic_id",
                index: true,
                type: "string"
            }, {
                name: "dob",
                index: true,
                type: "string"
            }, {
                name: "email",
                index: true,
                type: "string"
            }, {
                name: "phone",
                index: true,
                type: "string"
            }, {
                name: "address",
                index: false,
                type: "string"
            }, {
                name: "owner_id",
                index: true,
                type: "string"
            }, {
                name: "height",
                index: true,
                type: "float"
            }, {
                name: "weight",
                index: true,
                type: "float"
            }, {
                name: "notes",
                index: true,
                type: "string"
            }, {
                name: "needs_attention",
                index: true,
                type: "boolean"
            }, {
                name: "orders",
                index: true,
                type: "string"
            }]
        }

        var patient_schema_enc = new Buffer(JSON.stringify(patient_schema)).toString('base64');

        var patientSchemaCreateOptions = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + organization.vault + '/schemas',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                schema: patient_schema_enc
            }
        };

        request(patientSchemaCreateOptions, function(error, response, schemaCreatedBody) {
            if (error) return callback(Error(error), null);
            var schemaCreatedBodyParsed = JSON.parse(schemaCreatedBody);
            // console.log(schemaCreatedBodyParsed)
            var schema_id = schemaCreatedBodyParsed.schema.id;
            organization.patient_schema = schema_id;
            // console.log("Created group policy named " + policyCreatedParsed.group.name +" with ID " + group_policy_id);
            return callback(null, organization)
        });
    };
    tvModule.addOrgMediaSchema = function(organization, callback) {

        var media_schema = {
            name: "media",
            fields: [{
                name: "name",
                index: true,
                type: "string"
            }, {
                name: "patient_id",
                index: true,
                type: "string"
            },{
                name: "created_date",
                index: true,
                type: "string"
            },{
                name: "blob_id",
                index: true,
                type: "string"
            },{
                name: "type",
                index: true,
                type: "string"
            }]
        }

        var media_schema_enc = new Buffer(JSON.stringify(media_schema)).toString('base64');

        var mediaSchemaCreateOptions = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + organization.vault + '/schemas',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                schema: media_schema_enc
            }
        };

        request(mediaSchemaCreateOptions, function(error, response, schemaCreatedBody) {
            if (error) return callback(Error(error), null);
            var schemaCreatedBodyParsed = JSON.parse(schemaCreatedBody);
            // console.log(schemaCreatedBodyParsed)
            var schema_id = schemaCreatedBodyParsed.schema.id;
            organization.media_schema = schema_id;
            // console.log("Created group policy named " + policyCreatedParsed.group.name +" with ID " + group_policy_id);
            return callback(null, organization)
        });
    };
    tvModule.pushOrgDocument = function(organization, callback) {
        var request = require("request");
        // console.log(organization)
        var org_enc = new Buffer(JSON.stringify(organization)).toString('base64');
        // console.log(org_enc)
        // console.log(config.TV_ORG_SCHEMA_ID)
        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + TV_ADMIN_VAULT_ID + '/documents',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                document: org_enc,
                schema_id: config.TV_ORG_SCHEMA_ID
            }
        };

        request(options, function(error, response, orgPushedBody) {
            if (error) return callback(error, null);
            var orgPushedBodyParsed = JSON.parse(orgPushedBody);
            // console.log(orgPushedBodyParsed)
            if (orgPushedBodyParsed.error) {
                return callback(Error(orgPushedBodyParsed.error.message))
            }
            return callback(null, "Success");
        });

    }

    tvModule.pushOrgSchema = function(callback) {
        var org_schema = {
            name: "organization",
            fields: [{
                name: "name",
                index: true,
                type: "string"
            }, {
                name: "id",
                index: true,
                type: "string"
            }, {
                name: "vault",
                index: true,
                type: "string"
            }, {
                name: "patient_schema",
                index: true,
                type: "string"
            }, {
                name: "group_policy",
                index: true,
                type: "string"
            }, {
                name: "is_vendor",
                index: true,
                type: "boolean"
            }, {
                name: "is_active",
                index: true,
                type: "boolean"
            }, {
                name: "admins",
                index: true,
                type: "string"
            }, {
                name: "users",
                index: true,
                type: "string"
            }]
        }

        var org_schema_enc = new Buffer(JSON.stringify(org_schema)).toString('base64');

        var orgSchemaCreateOptions = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + TV_ADMIN_VAULT_ID + '/schemas',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                schema: org_schema_enc
            }
        };

        request(orgSchemaCreateOptions, function(error, response, schemaCreatedBody) {
            if (error) return callback(Error(error));
            var schemaCreatedBodyParsed = JSON.parse(schemaCreatedBody);
            // console.log(schemaCreatedBodyParsed)
            if (schemaCreatedBodyParsed.error) {
                return callback(Error(schemaCreatedBodyParsed.error.message))
            }
            var schema_id = schemaCreatedBodyParsed.schema.id;
            // console.log("Created group policy named " + policyCreatedParsed.group.name +" with ID " + group_policy_id);
            return callback(null)
        });
    }

    tvModule.updateOrgSchema = function(callback) {
        var org_schema = {
            name: "organization",
            fields: [{
                name: "name",
                index: true,
                type: "string"
            }, {
                name: "id",
                index: true,
                type: "string"
            }, {
                name: "vault",
                index: true,
                type: "string"
            }, {
                name: "patient_schema",
                index: true,
                type: "string"
            }, {
                name: "group_policy",
                index: true,
                type: "string"
            }, {
                name: "is_vendor",
                index: true,
                type: "boolean"
            }, {
                name: "is_active",
                index: true,
                type: "boolean"
            }, {
                name: "admins",
                index: true,
                type: "string"
            }, {
                name: "users",
                index: true,
                type: "string"
            }, {
                name: "org_street",
                index: true,
                type: "string"
            }, {
                name: "org_city",
                index: true,
                type: "string"
            }, {
                name: "org_state",
                index: true,
                type: "string"
            }, {
                name: "org_zip",
                index: true,
                type: "string"
            }]
        }

        var org_schema_enc = new Buffer(JSON.stringify(org_schema)).toString('base64');

        var orgSchemaCreateOptions = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/vaults/' + TV_ADMIN_VAULT_ID + '/schemas/' + config.TV_ORG_SCHEMA_ID,
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                schema: org_schema_enc
            }
        };

        request(orgSchemaCreateOptions, function(error, response, schemaCreatedBody) {
            if (error) return callback(Error(error));
            var schemaCreatedBodyParsed = JSON.parse(schemaCreatedBody);
            // console.log(schemaCreatedBodyParsed)
            if (schemaCreatedBodyParsed.error) {
                return callback(Error(schemaCreatedBodyParsed.error.message))
            }
            var schema_id = schemaCreatedBodyParsed.schema.id;
            // console.log("Created group policy named " + policyCreatedParsed.group.name +" with ID " + group_policy_id);
            return callback(null)
        });
    }

    tvModule.searchForOrgByID = function(id, callback) {
        var search_option = {
            filter: {
                id: {
                    type: "eq",
                    value: id,
                    case_sensitive: false
                }
            },
            full_document: true,
            page: 1,
            per_page: 3,
            schema_id: config.TV_ORG_SCHEMA_ID
        }

        var search_option_enc = new Buffer(JSON.stringify(search_option)).toString('base64')

        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + config.TV_ADMIN_VAULT_ID + '/search',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                search_option: search_option_enc
            }
        };

        request(options, function(error, response, searchBody) {
            if (error) return callback(Error(error));
            var searchBodyParsed = JSON.parse(searchBody);
            // console.log(searchBodyParsed.data.info.total_result_count)
            if (searchBodyParsed.data.info.total_result_count == 0) {
                return callback(Error("Organization does not exist"), null);
            }
            if (searchBodyParsed.data.info.total_result_count > 1) {
                return callback(Error("Strange behavior, multiple org documents"), null);
            }
            if (searchBodyParsed.error) {
                return callback(Error(searchBodyParsed.error.message))
            }

            var doc = searchBodyParsed.data.documents[0].document;
            var doc_dec = JSON.parse(new Buffer(doc, 'base64').toString('ascii'))
            return callback(null, doc_dec)
        });


    }

    tvModule.searchAllPatients = function(organization, callback) {
        var search_option = {
            filter: {
                first_name: {
                    type: "not",
                    value: "",
                    case_sensitive: false
                }
            },
            full_document: true,
            page: 1,
            per_page: 3,
            schema_id: organization.patient_schema
        }

        var search_option_enc = new Buffer(JSON.stringify(search_option)).toString('base64')

        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + organization.vault + '/search',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                search_option: search_option_enc
            }
        };

        request(options, function(error, response, searchBody) {
            if (error) return callback(Error(error));
            var searchBodyParsed = JSON.parse(searchBody);
            if (searchBodyParsed.error) {
                return callback(Error(searchBodyParsed.error.message))
            }

            var doc = searchBodyParsed.data.documents;
            // var doc_dec = JSON.parse(new Buffer(doc, 'base64').toString('ascii'))
            return callback(null, doc)
        });
    }

    tvModule.tokenSearchAllPatients = function(organization, token, callback) {
        var token_enc = new Buffer(token + ":").toString('base64')
        var header = "Basic " + token_enc;
        var search_option = {
            filter: {
                first_name: {
                    type: "not",
                    value: "",
                    case_sensitive: false
                }
            },
            full_document: true,
            page: 1,
            per_page: 3,
            schema_id: organization.patient_schema
        }

        var search_option_enc = new Buffer(JSON.stringify(search_option)).toString('base64')

        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + organization.vault + '/search',
            headers: {
                authorization: header
            },
            formData: {
                search_option: search_option_enc
            }
        };

        request(options, function(error, response, searchBody) {
            if (error) return callback(Error(error));
            var searchBodyParsed = JSON.parse(searchBody);
            if (searchBodyParsed.error) {
                return callback(Error(searchBodyParsed.error.message))
            }

            var doc = searchBodyParsed.data.documents;
            // var doc_dec = JSON.parse(new Buffer(doc, 'base64').toString('ascii'))
            return callback(null, doc)
        });
    }


    tvModule.tokenUpdatePatient = function(organization, token, doc_id, patient, callback) {
        var token_enc = new Buffer(token + ":").toString('base64')
        var header = "Basic " + token_enc;
        var doc_enc = new Buffer(JSON.stringify(patient)).toString('base64')

        var options = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/vaults/' + organization.vault + '/documents/' + doc_id,
            headers: {
                authorization: header
            }
            ,
            formData: {
                document: doc_enc
            }
        };

        request(options, function(error, response, searchBody) {
            if (error) return callback(Error(error));
            // console.log(searchBody)
            // var searchBodyParsed = JSON.parse(new Buffer(searchBody, 'base64').toString('ascii'));
            // if (searchBodyParsed.error) {
            //     return callback(Error(searchBodyParsed.error.message))
            // }

            // var doc = searchBodyParsed.data.documents;
            // var doc_dec = JSON.parse(new Buffer(doc, 'base64').toString('ascii'))
            return callback(null, searchBody)
        });
    }

    tvModule.verifyToken = function(token, callback) {

        var token_enc = new Buffer(token + ":").toString('base64')

        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/auth/me?full=true',
            headers: {
                authorization: "Basic " + token_enc
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error));
            // console.log(body)
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message))
            }

            var doc = bodyParsed;
            return callback(null, doc)
        });
    };

    tvModule.allDocuments = function(vaultId, callback) {
        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/vaults/' + vaultId + '/documents',
            qs: {
                full: 'true'
            },
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error));
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message))
            }

            return callback(null, bodyParsed)
        });
    };

    tvModule.createPatient = function(organization, callback) {
        var patient = {};
        var patient_enc = new Buffer(JSON.stringify(patient)).toString('base64');

        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + organization.vault + '/documents',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                document: patient_enc,
                schema_id: organization.patient_schema
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error));
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message))
            }
            return callback(null, bodyParsed.document_id)
        });
    };

    tvModule.createBlob = function(organization, callback) {
        var patient = {};
        var patient_enc = new Buffer(JSON.stringify(patient)).toString('base64');

        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + organization.vault + '/blobs',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                file: fs.createReadStream(__dirname + "/default.json")
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error));
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message))
            }
            console.log(bodyParsed);
            return callback(null, bodyParsed.blob_id)
        });
    };

    tvModule.createMediaDoc = function(organization, callback) {
        var mediaDoc = {};
        var mediaDoc_enc = new Buffer(JSON.stringify(mediaDoc)).toString('base64');

        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + organization.vault + '/documents',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                document: mediaDoc_enc,
                schema_id: organization.media_schema
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error));
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message))
            }
            return callback(null, bodyParsed.document_id)
        });
    };

    tvModule.addUserToOrganization = function(organization, user_id, callback) {
        var options = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/groups/' + organization.group_policy,
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                user_ids: user_id
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error), false);
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message), false)
            }

            return callback(null, true)
        });
    }

    tvModule.getPatients = function(organization, callback) {
        var search_option = {
            filter: {
                dob: {
                    type: "not",
                    value: "",
                    case_sensitive: false
                }
            },
            full_document: true,
            page: 1,
            per_page: 3,
            schema_id: organization.patient_schema
        }

        var search_option_enc = new Buffer(JSON.stringify(search_option)).toString('base64')

        var options = {
            method: 'POST',
            url: 'https://api.truevault.com/v1/vaults/' + organization.vault + '/search',
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                search_option: search_option_enc
            }
        };

        request(options, function(error, response, searchBody) {
            if (error) return callback(Error(error));
            var searchBodyParsed = JSON.parse(searchBody);
            // console.log(searchBodyParsed)
            if (searchBodyParsed.error) {
                return callback(Error(searchBodyParsed.error.message))
            }

            return callback(null, searchBodyParsed.data.documents)
        });
    }

    tvModule.getPatient = function(organization,pid, callback) {
        var options = {
            method: 'GET',
            url: 'https://api.truevault.com/v1/vaults/' + organization.vault + '/documents/' + pid,
            headers: {
                authorization: TV_AUTH_HEADER
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error));
            var bodyDecoded = new Buffer(body, 'base64').toString('ascii');
            var bodyParsed = JSON.parse(bodyDecoded);
            console.log(bodyDecoded)
            return callback(null, bodyParsed)
        });
    }

    tvModule.updatePatient = function(organization, pid, patient, callback) {
        var doc_enc = new Buffer(JSON.stringify(patient)).toString('base64')
        console.log(doc_enc)
        var options = {
            method: 'PUT',
            url: 'https://api.truevault.com/v1/vaults/' + organization.vault + '/documents/' + pid,
            headers: {
                authorization: TV_AUTH_HEADER
            },
            formData: {
                document: doc_enc
            }
        };

        request(options, function(error, response, body) {
            if (error) return callback(Error(error));
            var bodyParsed = JSON.parse(body);
            if (bodyParsed.error) {
                return callback(Error(searchBodyParsed.error.message))
            }
            // console.log(bodyDecoded)
            return callback(null,bodyParsed )
        });
    }

    tvModule.uniqueUsername = function(email, callback) {
        var optionsAlt = {
            "filter": {
                "$tv.username": {
                    "type": "eq",
                    "value": email,
                    "case_sensitive": false
                },
                "$tv.status": {
                    "type": "eq",
                    "value": "ACTIVATED"
                }
            },
            "filter_type": "and",
            "full_document": true
        };
        var search_query = new Buffer(JSON.stringify(optionsAlt)).toString('base64');

        request.post({
            url: 'https://api.truevault.com/v1/users/search',
            headers: {
                'Authorization': TV_AUTH_HEADER
            },
            form: {
                search_option: search_query
            }
        }, function(error, response, body) {
            if (error) return callback(Error(error));
            var bodyParsed = JSON.parse(body);
            // console.log(searchBodyParsed)
            if (bodyParsed.error) {
                return callback(Error(bodyParsed.error.message))
            }
            if (bodyParsed.data.info.total_result_count > 0) {
                return callback(null, false);
            }
            return callback(null, true)
        });
    }

    tvModule.test = function() {
        return "hello world";
    }

    return tvModule;
};
