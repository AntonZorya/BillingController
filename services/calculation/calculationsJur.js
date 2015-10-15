/**
 * Created by Alibek on 13.10.2015.
 */

var mbClient = require("../common/mbConnection/netConnection");
var moment = require('moment');
var resultFactory = require("../common/operations/resultFactory");
var ObjectID = require('mongodb').ObjectID;
var calcRepo = require('./dataLayer/repositories/calculationJurRepo');


var client = mbClient(function (isRec) {
    client.registerRoute('/jur/calculations/create', function (request) {
        calcRepo.add(request.payload, function(err, data) {
           if (err) return request.sendResponse(resultFactory.internalError(err));
            return request.sendResponse(resultFactory.success(data));
        });
    });

    //client.registerRoute('/jur/calculations/getById', function (request) {
    //    db.collection('calculations').find({_id: new ObjectID(request.payload.id)}).limit(1).toArray(function (err, data) {
    //        if (err) request.sendResponce(resultFactory.internalError(err));
    //        else {
    //            var res = null;
    //            if (data && data.length > 0)
    //                res = data[0];
    //            request.sendResponse(resultFactory.success(res));
    //
    //        }
    //        db.close();
    //    })
    //});
    //
    //client.registerRoute('/jur/calculations/getByClientIdAndPeriod', function (request) {
    //    db.collection('calculations').find({
    //        clientId: new ObjectID(request.payload.clientId),
    //        period: request.payload.period,
    //        isDeleted: false
    //    }).toArray(function (err, data) {
    //        if (err) request.sendResponce(resultFactory.internalError(err));
    //        else request.sendResponce(resultFactory.success(data));
    //        db.close();
    //    });
    //});
    //
    //
    //client.registerRoute('/jur/calculations/update', function (request) {
    //    var model = request.payload;
    //    if (model._id)
    //        model._id = new ObjectId(model._id);
    //    if (model.clientId)
    //        model.clientId = new ObjectID(model.clientId);
    //    if (model.pipelineId)
    //        model.pipelineId = new ObjectID(model.pipelineId);
    //    if (model.counterId)
    //        model.counterId = new ObjectID(model.counterId);
    //    if (model.balanceId)
    //        model.balanceId = new ObjectID(model.balanceId);
    //    if (model.date)
    //        model.date = moment(model.date).format('YYYY-MM-DD HH:mm:ss');
    //    if (model.userId)
    //        model.userId = new ObjectID(model.userId);
    //    db.collection('calculations').updateOne({_id: model._id}, model, {upsert: false}, function (err, data) {
    //        if (err) request.sendResponce(resultFactory.internalError(err));
    //        else request.sendResponce(resultFactory.success(data));
    //        db.close();
    //    });
    //});

    client.registerRoute('/jur/calculations/byNormPipeline', function(request) {

        var pipeline = request.payload.pipeline;
        var clientId = request.payload.clientId;
        var period = request.payload.period;
        var userId = request.payload.userId;

        client.sendRequest('/jur/tariffs/getById', {id: request.payload.tariffId}, function (err, tariff) {
            if (err) return request.sendResponse(resultFactory.internalError(err));

            if (!tariff) return request.sendResponse(resultFactory.internalError("#тариф не найлен"));

            var waterCalcCubicMeters = pipeline.norm * (pipeline.waterPercent / 100);
            var canalCalcCubicMetersCount = pipeline.norm * (pipeline.canalPercent / 100);


            var waterSum = 0;
            var canalSum = 0;
            //if (counter.currentCounts > 0) {
            waterSum = waterCalcCubicMeters * tariff.water * -1;
            canalSum = canalCalcCubicMetersCount * tariff.canal * -1;
            //}

            var balanceId = new ObjectID();
            var balanceTypeId = '55cdf641fb777624231ab6d9'; // ??????????
            var balance = {
                _id: balanceId,
                balanceTypeId: balanceTypeId,
                clientId: clientId,
                sum: waterSum + canalSum,
                period: period,
                //?????
                date: moment()
            };

            client.sendRequest('/jur/balances/create', balance, function(err, data) {
               if (err) return console.log(err);
                console.log('clientId-' + clientId + ' balance by norm created');
            });

            var calculation = {
                clientId: clientId,
                pipelineId: pipeline._id,
                counterId: null,
                balanceId: balanceId,
                waterCubicMetersCount: waterCalcCubicMeters,
                canalCubicMetersCount: canalCalcCubicMetersCount,
                tariff: tariff,
                waterSum: waterSum,
                canalSum: canalSum,
                //??????? ?? ????????
                isShortage: false, //?????/???????,
                shortageCubicMeters: 0, //??????? ?3,
                shortageSum: 0, //??????? ??
                period: period,
                //?????
                date: moment(),
                userId: userId,
                calculationType: 2
            };

            calcRepo.add(calculation, function(err, data) {
                if (err) return request.sendResponse(resultFactory.internalError(err));
                return request.sendResponse(resultFactory.success(data));
            });

        });
    });

    client.registerService();

});