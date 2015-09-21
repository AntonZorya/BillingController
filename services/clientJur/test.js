var clientFactory = require("devir-mbclient");

var client;
client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function (isReconecting) {

    console.log("Подключение установлено");

    setTimeout(function () {
        client.sendRequest('/clientJur/getPeriods', {}, function (error, result) {
            if (error) {
                console.log('test.js/clientJur/getPeriods:', error);
            } else if (result.operationResult != 0) {
                console.log('test.js/clientJur/getPeriods.result:', result.result);
            } else {
                console.log(result.result);
            }
        });
    });

    setTimeout(function () {
        client.sendRequest('/clientJur/getById', {clientJurId: '55fc1c54e23c0e84101d870f'}, function (error, result) {
            if (error) {
                console.log('test.js/clientJur/getById:', error);
            } else if (result.operationResult != 0) {
                console.log('test.js/clientJur/getById.result:', result.result);
            } else {
                console.log(result.result.name);
            }
        });
    }, 10);

    setTimeout(function () {
        client.sendRequest('/clientJur/getByCtrlId', {controllerId: '55fbd872cacab3a4132b387f'}, function (error, result) {
            if (error) {
                console.lof('tets.js/clientJur/getByCtrlId:', error);
            } else if (result.operationResult != 0) {
                console.log('test.js/clientJur/getByCtrlId.result:', result.result);
            } else {
                console.log(result.result.length);
            }
        });
    }, 20);

    client.registerService();

});