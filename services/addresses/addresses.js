var clientFactory = require("devir-mbclient");
var OrientDB = require('orientjs');

var orientServer = OrientDB({
    host: '192.168.66.10',
    port: 2424,
    username: 'root',
    password: 'spear39'
});

var db = orientServer.use('Addresses');

var client = new clientFactory.core(clientFactory.netConnector, "localhost", "9009", function(isReconecting){

    console.log("Подключение установлено");


    client.registerRoute("/address/getAllByParentId", function(request) {

        if(!request.payload.parentId) request.sendResponse({operationResult: 2, result: "ParentID must"});

        db.query("SELECT @rid, name  FROM (TRAVERSE IN() FROM "+request.payload.parentId+" WHILE $depth<2) WHERE $depth>0", {}).then(function (response) {
            request.sendResponse({operationResult: 0, result: response});
        });
    });

    client.registerRoute("/address/getFullTextById", function(request){
//SELECT @rid, name, out('AddressTypeEdge').shortName[0] as type FROM (TRAVERSE OUT("AddressEdge") FROM #12:5) order by @rid desc
        db.query("SELECT @rid, name, in('addtypelink').name[0] as type FROM (TRAVERSE OUT() FROM "+request.payload.id+") order by @rid desc",{}).then(function(response){
            var addrLine = "";
            response.forEach(function(item){
                addrLine+=" "+item.type+" "+item.name+",";
            });
            request.sendResponse({operationResult: 0, result: addrLine});
        });
    });




    client.registerService();

});