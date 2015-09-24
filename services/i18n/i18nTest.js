/**
 * Created by mac on 24.09.15.
 */
var mbClient = require("../common/mbConnection/netConnection");
var async = require("async");
var moment =require('moment');




var client = mbClient(function(isReconnecting) {

    client.sendRequest("/i18n/getByLangCode", {id: "sdfsdf"}, function(err,data){
        if(err) { console.log("Error:"); console.log(err); }
        else{
            console.log(data);
        }
    });


    client.sendRequest("/i18n/getByLangCode", {id: "HUI!!!!"}, function(err,data){
        if(err) { console.log("Error:"); console.log(err); }
        else{
            console.log(data);
        }
    });


});