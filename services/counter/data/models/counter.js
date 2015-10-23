/**
 * Created by Alibek on 25.09.2015.
 */
var modelCreator = require("../../../common/models/modelCreator");

module.exports = modelCreator("counter", [
    {
        name: "counterNumber",
        properties: {
            validations: {
                presence: {
                    message: '#counterNumber is required!'
                }
            }
        }
    },
    {
        name: "currentCounts"
    },
    {
        name: "currentCountsDate"
    },
    {
        name: "isActive"
    },
    {
        name: "lastCounts"
    },
    {
        name: "lastCountsDate"
    },
    {
        name: "plumbNumber"
    },
    {
        name: "problemDescription"
    }
]);
