/**
 * Created by Alibek on 14.10.2015.
 */
var db = require('../common/dbConnection/mongo');
var mbClient = require("../common/mbConnection/netConnection");
var moment = require('moment');
var ObjectID = require('mongodb').ObjectID;
require('underscore');


exports.getCurrentPeriod = function (done) {
    db.collection('periods')
        .find({isClosed: false}).sort({period: 1}).limit(1).toArray(function (err, data) {
            if (err) return done(err);

            if (data && data.length > 0) {
                return done(null, data[0]);
            }
            else {
                return done(null, null);
                var today = moment();
                var year = today.getFullYear();
                var month = today.getMonth() + 1;
                var period = year * 100 + month + 1;

                db.collection('periods').insertOne(
                    {
                        period: period,
                        year: year,
                        month: month,
                        calculations: 0,
                        payments: 0,
                        forfeit: 0,
                        sum: 0,
                        isClosed: false,
                        isDeleted: false,
                        createDateTime: today
                    }, function (err, data) {
                        if (err) return done(err);
                        return done(null, data);
                    });
            }

        });
}

exports.closePeriod = function (done) {
    exports.getCurrentPeriod(function (err, period) {
        if (err) return done(err);

        var today = moment();
        var newPeriod = _.clone(period);
        newPeriod._id = new ObjectID();
        if (period.month < 12) {
            newPeriod.month += newPeriod.month;
            newPeriod.period += newPeriod.period;
        }
        else {
            newPeriod.year += newPeriod.year;
            newPeriod.month = 1;
            newPeriod.period = newPeriod.year * 100 + newPeriod.month;
        }

        period.isClosed = true;
        db.updateOne({_id: period._id}, period, function (err, data) {
        });

        db.insertOne(newPeriod, function (err, data) {
        });

        db.collection('clientjurs').find({period: period.period, isDeleted: false}).toArray(function (docs) {
            _.each(docs, function (client) {
                client.period = newPeriod.period;
                _.each(client.pipelines, function (pipeline) {
                    if (_.some(pipeline.counters, function (value, index, list) {
                            return value.isActive;
                        })) {
                        pipeline.counters = _.without(pipeline.counters, _.find(pipeline.counters, function (counter) {
                            return counter.isActive == false;
                        }));
                    }
                    if (pipeline.sourceCounts == 2)
                    {
                        var payload = {
                            pipeline: pipeline,
                            clientId: client.clientId,
                            period:newPeriod.period,
                            tariffId: client.clientType.tariffId
                            };
                        client.sendRequest('/jur/calculations/byNormPipeline', payload, function(err, data) {
                           if (err) return console.log('client - ' + client.clientId + '  error: ' + err);
                            console.log('client - ' + client.clientId + '  calculatedByNorm');
                        });
                    }
                });
                db.insertOne({_id: client._id}, client, function(err, data){
                    if (err) return console.log('client ' + client.clientId + ': error add for new period: ' + err);
                    console.log('client - ' + client.clientId + '  added for new period');
                });

            });
            done();
        });


    });
}
