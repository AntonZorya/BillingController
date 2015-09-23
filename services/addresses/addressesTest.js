/**
 * Created by mac on 21.09.15.
 */

var clientFactory = require("devir-mbclient");
var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function(isReconecting) {
        client.sendRequest("/address/getAddressByParentId", {parentId: "#12:0", parentTypeId: "#13:2"}, function(err,data){
            if(err) console.log(err);
             else console.log(data);
        });


});