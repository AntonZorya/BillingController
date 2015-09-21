/**
 * Created by mac on 21.09.15.
 */

var mbCore = require("devir-mbserver");


var core = new mbCore.core();
core.registerConnector(mbCore.netConnector, 9009);
core.registerConnector(mbCore.netConnector, 9010);
core.registerConnector(mbCore.netConnector, 9011);