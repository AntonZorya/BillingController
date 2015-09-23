/**
 * Created by mac on 23.09.15.
 */
var modelCreator = require("../../../common/models/modelCreator");
module.exports = modelCreator("role", [{
    name: "roleName",
    properties: {
        validations: {
            presence: {
                message: '#roleName is required!'
            }
        }
    }}
]);