var clientFactory = require("devir-mbclient");

var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function(isReconecting){

    console.log("Подключение установлено");

    client.registerRoute("/address/getAllByParentId", function(request){
        console.log(request.payload.req);
        request.sendResponse({hui: "na"});
    });


    client.registerRoute("/address/addAddressNode", function(request){
        request.sendResponse({data: "data"});
    });


    client.registerService();

});