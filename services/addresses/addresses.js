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
        if (!request.payload) {
            addressTypeCollection.find({ $and:[{$or:[ {parentIdList: { $exists: false }}, {parentIdList: {$size: 0}} ]},{isDeleted:false}] }, function(err, addressTypes){
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
            addressCollection.find({parentId:request.payload.parentId, addressTypeId:request.payload.typeId, isDeleted:false }, function(err, addresses){
                if (err) return request.sendResponse(resultFactory.buildError(err));
                request.sendResponse(resultFactory.success(addresses));
            });
        }
        else if (request.payload.typeId){
            addressCollection.find({isDeleted:false, addressTypeId:request.payload.typeId, parentId: { $exists: false } }, function(err, addresses){
                if (err) return request.sendResponse(resultFactory.buildError(err));
                request.sendResponse(resultFactory.success(addresses));
            });
        }
        else{
            request.sendResponse(resultFactory.internalError(["#not enough arguments"]));
        }
    });

    client.registerService();

});
