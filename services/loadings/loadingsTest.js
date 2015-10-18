/**
 * Created by vaio on 12.10.2015.
 */

var clientFactory = require("devir-mbclient");
var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function (isReconecting) {

    //client.sendRequest("/loadings/loadUnit/add", {
    //    name:"1житель/сутки"
    //}, function(err,data){
    //    if(err) { console.log("errOR"); console.log(err);}
    //    else { console.log("daTA"); console.log(data);}
    //});

    //client.sendRequest("/loadings/negotiableLoad/add", {
    //    name: "Куры утки гуси",
    //    loadUnit: "561ccba8d50bfdf01bde3fb4",
    //    litersPerDay: 200
    //}, function(err,data){
    //    if(err) { console.log("errOR"); console.log(err);}
    //    else { console.log("daTA"); console.log(data);}
    //});

    client.sendRequest("/loadings/clientLoad/validate",
        [
            {
                negotiableLoad: "561ccc385f2b56601ffb536e",
                quantity: 2,
                waterPercent: 100,
                canalPercent: 102,
                asd: "asd"
            }
        ]
    , function (err, data) {
        if (err) {
            console.log("errOR");
            console.log(err);
        }
        else {
            console.log("daTA");
            console.log(data);
            console.log(data.result[0].negotiableLoad);

            data.result[0].quantity = 4;
            client.sendRequest("/loadings/clientLoad/validate",
                data.result
                , function (err, data) {
                    if (err) {
                        console.log("errOR");
                        console.log(err);
                    }
                    else {
                        console.log("daTA");
                        console.log(data);


                    }
                });
        }
    });

    //client.sendRequest("/loadings/negotiableLoad/getAllOrGroup",
    //    {}
    //    , function (err, data) {
    //        if (err) {
    //            console.log("errOR");
    //            console.log(err);
    //        }
    //        else {
    //            console.log("daTA");
    //            console.log(data);
    //        }
    //    });


});