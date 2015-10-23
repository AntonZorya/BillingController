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
            if(item.properties)
            if(item.properties.isEmbeding){
                createdModel.validator(item.name, function(hz, hz2, hz3, hz4){
                    var hz = hz;
                });
            }
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