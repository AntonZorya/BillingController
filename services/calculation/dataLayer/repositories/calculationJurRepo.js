/**
 * Created by Alibek on 15.10.2015.
 */
var db = require('../common/dbConnection/mongo');


exports.add = function(model, done) {
    
    if (model.clientId)
        model.clientId = new ObjectID(model.clientId);
    if (model.pipelineId)
        model.pipelineId = new ObjectID(model.pipelineId);
    if (model.counterId)
        model.counterId = new ObjectID(model.counterId);
    if (model.balanceId)
        model.balanceId = new ObjectID(model.balanceId);
    if (model.date)
        model.date = moment(model.date);
    if (model.userId)
        model.userId = new ObjectID(model.userId);
    model.createDateTime = moment();
    model.isDeleted = false;

    db.collection('calculations').insertOne(model, function (err, data) {
        if (err)
            done(err);
        else done(null, data);
    });
}