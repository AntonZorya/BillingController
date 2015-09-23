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

    //Получение дочерних адресных типов по PARENTID
    client.registerRoute("/address/getAddressTypeByParentId", function(request){
        if(!request.payload.parentId){
            db.query("select from AdressType where out_AddressTypeRuleEdge is null", {}).then(function(response){
                request.sendResponse({operationResult: 0, result: response});
            });
        }
        else if(request.payload.parentId){
            db.query("select from (TRAVERSE in('AddressTypeRuleEdge') FROM "+request.payload.parentId+" while $depth<2) where $depth=1", {}).then(function(response){
                request.sendResponse({operationResult: 0, result: response});
            });
        }
        else{
            request.sendResponse({operationResult: 2, result: "parentId not found"});
        }
        
    });
    
    //Получение дочерних адресных элементов по PARENTID & TYPEID
    client.registerRoute("/address/getAddressByParentId", function(request){
        if(!request.payload.parentId || !request.payload.typeId){
            db.query("select from Address where out_AddressEdge is null", {}).then(function(response){
                request.sendResponse({operationResult: 0, result: response});
            });
        }
        else if(request.payload.parentId != null && request.payload.typeId != null){
            //select @rid, name, oldName, out('AddressTypeEdge').@rid[0] from (TRAVERSE in('AddressEdge') FROM #12:0 while $depth<2) where $depth=1 and out('AddressTypeEdge').@rid[0]=#13:2
            db.query("select from (TRAVERSE in('AddressEdge') FROM "+request.payload.parentId+" while $depth<2) where $depth=1 and out('AddressTypeEdge').@rid[0]="+request.payload.typeId, {}).then(function(response){
                request.sendResponse({operationResult: 0, result: response});
            });
        }
        else if(request.payload.typeId != null){
            db.query("select from address where out('AddressTypeEdge').@rid[0]="+request.payload.typeId, {}).then(function(response){
                request.sendResponse({operationResult: 0, result: response});
            });
        }
        else{
            request.sendResponse({operationResult: 2, result: "parentId not found"});
        }
        
    });

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