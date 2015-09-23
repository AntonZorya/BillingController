/**
 * Created by mac on 23.09.15.
 */
var moment = require('moment');
var model = require('nodejs-model');
module.exports = function(modelName, fields){
    var createdModel = model(modelName);

    fields.forEach(function(item){
       createdModel.attr(item.name, item.properties);
    });

    createdModel.attr("rid");
    createdModel.attr("isDeleted");
    createdModel.attr("createDate")

    createdModel.init = function(instance) {
        instance.createDate(moment().format('YYYY-MM-DD HH:mm:ss'));
        instance.isDeleted(false);
    };

    return createdModel;
}