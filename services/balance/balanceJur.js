/**
 * Created by Alibek on 12.10.2015.
 */
var db = require('../common/dbConnection/mongo');
var mbClient = require("../common/mbConnection/netConnection");
var moment = require('moment');
var resultFactory = require("../common/operations/resultFactory");
var ObjectID = require('mongodb').ObjectID;


var client = mbClient(function (isReconnecting) {

    client.registerRoute("/jur/balance/create", function (request) {
        var model = request.payload;
        if (model._id)
            model._id = new ObjectID(model._id);
        else
            model._id = new ObjectID();
        if (model.clientId)
            model.clientId = new ObjectID(model.clientId);
        if (model.counterId)
            model.counterId = new ObjectID(model.counterId);
        if (model.balanceTypeId)
            model.balanceTypeId = new ObjectID(model.balanceTypeId);
        if (model.userId)
            model.userId = new ObjectID(model.userId);
        model.isDeleted = false;
        model.createDateTime = moment();


        db.collection("balances").insertOne(model, function (err, data) {
            if (err)
                request.sendResponse(resultFactory.internalError(err));
            else request.sendResponse(resultFactory.success(data));
        });
    });

    client.registerRoute('/jur/balance/getByPeriodAndClientId', function (request) {
        db.collection('balances').find({
            clientId: new ObjectID(request.payload.clientId),
            period: request.payload.period,
            isDeleted: false
        }).toArray(function (err, data) {
            if (err) request.sendResponse(resultFactory.internalError(err));
            else request.sendResponse(resultFactory.success(data));
        });
    });


    client.registerRoute('/jur/balance/getById', function (request) {
        db.collection('balances').find({_id: new ObjectID(request.payload.id)}).limit(1).toArray(function (err, data) {
            if (err) request.sendResponce(resultFactory.internalError(err));
            else {
                var res = null;
                if (data && data.length > 0)
                    res = data[0];
                request.sendResponse(resultFactory.success(res));

            }
        })
    });

    client.registerRoute('/jur/balance/update', function (request) {
        var model = request.payload;
        if (model._id)
            model._id = new ObjectID();
        if (model.clientId)
            model.clientId = new ObjectID(model.clientId);
        if (model.counterId)
            model.counterId = new ObjectID(model.counterId);
        if (model.balanceTypeId)
            model.balanceTypeId = new ObjectID(model.balanceTypeId);
        if (model.userId)
            model.userId = new ObjectID(model.userId);

        db.collection('balances').updateOne({_id: model._id}, model, {upsert: false}, function (err, data) {
            if (err) request.sendResponce(resultFactory.internalError(err));
            else request.sendResponce(resultFactory.success(data));
        });


    });

    client.registerService();

});