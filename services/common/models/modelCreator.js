/**
 * Created by mac on 23.09.15.
 */
var moment = require('moment');
var model = require('nodejs-model');
var ObjectID = require('mongodb').ObjectID;

module.exports = function(modelName, fields){
    var createdModel = model(modelName);

    fields.forEach(function(item){
       createdModel.attr(item.name, item.properties);
    });

    createdModel.attr("_id");
    createdModel.attr("isDeleted");
    createdModel.attr("createDateTime");

    createdModel.init = function(instance) {
        instance.createDateTime(moment().format('YYYY-MM-DD HH:mm:ss'));
        instance.isDeleted(false);
    };



    return createdModel;
}