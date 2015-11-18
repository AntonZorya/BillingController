var docxTemplater = require('docxtemplater');
var fs = require('fs');

var unoconv = require('unoconv2');
unoconv.listen().stderr.on('data', function (data) {
    console.error(data);
});

var repo = require('./repo');

exports.createInvoiceForClient = createInvoiceForClient;

exports.createInvoiceByPeriod = createInvoiceByPeriod;

exports.getClientJurCountWithoutInvoiceId = function (period, callback) {
    repo.getClientsIdByPeriodCount(period, callback);
};

function createInvoiceByPeriod(templateId, period, callback) {
    var result = 0;
    var limit = 20;
    var errorsLimit = 5;
    repo.getClientsIdByPeriod(period, limit, function (error, clientIds) {
        if (error) {
            callback(error);
        } else {
            if (!clientIds || clientIds.length == 0) {
                callback(null, result);
            } else {
                async.each(clientIds, function (clientId, eachDone) {
                    createInvoiceForClient(templateId, clientId, function (error) {
                        if (error) {
                            eachDone(error);
                        } else {
                            result++;
                            eachDone();
                        }
                    });
                }, function (errors) {
                    if (errors && errrors.length > errorsLimit) {
                        callback(errors);
                    } else {
                        setTimeout(function() {
                            createInvoiceByPeriod(templateId, period, callback);
                        }, 0);
                    }
                });
            }
        }
    });
};

function createInvoiceForClient(templateId, clientIdByPeriod, callback) {
    createFilledInvoice(templateId, clientIdByPeriod, function (error, invoiceResult) {
        if (error) {
            callback(error);
        } else {
            repo.updateInvoiceInClientJur(clientIdByPeriod, result.invoiceId, function (error) {
                if (error) {
                    callback(error);
                } else {
                    callback(null, invoiceResult);
                }
            });
        }
    });
};

function createFilledInvoice(templateId, clientIdByPeriod, callback) {
    getObjForFilled(clientIdByPeriod, function (error, result) {
        if (error) {
            callback(error);
        } else {
            var objToFill = result;
            var fileName = result.fileName;
            gfs.readFile({
                _id: templateId
            }, function (error, bufTemplate) {
                if (error) {
                    callback(error);
                } else {
                    var docToFill = new docxTemplater(bufTemplate);
                    docToFill.setData(objToFill);
                    docToFill.render();

                    var resultBuffer = docToFill.getZip().generate({type: 'nodebuffer'});

                    var fileId = mongo.ObjectID();

                    fs.writeFile(config.tmpFilePath + fileId + '.docx', resultBuffer, {}, function (error) {
                        if (error) {
                            callback(error);
                        } else {
                            unoconv.convert(config.tmpFilePath + fileId + '.docx', 'pdf', function (error, result) {
                                if (error) {
                                    callback(error);
                                } else {
                                    gfs.writeFile({
                                        _id: fileId,
                                        filename: fileName + '.pdf'
                                    }, result, function (error, data) {
                                        if (error) {
                                            callback(error);
                                        } else {
                                            fs.unlink(config.tmpFilePath + fileId + '.docx', function (error) {
                                                if (error) {
                                                    callback(error);
                                                } else {
                                                    callback(null, {
                                                        clientIdByPeriod: clientIdByPeriod,
                                                        fileId: data._id
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function getObjForFilled(clientIdByPeriod, callback) {

    getClientAndBalances(clientIdByPeriod, function (error, result) {
        if (error) {
            callback(error);
        } else {
            var client = result.client;
            var calcs = result.calcs;
            var payments = result.payments;
            var forfeits = result.forfeits;
            var balances = result.balances;

            var date = new Date();
            date = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();

            result = {
                fileName: client.name + ' ' + clientIdByPeriod,
                invoiceNumber: '000000000',
                currentDate: date,
                contractNumber: client.accountNumber, // номер договора
                contractDate: client.contractDate, // дата заключения договра
                clientName: client.name, // наименование абонента
                address: client.address, // адрес абонента
                bin: client.bin, // бин абонента
                waterCubicMeters: '', // объем водоснабжения в текущем периоде
                canalCubicMeters: '', // объем сточных вод в текущем периоде
                waterTariff: client.clientType.tariffId.water,
                canalTariff: client.clientType.tariffId.canal,
                waterSumWithoutNDS: '',
                canalSumWithoutNDS: '',
                nds: 12,
                waterSumNDS: '',
                canalSumNDS: '',
                waterSum: '',
                canalSum: '',
                sumWithoutNDS: '',
                sumNDS: '',
                sum: '',
                signatory: '',
                pipelines: []
            };

            for (var calc in calcs) {
                result.waterCubicMeters += (calcs[calc].waterCubicMetersCount * 1).toFixed(2);
                result.canalCubicMeters += (calcs[calc].canalCubicMetersCount * 1).toFixed(2);
                result.waterSumWithoutNDS += (calcs[calc].waterSum * -1).toFixed(2);
                result.canalSumWithoutNDS += (calcs[calc].canalSum * -1).toFixed(2);
            }
            result.sumWithoutNDS = (result.waterSumWithoutNDS * 1 + result.canalSumWithoutNDS * 1).toFixed(2);

            result.waterSumNDS = (result.waterSumWithoutNDS * result.nds / 100).toFixed(2);
            result.canalSumNDS = (result.canalSumWithoutNDS * result.nds / 100).toFixed(2);
            result.sumNDS = (result.waterSumNDS * 1 + result.canalSumNDS * 1).toFixed(2);

            result.waterSum = (result.waterSumWithoutNDS * 1 + result.waterSumNDS * 1).toFixed(2);
            result.canalSum = (result.canalSumWithoutNDS * 1 + result.canalSumNDS * 1).toFixed(2);

            result.sum = (result.waterSum * 1 + result.canalSum * 1).toFixed(2);


            _.sortBy(client.pipelines, function (i1, i2) {
                return i1.waterPercent > i2.waterPercent;
            });
            client.pipelines.forEach(function (pipeline) {
                var counter = _.find(pipeline.counters, function (counter) {
                    return counter.isActive == true;
                });
                result.pipelines.push({
                    address: pipeline.address,
                    name: pipeline.description,
                    counterNumber: counter ? counter.counterNumber : null,
                    lastCounts: counter ? counter.lastCounts : null,
                    currentCounts: counter ? counter.currentCounts : null,
                    waterCubicMeters: counter ? counter.currentCounts - counter.lastCounts : null
                });
            });
            callback(null, result);
        }
    });
}

function getClientAndBalances(clientIdByPeriod, callback) {
    var result;
    async.parallel([
        function (parallelDone) {
            repo.getClientJurWithTariff(clientIdByPeriod, function (error, result) {
                if (error) {
                    parallelDone(error);
                } else {
                    result.client = result;
                    parallelDone();
                }
            });
        }, function (parallelDone) {
            repo.getCalcsForClientJur(clientIdByPeriod, function (error, result) {
                if (error) {
                    parallelDone(error);
                } else {
                    result.calcs = result;
                    parallelDone();
                }
            });
        }, function (parallelDone) {
            repo.getPaymentForClientJur(clientIdByPeriod, function (error, result) {
                if (error) {
                    parallelDone(error);
                } else {
                    result.payments = result;
                    parallelDone();
                }
            });
        }, function (parallelDone) {
            repo.getForfeitForClientJur(clientIdByPeriod, function (error, result) {
                if (error) {
                    parallelDone(error);
                } else {
                    result.forfeits = result;
                    parallelDone();
                }
            });
        }, function (parallelDone) {
            repo.getBalanceForClientJur(clientIdByPeriod, function (error, result) {
                if (error) {
                    parallelDone(error);
                } else {
                    result.balances = result;
                    parallelDone();
                }
            });
        }
    ], function (errors) {
        if (errors && errors.length > 0) {
            callback(errors);
        } else {
            callback(null, result);
        }
    });
}