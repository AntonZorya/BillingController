/**
 * Created by vaio on 25.09.2015.
 */
var modelCreator = require("../../../common/models/modelCreator");
module.exports = modelCreator("address", [
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
        name: "oldName",
        properties: {
            validations: {
                presence: {
                    message: '#oldName is required!'
                }
            }
        }
    }

]);