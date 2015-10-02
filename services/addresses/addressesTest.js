/**
 * Created by mac on 21.09.15.
 */

var clientFactory = require("devir-mbclient");
var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function(isReconecting) {
    //client.sendRequest("/address/add", {
    //    name:"Самал",
    //    parentId: "560a289f5d686ed818ffa88f",
    //    addressTypeId: "560a298a5d686ed818ffa890"
    //}, function(err,data){
    //    if(err) { console.log("errOR"); console.log(err);}
    //    else { console.log("daTA"); console.log(data);}
    //});
    //client.sendRequest("/address/add", {
    //    name:"Целинный",
    //    parentId: "560a289f5d686ed818ffa88e",
    //    addressTypeId: "560a298a5d686ed818ffa890"
    //}, function(err,data){
    //    if(err) { console.log("errOR"); console.log(err);}
    //    else { console.log("daTA"); console.log(data);}
    //});

    //client.sendRequest("/addressType/add", {
    //    name:"Микрорайон",
    //    shortName: "мкрн.",
    //    parentIdList: ["5609253e96499ef8121b2fef"]
    //}, function(err,data){
    //    if(err) { console.log("errOR"); console.log(err);}
    //    else { console.log("daTA"); console.log(data);}
    //});


    client.sendRequest("/address/collectAllParents", {id:"5609278096499ef8121b2ff5"}, function(err,data){
        if(err) { console.log("errOR"); console.log(err);}
        else { console.log("daTA"); console.log(data);}
    });


});