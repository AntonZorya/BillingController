/**
 * Created by Alibek on 13.10.2015.
 */

var db;
var assert = require("assert");
var mongo = require('mongodb');
var cfg =
{
    db: 'BillingController',
    host: '192.168.66.27',
    port: '27017',
    opts:{
        "auto_reconnect": true,
        "safe": true
    }
}



module.exports.getDb = function() {
    if (!db) {
        db = new mongo.Db(cfg.db,
            new mongo.Server(cfg.host, cfg.port, cfg.opts),
            {native_parser: false, safe:true});
        db.open(function() {});
        return db;
    }
    return db;
};













