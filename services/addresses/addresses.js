var db = require('../common/dbConnection/orientDB');
var mbClient = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");
var sqlBuilder = require("../common/sql/sqlBuilder");

var addressModel = require("./dataLayer/models/address");
var addressType = require("./dataLayer/models/addressType");

var client = mbClient(function (isReconnecting) {

    //Получение дочерних адресных типов по PARENTID
    client.registerRoute("/address/getAddressTypeByParentId", function(request){
        if(!request.payload.parentId){
            db.query("select from addressType where out_addressType_to_addressType is null", {}).then(function(response){
                request.sendResponse(resultFactory.success(response));
            });
        }
        else if(request.payload.parentId){
            db.query(sqlBuilder("select from (TRAVERSE in('addressType_to_addressType') FROM @parentId while $depth<2) where $depth=1", [{key:"parentId", value:request.payload.parentId}])).then(function(response){
                request.sendResponse(resultFactory.success(response));
            });
        }
        else{
            request.sendResponse(resultFactory.internalError(["parentId not found"]));
        }

    });

    //Получение дочерних адресных элементов по PARENTID & TYPEID
    client.registerRoute("/address/getAddressByParentId", function(request){
        if(!request.payload.parentId || !request.payload.typeId){
            db.query("select from address where out_address_to_address is null", {}).then(function(response){
                request.sendResponse(resultFactory.success(response));
            });
        }
        else if(request.payload.parentId != null && request.payload.typeId != null){
            //select @rid, name, oldName, out('AddressTypeEdge').@rid[0] from (TRAVERSE in('AddressEdge') FROM #12:0 while $depth<2) where $depth=1 and out('AddressTypeEdge').@rid[0]=#13:2
            db.query(sqlBuilder("select from (TRAVERSE in('address_to_address') FROM @parentId while $depth<2) where $depth=1 and out('address_to_addressType').@rid[0]=@typeId", [{key:"parentId", value:request.payload.parentId},{key:"typeId", value:request.payload.typeId}])).then(function(response){
                request.sendResponse(resultFactory.success(response));
            });
        }
        else if(request.payload.typeId != null){
            db.query(sqlBuilder("select from address where out('address_to_addressType').@rid[0]=@typeId", [{key:"typeId", value:request.payload.typeId}])).then(function(response){
                request.sendResponse(resultFactory.success(response));
            });
        }
        else{
            request.sendResponse(resultFactory.internalError(["parentId not found"]));
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
