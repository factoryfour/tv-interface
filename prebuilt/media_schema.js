/**
 * org_schema - The organization schema for all orgs.
 *
 * @return {JSON} JSON of the group policy
 */
module.exports = {
    name: "media",
    fields: [{
        name: "name",
        index: true,
        type: "string"
    }, {
        name: "patient_id",
        index: true,
        type: "string"
    }, {
        name: "created_date",
        index: true,
        type: "string"
    }, {
        name: "blob_id",
        index: true,
        type: "string"
    }, {
        name: "type",
        index: true,
        type: "string"
    }]
};
