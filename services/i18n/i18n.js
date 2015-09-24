/**
 * Created by mac on 24.09.15.
 */
var db = require('../common/dbConnection/orientDB');
var mbClient = require("../common/mbConnection/netConnection");
var moment = require('moment');
var resultFactory = require("../common/operations/resultFactory");


var client = mbClient(function(isReconnecting) {


    client.registerRoute("/i18n/getByLangCode", function(request){













        request.sendResponse(resultFactory.success({paramsFromClient: request.payload, text: "balbahgglbal"}));
    });




    client.registerService();


});
