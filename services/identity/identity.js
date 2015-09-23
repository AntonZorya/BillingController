/**
 * Created by mac on 22.09.15.
 */
//var clientFactory = require("devir-mbclient");
var db = require('../common/dbConnection/orientDB');
var mbClient = require("../common/mbConnection/netConnection");
var userModel = require("./dataLayer/models/user");
var roleModel = require("./dataLayer/models/role");
var linkModel = require("./dataLayer/links/role_to_user");
var resultFactory = require("../common/operations/resultFactory");

var client = mbClient(function(isReconnecting){

    ///CREATE USER
    client.registerRoute('/user/create', function(request){
        var newUser = userModel.create();
        newUser.update(request.payload);

        newUser.validate().then(function() {
            if(newUser.isValid) {

                db.create('VERTEX', 'user')
                    .set(newUser.attrs)
                    .one()
                    .then(function (vertex) {
                        request.sendResponse(resultFactory.success(vertex['@rid']));
                    });
            }else{

                request.sendResponse(resultFactory.validationError(newUser.errors));
            }
        });
    });

    ///CREATE ROLE
    client.registerRoute('/role/create', function(request){
        var newRole = roleModel.create();
        newRole.update(request.payload);

        newRole.validate().then(function() {
            if(newRole.isValid)
            {
                db.create('VERTEX', 'role')
                    .set(newRole.attrs)
                    .one()
                    .then(function (vertex) {
                        request.sendResponse(resultFactory.success(vertex['@rid']));
                    });
            }else{
                request.sendResponse(resultFactory.validationError(newRole.errors));
            }
        });
    });


    ///ASSIGN ROLE TO USER
    client.registerRoute('/user/assignRole', function(request){

        if(!request.payload.userId || !request.payload.roleId){
                 return request.sendResponse(resultFactory.internalError(["userId and roleId not presented"]))
        }

        var newLink = linkModel.create();
        newLink.update(request.payload);

        newLink.validate().then(function() {
            if (newLink.isValid) {
                db.create('EDGE', 'role_to_user')
                    .from(request.payload.roleId)
                    .to(request.payload.userId.toString())
                    .set(newLink.attrs)
                    .one()
                    .then(function (edge) {
                        request.sendResponse(resultFactory.success(edge['@rid']));
                    });
            } else {
                request.sendResponse(resultFactory.validationError(newLink.errors));
            }
        });

    });










    //
    //db.update("user").set({password: 'changed'}).where({userName: 'admin'}).scalar()
    //    .then(function (total) {
    //        console.log('updated', total, 'users');
    //    });




    //newUser.rid("#12:45");
    //    //newUser.userName("привет!!!");
    //
    //    console.log(newUser.toJSON());
    //
    //    newUser.validate().then(function() {
    //        if (newUser.isValid) {
    //            //validated, perform business logic
    //        } else {
    //            //validation failed, dump validation errors to the console
    //            console.log(newUser.errors);
    //        }
    //});


    client.registerService();

});