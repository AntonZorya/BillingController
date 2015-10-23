/**
 * Created by Alibek on 16.10.2015.
 */
var mbClient = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");
var periodLogic = require('./logicLayer/periodFizLogic');

var client = mbClient(function (isRec) {

    client.registerRoute('/fiz/period/closePeriod', function (request) {
        periodLogic.closePeriod(function(){
            request.sendResponse(resultFactory.success());
        });
    });

    client.registerRoute('/fiz/period/getCurrentPeriod', function (request) {
        periodLogic.getCurrentPeriod(function(err, data){
            request.sendResponse(resultFactory.success(data));
        });
    });

    client.registerService();

});