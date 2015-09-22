/**
 * Created by mac on 21.09.15.
 */

var clientFactory = require("devir-mbclient");
var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function(isReconecting) {
        client.sendRequest("/address/getAllByParentId", {parentId: "#12:0"}, function(err,data){
            if(err) console.log(err);
             else console.log(data);
        });


        client.sendRequest("/address/getFullTextById", {id: "#12:3"}, function(err,data){
            if(err) console.log(err);
            else console.log(data);
        });

});