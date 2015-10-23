/**
 * Created by vaio on 12.10.2015.
 */
var mbClient = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");
var mongoose = require("../common/dbConnection/mongoDB");
var validator = require("../common/mongoose/validator");
var async = require("async");

var clientLoadDef = require("./dataLayer/models/clientLoad");
var loadUnitDef = require("./dataLayer/models/loadUnit");
var negotiableLoadDef = require("./dataLayer/models/negotiableLoad");

var clientLoadCollection = require("../common/mongoose/modelBuilder")("ClientLoad", clientLoadDef);
var loadUnitCollection = require("../common/mongoose/modelBuilder")("LoadUnit", loadUnitDef);
var negotiableLoadCollection = require("../common/mongoose/modelBuilder")("NegotiableLoad", negotiableLoadDef);


var client = mbClient(function (isReconnecting) {

    //ADD NEW "LOAD UNIT" ex:// 1житель/сутки
    client.registerRoute("/loadings/loadUnit/add", function (request) {
        if (!request.payload) {
            return request.sendResponse(resultFactory.internalError(["#nothing to save"]));
        }
        else {
            var model = loadUnitCollection(request.payload);
            model.save(function (err) {
                if (err) return request.sendResponse(resultFactory.buildError(err));
                request.sendResponse(resultFactory.success({}));
            });
        }
    });

    //ADD NEW "NEGOTIABLE LOAD" ex:// Разбор воды из уличных колонок
    client.registerRoute("/loadings/negotiableLoad/add", function (request) {
        if (!request.payload) {
            return request.sendResponse(resultFactory.internalError(["#nothing to save"]));
        }
        else {
            if (!request.payload.loadUnit) {
                return request.sendResponse(resultFactory.internalError(["#loadUnit not found"]));
            }
            else {
                loadUnitCollection.findById(request.payload.loadUnit, {isDeleted: false}, function (err, loadUnit) {
                    if (err) return request.sendResponse(resultFactory.internalError(["#loadUnit not found"]));
                    request.payload.loadUnit = loadUnit;

                    var model = negotiableLoadCollection(request.payload);
                    model.save(function (err) {
                        if (err) return request.sendResponse(resultFactory.buildError(err));
                        request.sendResponse(resultFactory.success({}));
                    });
                });
            }

        }
    });

    //GET "NEGOTIABLE LOAD" LIST, GROUP SELECTOR AVAILABLE
    client.registerRoute("/loadings/negotiableLoad/getAllOrGroup", function (request) {
        var query;
        if (request.payload && request.payload.groupNumber) {
            query = {
                isDeleted:false,
                groupNumber:request.payload.groupNumber
            };
        }
        else{
            query = {
                isDeleted:false
            };
        }

        negotiableLoadCollection.find(query, function (err, docs) {
            if (err) return request.sendResponse(resultFactory.buildError(err));
            else if (!docs || docs == null) return request.sendResponse(resultFactory.internalError(["#negotiableLoad not found"]));
            async.map(
                docs,
                function (item, callback) {
                    var transformed = {
                        _id: item._id,
                        name: item.name,
                        loadUnit_name: item.loadUnit.name,
                        litersPerDay: item.litersPerDay,
                        groupNumber: item.groupNumber?item.groupNumber:null
                    };
                    callback(null, transformed);
                },
                function (err, results) {
                    if(err) return request.sendResponse(resultFactory.internalError(err));
                    request.sendResponse(resultFactory.success(results));
                });
        });
    });

    //VALIDATE "CLIENT LOAD" ex:// Разбор воды из уличных колонок
    client.registerRoute("/loadings/clientLoad/validate", function (request) {
        if (!request.payload) {
            return request.sendResponse(resultFactory.internalError(["#clientLoad not found"]));
        }
        else {
            var clientLoadArrayReturn = [];

            async.each(request.payload, function (clientLoad, callback) {
                if (!clientLoad.negotiableLoad) {
                    return callback(resultFactory.internalError(["#clientLoad.negotiableLoad not found"]));
                }
                if (!clientLoad.quantity) {
                    return callback(resultFactory.internalError(["#clientLoad.quantity not found"]));
                }
                if (!clientLoad.waterPercent) {
                    return callback(resultFactory.internalError(["#clientLoad.waterPercent not found"]));
                }
                if (!clientLoad.canalPercent) {
                    return callback(resultFactory.internalError(["#clientLoad.canalPercent not found"]));
                }
                if(typeof clientLoad.negotiableLoad == "object"){
                    clientLoad.negotiableLoad = clientLoad.negotiableLoad._id;
                }
                negotiableLoadCollection.findById(clientLoad.negotiableLoad, {isDeleted: false}, function (err, negotiableLoad) {
                    if (err) return callback(resultFactory.buildError(err));
                    else if (!negotiableLoad || negotiableLoad == null) return callback(resultFactory.internalError(["#negotiableLoad not found"]));
                    else {
                        clientLoad.negotiableLoad = negotiableLoad;
                        clientLoad.totalWaterLitersPerDay = 0;
                        clientLoad.totalCanalLitersPerDay = 0;
                        validator("ClientLoad", clientLoadDef, clientLoad, function (result) {
                            if (result.operationResult == 0) {
                                clientLoad.totalWaterLitersPerDay =
                                    clientLoad.negotiableLoad.litersPerDay * clientLoad.quantity * clientLoad.waterPercent / 100;
                                clientLoad.totalCanalLitersPerDay =
                                    clientLoad.negotiableLoad.litersPerDay * clientLoad.quantity * clientLoad.canalPercent / 100;
                                var model = clientLoadCollection(clientLoad);
                                clientLoadArrayReturn.push(model);
                                return callback();
                            }
                            else {
                                return callback(result);
                            }
                        });


                    }
                });


            }, function (err) {
                if (err) {
                    return request.sendResponse(err);
                } else {
                    return request.sendResponse(resultFactory.success(clientLoadArrayReturn));
                }
            });

        }
    });


    client.registerService();

});
