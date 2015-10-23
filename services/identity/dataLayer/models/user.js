/**
 * Created by mac on 22.09.15.
 */
var modelCreator = require("../../../common/models/modelCreator");
module.exports = modelCreator("user", [{
    name: "userName",
    properties: {
        validations: {
            presence: {
                message: '#userName is required!'
            }
        }
    }
},

    {
        name: "password",
        properties: {
            validations: {
                presence: {
                    message: '#password is required!'
                }
            }
        }
    }
]);