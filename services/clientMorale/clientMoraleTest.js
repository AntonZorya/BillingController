/**
 * Created by vaio on 23.09.2015.
 */
var mbClient = require("../common/mbConnection/netConnection");
var async = require("async");
var db = require('../common/dbConnection/orientDB');
var sqlBuilder = require("../common/sql/sqlBuilder");

var client = mbClient(function (isReconnecting) {

    //var clientMoraleId = "";
    //
    //async.series([
    //        function (callback) {
    //            client.sendRequest("/clientMorale/create", {
    //                IINBIN: "010101010101010", addressText: "Астана",
    //                organizationName: "ТОО Девир", rnn: "0101"
    //            }, function (err, data) {
    //                if (err) console.log(err);
    //                else {
    //                    console.log(data);
    //                    clientMoraleId = data.result;
    //                }
    //                callback(null, 'one');
    //            });
    //
    //        },
    //        function (callback) {
    //            client.sendRequest("/clientMorale/getById", clientMoraleId, function (err, data) {
    //                if (err) console.log(err);
    //                else console.log(data);
    //                callback(null, 'two');
    //            });
    //        }
    //    ],
    //    function (err, results) {
    //        console.log("Series Finished!!!");
    //        // results is now equal to ['one', 'two']
    //    });



    db.query(' select organizationName, IINBIN, in("pipline_to_client") from (traverse in("pipline_to_client") from #17:6825) where $depth<1', {}).then(function(result){
        console.log(result);
    });

    client.sendRequest("/clientMorale/searchByKey", {searchKey:'01',period:201509}, function (err, data) {
        if (err) console.log(err);
        else console.log(data);
    });

    //client.sendRequest("/clientMorale/getById", "#17:6825", function (err, data) {
    //    if (err) console.log(err);
    //    else console.log(data);
    //});

    //var array = 10000;
    //
    //
    //async.whilst(
    //    function () { return array > 0; },
    //    function (callback) {
    //        array--;
    //
    //        client.sendRequest("/clientMorale/create", {
    //            IINBIN: "010101010101010", addressText: "Астана"+array,
    //            organizationName: "ТОО Девир"+array, rnn: "0101_"+array, period: "#18:1", accountNumber: array
    //        }, function (err, data) {
    //            if (err) console.log(err);
    //            else {
    //                console.log(data);
    //            }
    //            callback();
    //        });
    //
    //    },
    //    function (err) {
    //        console.log("FINISHED!!!");
    //    }
    //);






});