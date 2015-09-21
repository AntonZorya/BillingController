/**
 * Created by mac on 21.09.15.
 */
var clientFactory = require("devir-mbclient");

var client = new clientFactory.core(clientFactory.netConnector, "192.168.66.174", "9009", function(isReconecting){

    console.log("Подключение установлено");

    client.registerRoute("/address/getAllByParentId", function(request){
        request.sendResponse({data: "data"});
    });


    client.registerRoute("/address/addAddressNode", function(request){
        request.sendResponse({data: "data"});
    });


    client.registerService();

});