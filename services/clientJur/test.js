var clientFactory = require("devir-mbclient");

var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function(isReconecting){

    console.log("Подключение установлено");

    client.sendRequest('/clientJur/getPeriods', { }, function(error, result){
        if (error){
            console.log('test.js/clientJur/getPeriods:', error);
        }else if (result.error){
            console.log('test.js/clientJur/getPeriods.result:', result.error);
        } else {
            console.log(result.result);
        }
    });

    client.sendRequest('/clientJur/getById', { clientJurId: '55fc1c54e23c0e84101d870f' }, function(error, result){
        if (error){
            console.log('test.js/clientJur/getById:', error);
        } else if (result.error){
            console.log('test.js/clientJur/getById.result:', result.error);
        } else {
            console.log(result);
        }
    });

    client.registerService();

});