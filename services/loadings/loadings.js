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
        if (!request.payload || !(request.payload instanceof Array)) {
            return request.sendResponse(resultFactory.internalError(["#clientLoad not found"]));
        }
        else {

            async.each(request.payload, function(clientLoadItem, callback){

                clientLoadItem.totalWaterLitersPerDay = 0;
                clientLoadItem.totalCanalLitersPerDay = 0;

                if(clientLoadItem.negotiableLoad){
                    negotiableLoadCollection.findById(clientLoadItem.negotiableLoad, {isDeleted: false}, function (err, negotiableLoad) {
                        if(!err && negotiableLoad && negotiableLoad!=null){
                            clientLoadItem.negotiableLoad = negotiableLoad._doc;
                            clientLoadItem.negotiableLoad.litersPerDay = parseInt(clientLoadItem.negotiableLoad.litersPerDay);
                            clientLoadItem.quantity = parseInt(clientLoadItem.quantity);
                            clientLoadItem.waterPercent = parseInt(clientLoadItem.waterPercent);
                            clientLoadItem.canalPercent = parseInt(clientLoadItem.canalPercent);
                            if(typeof clientLoadItem.negotiableLoad.litersPerDay == "number" && typeof clientLoadItem.quantity == "number" && typeof clientLoadItem.waterPercent == "number"){
                                clientLoadItem.totalWaterLitersPerDay =
                                    clientLoadItem.negotiableLoad.litersPerDay * clientLoadItem.quantity * clientLoadItem.waterPercent / 100;
                            }
                            if(typeof clientLoadItem.negotiableLoad.litersPerDay == "number" && typeof clientLoadItem.quantity == "number" && typeof clientLoadItem.canalPercent == "number"){
                                clientLoadItem.totalCanalLitersPerDay =
                                    clientLoadItem.negotiableLoad.litersPerDay * clientLoadItem.quantity * clientLoadItem.canalPercent / 100;
                            }
                        }
                        return callback();
                    });
                }

                else return callback();

            }, function (err) {
                //console.log(request.payload);
                if (err) {
                    return request.sendResponse(resultFactory.internalError([err]));
                } else {
                    validator("ClientLoad", clientLoadDef, {"clientLoadsArray":request.payload}, function (result) {
                        //console.log(result);
                        if (result.operationResult == 0) {

                            async.reduce(request.payload, {waterTotalNormPerDay:0,canalTotalNormPerDay:0}, function(memo, item, callback){
                                // pointless async:
                                process.nextTick(function(){
                                    if(item.totalWaterLitersPerDay && item.totalCanalLitersPerDay){
                                        memo.waterTotalNormPerDay = memo.waterTotalNormPerDay + item.totalWaterLitersPerDay;
                                        memo.canalTotalNormPerDay = memo.canalTotalNormPerDay + item.totalCanalLitersPerDay;
                                    }
                                    callback(null, memo);
                                });
                            }, function(err, result){
                                return request.sendResponse(resultFactory.success({clientLoads:request.payload, totals:result}));
                            });


                        }
                        else {
                            return request.sendResponse(result);
                        }
                    });
                }
            });

        }
    });


    client.registerService();

});
