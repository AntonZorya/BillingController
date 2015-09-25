/**
 * Created by vaio on 25.09.2015.
 */
var modelCreator = require("../../../common/models/modelCreator");
module.exports = modelCreator("addressType", [
    {
        name: "name",
        properties: {
            validations: {
                presence: {
                    message: '#name is required!'
                }
            }
        }
    },
    {
        name: "shortName",
        properties: {
            validations: {
                presence: {
                    message: '#shortName is required!'
                }
            }
        }
    }

]);