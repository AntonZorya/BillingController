/**
 * Created by Alibek on 15.10.2015.
 */
var db = require('../../../common/dbConnection/mongo').getDb();
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');


exports.add = function(model, done) {
    if (!model._id)
        model._id = new ObjectID();
    else
        model._id = new ObjectID(model._id);
    if (model.clientId)
        model.clientId = new ObjectID(model.clientId);
    if (model.pipelineId)
        model.pipelineId = new ObjectID(model.pipelineId);
    if (model.counterId)
        model.counterId = new ObjectID(model.counterId);
    if (model.balanceId)
        model.balanceId = new ObjectID(model.balanceId);
    if (model.date)
        model.date = moment(model.date).toDate();
    if (model.userId)
        model.userId = new ObjectID(model.userId);
    model.createDateTime = moment().toDate();
    model.isDeleted = false;

    db.collection('calculationfizs').insertOne(model, function (err, data) {
        if (err)
            done(err);
        else done(null, data);
    });
}