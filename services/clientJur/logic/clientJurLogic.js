var _ = require('underscore');
var async = require('async');
var mongoose = require('mongoose');

var ClientJurRepo = rootRequire('data/repositories/clientJurRepo');
var clientJurValidator = rootRequire('/helpers/mongoose/validator');
var clientJurDefinition = rootRequire('/data/models/clientJur');

exports.getPeriods = function (done) {
    ClientJurRepo.getPeriods(function (result) {
        done(result);
    });
};

exports.getById = function (id, done) {
    ClientJurRepo.getById(id, function (result) {
        return done(result);
    });
};

exports.getAllByControllerId = function (ctrlId, done) {
    ClientJurRepo.getAllByCtrlId(ctrlId, function (data) {
        done(data);
    });
};

exports.add = function (clientJur, orgId, done) {

    clientJur.organizationId = orgId;
    clientJurValidator('clientJur', clientJurDefinition, clientJur, function (validationRes) {
        if (validationRes.operationResult == 0) {
            ClientJurRepo.add(clientJur, function (data) {
                done(data);
            });
        }
        else {
            done(validationRes);
        }
    });
};

exports.getAll = function (orgId, done) {
    ClientJurRepo.getAll(orgId, function (data) {
        done(data);
    });
};

exports.update = function (clientJur, done) {
    clientJurValidator('clientJur', clientJurDefinition, clientJur, function (validationRes) {
        if (validationRes.operationResult == 0) {

            for (var i = 0; i < clientJur.pipelines.length; i++)
                for (var j = 0; j < clientJur.pipelines[i].counters.length; j++) {
                    if (clientJur.pipelines[i].counters[j].isCounterNew)
                        clientJur.pipelines[i].counters[j].isCounterNew = false;
                }

            ClientJurRepo.update(clientJur, function (res) {
                return done(res);
            });
        }
        else {
            done(validationRes);
        }
    });
};

exports.sync = function (clientJurArr, done) {
    async.each(clientJurArr, function (clientJur, callback) {
        clientJurValidator('clientJur', clientJurDefinition, clientJur, function (validationRes) {
            if (validationRes.operationResult == 0) {
                ClientJurRepo.update(clientJur, function (res) {
                    return callback();
                });
            }
            else {
                callback();
            }
        });
    }, function () {
        done({operationResult: 0});
    });
};

exports.delete = function (id, done) {
    ClientJurRepo.delete(id, function (res) {
        return done(res);
    });
};

exports.search = function (searchTerm, period, user, done) {
    ClientJurRepo.search(searchTerm, period, user, function (res) {

        if(res.operationResult==0){
            async.each(res.result, function(client, callback){
                BalanceLogic.getTotalByClientJurId(client._doc._id, period, function(balancesRes){
                    client._doc.balances = balancesRes.result;
                    callback();
                });
            }, function(){
                return done(res);
            })
        } else {
            return done(res);
        }


    });
};

exports.updateClientCounter = function (body, userId, done) {

    if (body.withClear) {
        CalculationLogic.getByCounterId(body.counter._id, body.period, function (calcByCounterResp) {
            if (calcByCounterResp.operationResult === 0 && calcByCounterResp.result) {
                BalanceLogic.remove(calcByCounterResp.result._doc.balanceId, function (res) {
                    if (res.operationResult === 0) {
                        CalculationLogic.remove(calcByCounterResp.result._doc._id, function (res) {
                            if (res.operationResult === 0) {
                                ClientJurRepo.update(body.client, function (counterResp) {
                                    done(counterResp);
                                });
                            }
                        })
                    }
                });
            }
        });
        return;
    }

    var clientJur = body.client;
    var pipeline = body.pipeline;
    var counter = body.counter;
    var period = body.period;

    var tariff = {
        water: 0,
        canal: 0
    };

    TariffLogic.getById(clientJur.clientType.tariffId, function (tariffResp) {

        if (tariffResp.operationResult === 0)
            tariff = tariffResp.result;

        var waterCalcCubicMeters = 0;
        var canalCalcCubicMetersCount = 0;

        if (pipeline.sourceCounts != 2) {
            waterCalcCubicMeters = (counter.currentCounts - counter.lastCounts) * (pipeline.waterPercent / 100);
            canalCalcCubicMetersCount = (counter.currentCounts - counter.lastCounts) * (pipeline.canalPercent / 100);
        } else{
            waterCalcCubicMeters = pipeline.norm * (pipeline.waterPercent / 100);
            canalCalcCubicMetersCount = pipeline.norm * (pipeline.canalPercent / 100);
        }

        var waterSum = 0;
        var canalSum = 0;
        //if (counter.currentCounts > 0) {
        waterSum = waterCalcCubicMeters * tariff.water * -1;
        canalSum = canalCalcCubicMetersCount * tariff.canal * -1;
        //}

        var balanceId = mongoose.Types.ObjectId();
        var balanceTypeId = '55cdf641fb777624231ab6d9'; // начисление
        var balance = {
            _id: balanceId,
            balanceTypeId: balanceTypeId,
            clientJurId: clientJur._id,
            sum: waterSum + canalSum,
            period: period,
            //аудит
            date: new Date(),
            userId: userId
        };
        //без счетчика по среднему
        var balanceAvg = null;//в CalculationLogic идет проверка на null

        //добор/недобор
        var isShortage = false;
        var isShortageAvg = false;
        var shortageCubicMeters = 0;
        var shortageSum = 0;

        var calculation = {
            clientJurId: clientJur._id,
            pipelineId: pipeline._id,
            counterId: counter._id,
            balanceId: balanceId,
            waterCubicMetersCount: waterCalcCubicMeters,
            canalCubicMetersCount: canalCalcCubicMetersCount,
            tariff: tariff,
            waterSum: waterSum,
            canalSum: canalSum,
            //считаем от минимума
            isShortage: isShortage, //добор/недобор,
            shortageCubicMeters: shortageCubicMeters, //недобор м3,
            shortageSum: shortageSum, //недобор тг
            period: period,
            //аудит
            date: new Date(),
            userId: userId,
            calculationType: 0 //0 - по счетчику, 1 - по среднему,
        };
        var calculationAvg = null;//без счетчика по среднему, в CalculationLogic идет проверка на null
        var minConsumption = clientJur.clientType.minConsumption;

        //находим предыдущие показания в этом периоде
        CalculationLogic.getByCounterId(counter._id, period, function (calcByCounterResp) {
            //если показания есть, то обновляем
            if (calcByCounterResp.operationResult === 0 && calcByCounterResp.result) {
                var calcRes = calcByCounterResp.result._doc;
                balance._id = calcRes.balanceId;
                calculation._id = calcRes._id;
                calculation.balanceId = calcRes.balanceId;

                BalanceLogic.update(balance, function (balanceResp) {
                    CalculationLogic.update(calculation, function (calcResp) {
                        ClientJurRepo.update(clientJur, function (counterResp) {
                            done(counterResp);
                        });
                    });
                });

            } else {//иначе добавляем новые показания

                //расчет по "среднему" - когда старый счетчик снимался и "ввод" был без счетчика определенное кол-во времени
                var previousCounterIndex = pipeline.counters.length - 2;

                if (previousCounterIndex > 0 && !counter.isPrevAvgCalculated) {

                    for (var i = 0; i < clientJur.pipelines.length; i++)
                        for (var j = 0; j < clientJur.pipelines[i].counters.length; j++) {
                            if (clientJur.pipelines[i].counters[j]._id === counter._id) {
                                clientJur.pipelines[i].counters[j].isPrevAvgCalculated = true;
                            }
                        }

                    var prevDate = pipeline.counters[previousCounterIndex].dateOfCurrentCounts;
                    var currentDate = counter.dateOfCurrentCounts;
                    //кол-во дней без счетчика
                    var daysDifferenceCount = 0;
                    if (currentDate && prevDate) {
                        currentDate = new Date(currentDate);
                        prevDate = new Date(prevDate);
                        daysDifferenceCount = currentDate.getDate() - prevDate.getDate();
                        var avgCountsPerMonth = pipeline.avg;

                        var year = prevDate.getFullYear();
                        var month = prevDate.getMonth() + 1;
                        //узнаем кол-во дней в месяце, найдя последний день месяца
                        var lastDayOfMonth = new Date(year, month, 0).getDate();
                        //среднее за день (м3)
                        var avgCountsPerDay = avgCountsPerMonth / lastDayOfMonth;
                        var avgCountsByPeriod = avgCountsPerDay * daysDifferenceCount;
                        var waterCount = avgCountsByPeriod * (pipeline.waterPercent / 100); //м3
                        var canalCount = avgCountsByPeriod * (pipeline.canalPercent / 100); //м3
                        var avgWaterSum = avgCountsByPeriod * waterCount * tariff.water * -1;
                        var avgCanalSum = avgCountsByPeriod * canalCount * tariff.canal * -1;

                        //
                        var balanceIdForAvg = mongoose.Types.ObjectId();
                        balanceAvg = {};
                        balanceAvg = _.extend(balanceAvg, balance);
                        balanceAvg._id = balanceIdForAvg;
                        balanceAvg.sum = avgWaterSum + avgCanalSum;

                        calculationAvg = {};
                        calculationAvg = _.extend(calculationAvg, calculation);
                        calculationAvg.counterId = null; //без счетчика
                        calculationAvg.balanceId = balanceIdForAvg;
                        calculationAvg.waterCubicMetersCount = waterCount;
                        calculationAvg.canalCubicMetersCount = canalCount;
                        calculationAvg.waterSum = avgWaterSum;
                        calculationAvg.canalSum = avgCanalSum;
                        calculationAvg.calculationType = 1; //0 - по счетчику, 1 - по среднему,
                        calculationAvg.daysCountByAvg = daysDifferenceCount;

                        if (minConsumption) {
                            isShortageAvg = calculationAvg.waterCubicMetersCount < calculationAvg.minConsumption;
                            if (isShortageAvg) {
                                calculationAvg.shortageCubicMeters = minConsumption ? minConsumption - calculationAvg.waterCubicMetersCount : 0;
                                calculationAvg.shortageSum = calculationAvg.shortageCubicMeters * tariff.water;
                            }
                        }

                    }
                }


                if (minConsumption) {

                    isShortage = calculation.waterCubicMetersCount < calculation.minConsumption;
                    if (isShortage) {
                        calculation.shortageCubicMeters = minConsumption ? minConsumption - calculation.waterCubicMetersCount : 0;
                        calculation.shortageSum = calculation.shortageCubicMeters * tariff.water;
                    }
                }

                BalanceLogic.addMany([balanceAvg, balance], function (balanceAvgResp) {
                    if (balanceAvgResp.operationResult === 0) {
                        CalculationLogic.addMany([calculationAvg, calculation], function (calculationAvgResp) {
                            if (calculationAvgResp.operationResult === 0) {
                                ClientJurRepo.update(clientJur, function (counterResp) {
                                    done(counterResp);
                                });
                            } else {
                                console.log('Ошибка вставки в коллекцию calculations');
                            }
                        });
                    } else {
                        console.log('Ошибка вставки в коллекцию balances');
                    }

                });
            }

        });


    });

};

