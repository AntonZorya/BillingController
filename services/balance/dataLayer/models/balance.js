/**
 * Created by Alibek on 12.10.2015.
 */
var modelCreator = require("../../../common/models/modelCreator");
module.exports = modelCreator("balance", [
    {name: "balanceTypeId", type: "ObjectID"  }, //
    { name: "clientId"},
    { name: "counterId" },
    { name: "sum"},
    { name: "period"},
    { name: "date"},
    { name: "userId" },
    { name: "isDeleted"}
]);