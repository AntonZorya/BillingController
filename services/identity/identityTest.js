/**
 * Created by mac on 22.09.15.
 */
var mbClient = require("../common/mbConnection/netConnection");
var async = require("async");
var moment =require('moment');
var sqlBuilder = require("../common/sql/sqlBuilder");

console.log(sqlBuilder("select from Address where name=:hui", [{key: "hui", value: "324"}]));

//
//
//var client = mbClient(function(isReconnecting) {
//
//    //var userid = "";
//    //var roleId = "";
//    //var roleid1 = "";
//    //
//    //async.parallel([function(userCreateCallback) {
//    //    client.sendRequest('/user/create', {userName: "odmin", password: "odminPassword"}, function (err, data) {
//    //        if (err) console.log(err);
//    //        else {
//    //            console.log("Юзер создана:")
//    //            console.log(data);
//    //            userid = data.result;
//    //        }
//    //        userCreateCallback();
//    //    });
//    //}, function(roleCreateCallback) {
//    //
//    //    client.sendRequest('/role/create', {roleName: "Administrator"}, function (err, data) {
//    //        if (err) console.log(err);
//    //        else {
//    //            console.log("Роль создана:")
//    //            console.log(data);
//    //            roleId = data.result;
//    //        }
//    //        roleCreateCallback();
//    //    });
//    //},
//    //    function(roleCreateCallback1) {
//    //        console.log("Начли исполнять");
//    //    client.sendRequest('/role/create', {roleName: "DB writer"}, function (err, data) {
//    //        if (err) console.log(err);
//    //        else {
//    //            console.log("Роль1 создана:")
//    //            console.log(data);
//    //            roleid1 = data.result;
//    //        }
//    //        roleCreateCallback1();
//    //    });
//    //}], function(err){
//    //
//    //    client.sendRequest('/user/assignRole',{userId: userid, roleId:roleId}, function(err, data){
//    //        if(err) console.log(err);
//    //        else {
//    //            console.log("Связь создана:")
//    //            console.log(data);
//    //        }
//    //    });
//    //
//    //    client.sendRequest('/user/assignRole',{userId: userid, roleId:roleid1}, function(err, data){
//    //        if(err) console.log(err);
//    //        else {
//    //            console.log("Связь создана:")
//    //            console.log(data);
//    //        }
//    //    });
//    //});
//    //
//    ////
//    ////client.sendRequest('/token/create', {token: "asdsdasf", userId: "#12:77", validThru: moment().add(moment.duration(2, 'M')).format('YYYY-MM-DD HH:mm:ss')}, function(err, data){
//    ////    if(err) console.log(err);
//    ////            else {
//    ////                console.log(data);
//    ////            }
//    ////})
//    ////
//    //client.sendRequest('/user/getAll', {}, function(err, data){
//    //    if(err) console.log(err);
//    //            else {
//    //                console.log(data);
//    //            }
//    //})
//
//
//    client.sendRequest('/user/changePassword', {password: "newPassword", userId: "#12:49"}, function(err, data){
//        if(err) console.log(err);
//        else {
//            console.log(data);
//        }
//    })
//
//
//
//
//
//});
