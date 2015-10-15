/**
 * Created by Alibek on 13.10.2015.
 */
var mbClient = require("../common/mbConnection/netConnection");
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');

var client = mbClient(function (isRec) {
    //client.sendRequest("/balanceJur/create",
    //    {
    //        "balanceTypeId": new ObjectID("55cdf641fb777624231ab6d9"),
    //        "clientId": new ObjectID("560d69bc5c73fefc39f91a10"),
    //        "sum": -11997.83,
    //        "period": 201509,
    //        "date":  moment("2015-10-13T18:53:24.805+0000"),
    //        "userId": new ObjectID("5560b2b8f7906e1047f21700"),
    //
    //    }, function (err, data) {
    //        if (err)
    //            console.log(err);
    //        else
    //            console.log(data);
    //    }
    //)

    //client.sendRequest('/balanceJur/getByPeriodAndClientId', {clientId: '560d69bc5c73fefc39f91a10', period: 201509}, function(err, data) {
    //    if (err) {
    //        console.log(err);
    //    }
    //    else
    //    {
    //        if (data.result && data.result.length == 0)
    //         console.log(0);
    //        else
    //        {
    //            for (var i=0; i < data.result.length; i++)
    //            {
    //                console.log(data.result[i].sum);
    //            }
    //        }
    //    }
    //});

    client.sendRequest('/balanceJur/getById', {id: '561d3b73f92bd7a4507d95d5'}, function(err, data) {
       if (err) return console.log(err);
        console.log(data);
    });

});