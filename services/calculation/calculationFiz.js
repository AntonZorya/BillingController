/**
 * Created by Alibek on 13.10.2015.
 */

var mbClient = require("../common/mbConnection/netConnection");
var moment = require('moment');
var resultFactory = require("../common/operations/resultFactory");
var ObjectID = require('mongodb').ObjectID;
var calcRepo = require('./dataLayer/repositories/calculationFizRepo');


var client = mbClient(function (isRec) {
    client.registerRoute('/fiz/calculations/create', function (request) {
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

    client.registerRoute('/fiz/calculations/byNorm', function(request) {

        var clientfiz = request.payload.client;
        var period = request.payload.period;

        client.sendRequest('/fiz/tariffs/getById', {id: request.payload.tariffId}, function (err, result) {
            if (err) return request.sendResponse(resultFactory.internalError(err));

            if (!result || !result.result) return request.sendResponse(resultFactory.internalError("#тариф не найлен"));
            var tariff = result.result;

            var waterCalcCubicMeters = clientfiz.norm * (clientfiz.waterPercent / 100);
            var canalCalcCubicMetersCount = clientfiz.norm * (clientfiz.canalPercent / 100);


            var waterSum = 0;
            var canalSum = 0;
            //if (counter.currentCounts > 0) {
            waterSum = waterCalcCubicMeters * tariff.water * -1;
            canalSum = canalCalcCubicMetersCount * tariff.canal * -1;
            //}

            var balanceId = new ObjectID();
            var balanceTypeId = new ObjectID('55cdf641fb777624231ab6d9'); // ??????????
            var balance = {
                _id: balanceId,
                balanceTypeId: balanceTypeId,
                clientId: new ObjectID(clientfiz.clientId),
                sum: waterSum + canalSum,
                period: period,
                //?????
                date: moment().toDate()
            };

            client.sendRequest('/fiz/balance/create', balance, function(err, data) {
                if (err) return console.log(err);
                console.log('clientId-' + clientfiz.clientId + ' balance by norm created');
            });

            var calculation = {
                _id: new ObjectID(),
                clientId: new ObjectID(clientfiz.clientId),
                pipelineId: null,
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
                date: moment().toDate(),
                userId: null,
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
