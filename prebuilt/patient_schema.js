/**
 * org_schema - The organization schema for all orgs.
 *
 * @return {JSON} JSON of the group policy
 */
module.exports = {
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
};
