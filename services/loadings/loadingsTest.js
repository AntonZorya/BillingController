/**
 * Created by vaio on 12.10.2015.
 */

var clientFactory = require("devir-mbclient");
var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function (isReconecting) {

    //client.sendRequest("/loadings/loadUnit/add", {
    //    name:"1 авто в сутки"
    //}, function(err,data){
    //    if(err) { console.log("errOR"); console.log(err);}
    //    else { console.log("daTA"); console.log(data);}
    //});

    //client.sendRequest("/loadings/negotiableLoad/add", {
    //    name: "Мотоциклы, принадлежащие гражданам",
    //    loadUnit: "5625d9a9d43f1d4813f92f17",
    //    litersPerDay: 15,
    //    groupNumber: 2
    //}, function(err,data){
    //    if(err) { console.log("errOR"); console.log(err);}
    //    else { console.log("daTA"); console.log(data);}
    //});

    client.sendRequest("/loadings/clientLoad/validate",
        [
            {"negotiableLoad":"5625daccd43f1d4813f92f1a","quantity":1,"waterPercent":200,"canalPercent":100},
            {"negotiableLoad":"5625dcaad43f1d4813f92f24","quantity":2,"waterPercent":200,"canalPercent":100},
            {"negotiableLoad":"5625dd20d43f1d4813f92f26","quantity":3,"waterPercent":200,"canalPercent":100},
            {"negotiableLoad":"5625dd64d43f1d4813f92f28","quantity":4,"waterPercent":200,"canalPercent":100},
            {"negotiableLoad":"5625dd91d43f1d4813f92f2a","quantity":5,"waterPercent":200,"canalPercent":100},
            {"negotiableLoad":"5625ddf0d43f1d4813f92f2c","quantity":6,"waterPercent":200,"canalPercent":100},
            {"negotiableLoad":"5625de47d43f1d4813f92f2e","quantity":7,"waterPercent":200,"canalPercent":100}
        ]
        , function (err, data) {
        if (err) {
            console.log("errOR");
            console.log(err);
        }
        else {
            console.log("daTA");
            console.log(data);
            //console.log("---------------------------------");
            //console.log(data.result[0].negotiableLoad);
            //console.log("---------------------------------");
            //console.log(data.result[1].negotiableLoad);
            //console.log("---------------------------------");
            //console.log(data.result[2].negotiableLoad);
            //console.log("---------------------------------");
            //console.log(data.result[3].negotiableLoad);
            //console.log("---------------------------------");
            //console.log(data.result[4].negotiableLoad);
            //console.log("---------------------------------");
            //console.log(data.result[5].negotiableLoad);
            //console.log("---------------------------------");
            //console.log(data.result[6].negotiableLoad);

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