/**
 * Created by Alibek on 14.10.2015.
 */
var db = require('../../common/dbConnection/mongo').getDb();
var mbClient = require("../../common/mbConnection/netConnection");
var moment = require('moment');
var ObjectID = require('mongodb').ObjectID;
var _ = require('underscore');
var async = require('async');
var mclient = mbClient(function(isRec) { });

exports.getCurrentPeriod = function (done) {


    var periods = db.collection('periods')
        .find({isClosed: false}).sort({period: 1}).limit(1).toArray(
        function (err, periods) {
            if (periods && periods.length > 0) {
                return done(null, periods[0]);
            }
            else {
                var today = moment();
                var year = today.year();
                var month = today.month() + 1;
                var period = year * 100 + month + 1;
                var newPeriod = {
                    _id: new ObjectID(),
                    period: period,
                    year: year,
                    month: month,
                    calculations: 0,
                    payments: 0,
                    forfeit: 0,
                    sum: 0,
                    isClosed: false,
                    isDeleted: false,
                    createDateTime: new Date(new Date().toUTCString())
                };
                db.collection('periods').insert(newPeriod
                    , function (err, data) {
                        if (err) return done(err);
                        return done(null, data.ops[0]);
                    });
            }
        }
    );


}

exports.closePeriod = function (done) {
    console.log(moment().format('dd.MM.yyyy HH:mm') + ' close period begin');
    exports.getCurrentPeriod(function (err, period) {
        if (err) return done(err);
        var newPeriod = _.clone(period);
        newPeriod._id = new ObjectID();
        if (period.month < 12) {
            newPeriod.month += 1;
            newPeriod.period += 1;
        }
        else {
            newPeriod.year += 1;
            newPeriod.month = 1;
            newPeriod.period = newPeriod.year * 100 + newPeriod.month;
        }

        period.isClosed = true;
        db.collection('periods').updateOne({_id: period._id}, period, function (err, data) {
            if (err) console.log('error update period: ' + err);
        });

        db.collection('periods').insertOne(newPeriod, function (err, data) {
            if (err) console.log('error insert new period: ' + err);
        });

        db.collection('clientjurs').find({period: period.period, isDeleted: false}).toArray(function (err, docs) {
            async.each(docs, function (client) {
                var newClient = _.clone(client);
                newClient._id = new ObjectID();
                newClient.period = newPeriod.period;
                newClient.createDateTime = moment().toDate();
                _.each(newClient.pipelines, function (pipeline) {
                    if (_.some(pipeline.counters, function (value, index, list) {
                            return value.isActive;
                        })) {
                        pipeline.counters = _.without(pipeline.counters, _.find(pipeline.counters, function (counter) {
                            return counter.isActive == false;
                        }));
                    }
                    if (pipeline.sourceCounts == 2) {
                        var payload = {
                            pipeline: pipeline,
                            clientId: newClient.clientId,
                            period: newPeriod.period,
                            tariffId: newClient.clientType.tariffId
                        };

                        mclient.sendRequest('/jur/calculations/byNormPipeline', payload, function (err, data) {
                            if (err) return console.log('client - ' + newClient.clientId + '  error: ' + err);
                            console.log('client - ' + newClient.clientId + '  calculatedByNorm');
                        });
                    }
                });
                db.collection('clientjurs').insert(newClient, function (err, data) {
                    if (err) return console.log('client ' + newClient.clientId + ': error add for new period: ' + err);
                    console.log('client - ' + newClient.clientId + '  added for new period');
                });

            });
            console.log(moment().format('dd.MM.yyyy HH:mm') + ' close period finished');
            done();
        });


    });
}
