/**
 * Created by Alibek on 14.10.2015.
 */
/**
 * Created by Alibek on 13.10.2015.
 */
var mbClient = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");
var periodLogic = require('./logicLayer/periodLogic');

var client = mbClient(function (isRec) {

    client.registerRoute('/period/closePeriod', function (request) {
        periodLogic.closePeriod(function(){
            request.sendResponse(resultFactory.success());
        });
    });

    client.registerRoute('/period/getCurrentPeriod', function (request) {
        periodLogic.getCurrentPeriod(function(err, data){
            request.sendResponse(resultFactory.success(data));
        });
    });

    client.registerService();

});