/**
 * org_group_policy_base - Generate the base policy for all organizations.
 *
 * @param  {string} vault   Vault ID of the policy to generate
 * @return {JSON}           JSON of the group policy
 */
module.exports = function(vault) {
    var policy = [{
        Resources: [
            "Vault::" + vault + "::Document::.*",
            "Vault::" + vault + "::Blob::.*"
        ],
        Activities: "RU"
    }, {
        Resources: [
            "Vault::" + vault + "::Search::"
        ],
        Activities: "R"
    }];
    return policy;
};
