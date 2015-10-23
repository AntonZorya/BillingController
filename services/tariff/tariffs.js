/**
 * Created by Alibek on 15.10.2015.
 */
var db = require('../common/dbConnection/mongo').getDb();
var mbClient = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");
var ObjectID = require('mongodb').ObjectID;



var client = mbClient(function(isRec) {

    client.registerRoute('/jur/tariffs/getById', function(request) {

        db.collection('tariffs').find({_id: new ObjectID(request.payload.id)}).limit(1).toArray(function(err, data) {
           if (err) return request.sendResponse(resultFactory.internalError(err));
            if (data && data.length > 0)
                return request.sendResponse(resultFactory.success( data[0]));
            else
                return request.sendResponse(resultFactory.success(null));

        });

    });

    client.registerService();


});