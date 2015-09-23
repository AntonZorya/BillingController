/**
 * Created by mac on 23.09.15.
 */
var OrientDB = require('orientjs');

var orientServer = OrientDB({
    host: '192.168.66.10',
    port: 2424,
    username: 'root',
    password: 'spear39'
});

module.exports = orientServer.use('BillingController');