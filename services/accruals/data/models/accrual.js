/**
 * Created by Alibek on 25.09.2015.
 */


var modelCreator = require("../../../common/models/modelCreator");

module.exports = modelCreator("accrual", [
    {
        name: "sum",
        properties: {
            validations: {
                presence: {
                    message: '#sum is required!'
                }
            }
        }
    }
]);