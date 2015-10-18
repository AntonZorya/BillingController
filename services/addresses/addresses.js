var mbClient = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");
var mongoose = require("../common/dbConnection/mongoDB");

var addressDef = require("./dataLayer/models/address");
var addressTypeDef = require("./dataLayer/models/addressType");
var addressCollection = require("../common/mongoose/modelBuilder")("Address", addressDef);
var addressTypeCollection = require("../common/mongoose/modelBuilder")("AddressType", addressTypeDef);


var client = mbClient(function (isReconnecting) {

    //ADD NEW ADDRESS ELEMENT ex:// Астана
    client.registerRoute("/address/add", function (request) {
        if (!request.payload) {
            return request.sendResponse(resultFactory.internalError(["#nothing to save"]));
        }
        else {
            var model = addressCollection(request.payload);
            model.save(function (err) {
                if (err) return request.sendResponse(resultFactory.buildError(err));
                request.sendResponse(resultFactory.success({}));
            });
        }
    });

    //ADD NEW ADDRESSTYPE ELEMENT ex:// Город
    client.registerRoute("/addressType/add", function (request) {
        if (!request.payload) {
            return request.sendResponse(resultFactory.internalError(["#nothing to save"]));
        }
        else {
            var model = addressTypeCollection(request.payload);
            model.save(function (err) {
                if (err) return request.sendResponse(resultFactory.buildError(err));
                request.sendResponse(resultFactory.success({}));
            });
        }
    });

    //ADD PARENT TO ADDRESSTYPE ex:// Район -> Город
    client.registerRoute("/addressType/addParent", function (request) {
        if (!request.payload) {
            return request.sendResponse(resultFactory.internalError(["#nothing to save"]));
        }
        if (request.payload.parentId && request.payload.childId) {
            addressTypeCollection.findById(request.payload.childId, {isDeleted: false}, function (err, addressType) {
                if (err) return request.sendResponse(resultFactory.buildError(err));
                if (addressType == null) return request.sendResponse(resultFactory.internalError(["#child not found"]));
                addressType.parentIdList.push(request.payload.parentId);
                addressType.save(function (err) {
                    if (err) return request.sendResponse(resultFactory.buildError(err));
                    request.sendResponse(resultFactory.success({}));
                });

            });
        }
        else {
            request.sendResponse(resultFactory.internalError(["#not enough arguments"]));
        }
    });

    //GET ADDRESSTYPE CHILDREN
    client.registerRoute("/addressType/getChildList", function (request) {
        if (!request.payload.id) {
            addressTypeCollection.find({
                $and:[{$or:[ {parentIdList: { $exists: false }}, {parentIdList: {$size: 0}} ]},{isDeleted:false}]
            }, function(err, addressTypes){
                if (err) return request.sendResponse(resultFactory.buildError(err));
                return request.sendResponse(resultFactory.success(addressTypes));
            });
        }
        else if(request.payload.id){
            addressTypeCollection.find({isDeleted: false, parentIdList: request.payload.id}, function(err, addressTypes){
                if (err) return request.sendResponse(resultFactory.buildError(err));
                request.sendResponse(resultFactory.success(addressTypes));
            });
        }
        else {
            request.sendResponse(resultFactory.internalError(["#not enough arguments"]));
        }

    });

    //GET ADDRESS CHILDREN
    client.registerRoute("/address/getChildList", function(request){
        if (!request.payload) {
            return request.sendResponse(resultFactory.internalError(["#not enough arguments"]));
        }
        else if(request.payload.parentId && request.payload.typeId){
            addressCollection.find({
                parentId:request.payload.parentId,
                addressTypeId:request.payload.typeId,
                isDeleted:false
            }, function(err, addresses){
                if (err) return request.sendResponse(resultFactory.buildError(err));
                request.sendResponse(resultFactory.success(addresses));
            });
        }
        else if (request.payload.typeId){
            addressCollection.find({
                isDeleted:false,
                addressTypeId:request.payload.typeId,
                $or: [{parentId: { $exists: false }}, {parentId: null}]
            }, function(err, addresses){
                if (err) return request.sendResponse(resultFactory.buildError(err));
                request.sendResponse(resultFactory.success(addresses));
            });
        }
        else{
            request.sendResponse(resultFactory.internalError(["#not enough arguments"]));
        }
    });

    //GET 2 ARRAYS OF PARENTS
    client.registerRoute("/address/collectAllParents", function(request){
        if(request.payload && request.payload.id){
            var addressTypeItems = [];
            var addressItems = [];
            var f2 = function(id, finish){
                addressTypeCollection.findById(id, {isDeleted: false}, function(err, addressType){
                    if (err) return request.sendResponse(resultFactory.buildError(err));
                    if (addressType == null) return request.sendResponse(resultFactory.internalError(["#address not found"]));
                    addressTypeItems.unshift(addressType);
                    if(finish)
                        request.sendResponse(resultFactory.success({addresses:addressItems, addressTypes:addressTypeItems}));

                });
            };
            var f = function(id){
                addressCollection.findById(id, {isDeleted: false}, function (err, address) {
                    if (err) return request.sendResponse(resultFactory.buildError(err));
                    if (address == null) return request.sendResponse(resultFactory.internalError(["#address not found"]));
                    addressItems.unshift(address);
                    if(address.parentId){
                        f(address.parentId);
                    }
                    if(address.addressTypeId){
                        if(address.parentId)
                            f2(address.addressTypeId);
                        else
                            f2(address.addressTypeId, true);
                    }
                    //if(!address.parentId){
                    //    request.sendResponse(resultFactory.success(addresses));
                    //}
                });
            };
            f(request.payload.id);
        }
        else{
            return request.sendResponse(resultFactory.internalError(["#not enough arguments"]));
        }
    });

    client.registerService();

});
