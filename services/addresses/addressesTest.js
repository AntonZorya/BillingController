/**
 * Created by mac on 21.09.15.
 */

var clientFactory = require("devir-mbclient");
var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function(isReconecting) {
    client.sendRequest("/address/getChildList", {
        //parentId:"560926c496499ef8121b2ff2",
        typeId: "5609253e96499ef8121b2fee"
    }, function(err,data){
        if(err) { console.log("errOR"); console.log(err);}
        else { console.log("daTA"); console.log(data);}
    });


});