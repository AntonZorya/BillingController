/**
 * Created by mac on 22.09.15.
 */
var clientFactory = require("devir-mbclient");
var OrientDB = require('orientjs');

var orientServer = OrientDB({
    host: '192.168.66.10',
    port: 2424,
    username: 'root',
    password: 'spear39'
});

var db = orientServer.use('BillingController');
