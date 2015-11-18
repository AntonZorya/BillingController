var async = require('async');
var mongodb = require('../common/dbConnection/mongo');
var db = mongodb.getDb();
var mongo = mongodb.mongo;
var gridfs = require('gridfs');
var gfs = gridfs(db, mongo);

var clientJur = db.collection('clientjurs');
var calcJur = db.collection('calculations');
var balanceJur = db.collection('balances');
var paymentJur = db.collection('paymentdetails');
var forfeitJur = db.collection('forfeitdetails');
var tariffs = db.collection('tariffs');

exports.getFile = function (fileId, callback) {
    gfs.readFile({
        _id: fileId
    }, callback);
};

exports.getInfoForFile = function (fileId, callback) {
    gfs.findOne({
        _id: fileId
    }, callback);
};

exports.writeFile = function (fileInfo, content, callback) {
    gfs.writeFile(fileInfo, content, callback);
};

exports.getClientJur = function (clientIdByPeriod, callback) {
    clientJur.findOne({_id: clientIdByPeriod}, callback);
};

exports.updateInvoiceInClientJur = function (clientIdByPeriod, invoiceId, callback) {
    clientJur.update({_id: clientIdByPeriod}, {$set: {invoiceId: invoiceId}}, {}, callback);
};

exports.getClientJurWithTariff = function (clientIdByPeriod, callback) {
    db.eval(function (clientIdByPeriod) {
        var result = db.clientjurs.findOne({_id: clientIdByPeriod});
        result.clientType.tariffId = db.tariffs.findOne({_id: result.clientType.tariffId});
        return result;
    }, clientIdByPeriod, {}, callback);
};

exports.getClientsIdByPeriod = function (period, limit, callback) {
    clientJur.find({isDeleted: false, period: period, invoiceId: {$exists: false}}).limit(limit).toArray(callback);
};

exports.getClientsIdByPeriodCount = function (period, callback) {
    db.eval(function (period) {
        return db.clientjurs.find({isDeleted: false, period: period}).count();
    }, period, {}, callback);
};

exports.getTariffForClient = function (tariffId, callback) {
    tariffs.findOne({_id: tariffId}, callback);
};

exports.getCalcsForClientJur = function (clientIdByPeriod, callback) {
    calcJur.find({clientJurId: clientIdByPeriod}).toArray(callback);
};

exports.getPaymentForClientJur = function (clientIdByPeriod, callback) {
    paymentJur.find({clientJurId: clientIdByPeriod}).toArray(callback);
};

exports.getForfeitForClientJur = function (clientIdByPeriod, callback) {
    forfeitJur.find({clientJurId: clientIdByPeriod}).toArray(callback);
};

exports.getBalanceForClientJur = function (clientIdByPeriod, callback) {
    balanceJur.find({clientJurId: clientIdByPeriod}).toArray(callback);
};

exports.getLastInvoiceNumber = function (callback) {
    gfs.find().sort({'metadata.number': -1}).limit(1).toArray(function (error, file) {
        if (error) {
            callback(error);
        } else {
            callback(file.metadata.number);
        }
    });
};