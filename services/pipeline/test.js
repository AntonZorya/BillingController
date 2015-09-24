var clientFactory = require("devir-mbclient");
var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function (isReconecting) {
    //client.sendRequest("/pipeline/add", {
    //    pipeline: {
    //        number: '2',
    //        description: '#discription',
    //        isActive: true,
    //        createDate: '2015-10-24',
    //        waterPercent: 100,
    //        canalPercent: 100
    //    },
    //    pipeline_to_client:{},
    //    clientId: '#17:6'
    //}, function (err, data) {
    //    if (err) console.log(err);
    //    else console.log(data);
    //});

    client.sendRequest('/pipeline/remove', '#19:0', function (error, response) {
        console.log(response);
    });

});