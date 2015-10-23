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

    client.registerRoute('/jur/periods/closePeriod', function (request) {
        periodLogic.closePeriod(function () {
            request.sendResponse(resultFactory.success());
        });
    });

    client.registerRoute('/jur/periods/getCurrent', function (request) {
        periodLogic.getCurrentPeriod(function (err, data) {
            request.sendResponse(resultFactory.success(data));
        });
    });

    client.registerRoute('/jur/periods/getClosed', function (request) {
        periodLogic.getClosed(function (err, data) {
            if (err) {
                request.sendResponse(resultFactory.buildError(err));
            } else {
                request.sendResponse(resultFactory.success(data));
            }
        });
    });

    client.registerService();

});