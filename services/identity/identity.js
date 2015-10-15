/**
 * Created by mac on 22.09.15.
 */
//var clientFactory = require("devir-mbclient");
var db = require('../common/dbConnection/orientDB');
var mbClient = require("../common/mbConnection/netConnection");
var moment = require('moment');
var resultFactory = require("../common/operations/resultFactory");

var userModel = require("./dataLayer/models/user");
var roleModel = require("./dataLayer/models/role");
var linkModel = require("./dataLayer/links/role_to_user");
var tokenModel = require("./dataLayer/models/token");



var client = mbClient(function(isReconnecting){

    ///CREATE USER
    client.registerRoute('/user/create', function(request){
        var newUser = userModel.create();
        newUser.update(request.payload);

        newUser.validate().then(function() {
            if(newUser.isValid) {

                 db.insert('users', newUser, function(err,data){

                     db.findAll('users',{}, function(){

                     }).dereference('roleId').dereference('organizationId');

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

    //Getting user by Token
    client.registerRoute('/user/getByToken', function(request){
            if(!request.payload.token)
            {
                return request.sendResponse(resultFactory.internalError(["token not presented"]));
            }

            db.query('select userId from token where token=:token and vaidThru>:vaidThru',{
                params: {
                    token: request.payload.token,
                    vaidThru: moment().format('YYYY-MM-DD HH:mm:ss')
                },
                limit: 1
                })
                .then(function (results) {
                        if(results.length>0){

                            db.query('select @rid, userName, in(\'role_to_user\').roleName from @rid=:userId',{
                                params: {
                                    userId: results[0]},
                                limit: 1
                            }).then(function (users) {

                                if(users.length>0) {
                                    return request.sendResponse(resultFactory.success(users[0]));
                                } else{
                                    return request.sendResponse(resultFactory.success(null));
                                }
                            });

                        }
                    else{
                            return request.sendResponse(resultFactory.success(null));
                        }
                });
        });

    ///INSERT NEW TOKEN
    client.registerRoute('/token/create', function(request) {
        if (!request.payload.token || !request.payload.userId) {
            return request.sendResponse(resultFactory.internalError(["token or userId not presented"]));
        }

        var newToken = tokenModel.create();
        newToken.update(request.payload);

        db.insert().into('token').set(newToken.attrs).one()
            .then(function (token) {
                request.sendResponse(resultFactory.success(token['token']));
            });
    });

    ///GET USER LIST
    client.registerRoute('/user/getAll', function(request){
        db.query('select @rid, userName, password, in("role_to_user").roleName as roles from user where isDeleted=false',{}).then(function (users) {
                return request.sendResponse(resultFactory.success(users.map(function(item){
                    return {rid: item.rid,
                    userName: item.userName,
                        password: "****",
                        roles: item.roles
                    }
                })));
        });
    });

    ///CHANGE USER PASSWORD
    client.registerRoute('/user/changePassword', function(request){
        if (!request.payload.password || !request.payload.userId) {
            return request.sendResponse(resultFactory.internalError(["password or userId not presented"]));
        }

        db.update('user').set({password: request.payload.password}).where({'@rid': request.payload.userId}).scalar().then(function(total){
            return request.sendResponse(resultFactory.success(total));
        });
    });

    client.registerRoute('/test/test', function(request){

       var i=0;
        while(i<1000*100){

            var newRole = roleModel.create();
            newRole.roleName("Administrator"+i)

            console.log(i);

        db.create('VERTEX', 'role')
            .set(newRole.attrs)
            .one()
            .then(function (vertex) {

                var newLink = linkModel.create();
                db.create('EDGE', 'role_to_user')
                    .from(vertex["@rid"])
                    .to("#12:49")
                    .set(newLink.attrs)
                    .one()
                    .then(function (edge) {

                    });

                console.log("////"+i);
            });
            i++;
        }
    });


    client.registerService();

});