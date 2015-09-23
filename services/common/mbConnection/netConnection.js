/**
 * Created by mac on 23.09.15.
 */
var clientFactory = require("devir-mbclient");
module.exports = function(onConnection, host, port) {
    return new clientFactory.core(clientFactory.netConnector, host?host:"localhost", port?port:"9009", onConnection);
}