global.config = require('./config');
global._ = require('underscore');
global.async = require('async');

var mbClientConn = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");

var logic = require('logic');

var mbClient = mbClientConn(function (isReconnecting) {

    mbClient.registerRoute('/files/createInvoiceByClient', function (request) {
        logic.createInvoiceForClient(request.payload.templateId, request.payload.clientIdByPeriod, function (error, result) {
            if (error) {
                console.log(error);
                request.sendResponse(resultFactory.buildError(error));
            } else {
                request.sendResponse(resultFactory.success(result));
            }
        });
    });

    mbClient.registerRoute('/files/createInvoiceByPeriod', function (request) {
        logic.createInvoiceByPeriod(request.payload.templateId, request.payload.period, function (error, result) {
            if (error) {
                console.log(error);
                request.sendResponse(resultFactory.buildError(error));
            } else {
                request.sendResponse(resultFactory.success(result));
            }
        });
    });

    mbClient.registerRoute('/files/getClientJurCountWithoutInvoiceId', function (request) {
        logic.getClientJurCountWithoutInvoiceId(request.payload.period, function (error, result) {
            if (error) {
                console.log(error);
                request.sendResponse(resultFactory.buildError(error));
            } else {
                request.sendResponse(resultFactory.success(result));
            }
        });
    });

    mbClient.registerService();

});