/**
 * Created by Alibek on 14.10.2015.
 */
/**
 * Created by Alibek on 13.10.2015.
 */
var db = require('../common/dbConnection/mongo');
var mbClient = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");
var ObjectID = require('mongodb').ObjectID;
var periodLogic = require('./logicLayer/periodLogic');

var client = mbClient(function (isRec) {

    client.registerRoute('/period/closePeriod', function (request) {
        periodLogic.closePeriod(function(){
           request.sendResponse(resultFactory.success());
        });
    });


});