/**
 * Created by mac on 23.09.15.
 */
var modelCreator = require("../../../common/models/modelCreator");
module.exports = modelCreator("role", [{
    name: "token",
    properties: {
        validations: {
            presence: {
                message: '#token is required!'
            }
        }
    }},{
    name: "userId",
    properties: {
    validations: {
        presence: {
            message: '#token is required!'
        }
    }
    }
    } ,{
        name: "validThru",
        properties: {
            validations: {
                presence: {
                    message: '#validThru is required!'
                }
            }
        }
    }
]);