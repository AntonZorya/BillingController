/**
 * Created by Alibek on 13.10.2015.
 */
var MongoClient = require('mongodb').MongoClient,
    assert = require("assert");


var MongoUrl = 'mongodb://192.168.66.27:27017/BillingControllerTest';

var DB;

MongoClient.connect(MongoUrl, function (err, db) {
    assert.equal(null, err);
    console.log('connect to mongodb');

    DB = db;


});

module.exports = DB;