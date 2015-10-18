var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');
var _ = require('underscore');

var schemes = {};

module.exports = function (name, definition, isGetScheme) {
    if (!schemes[name]) schemes[name] = new Schema(definition.definition);


    if (isGetScheme)
        return schemes[name];
    schemes[name].plugin(idvalidator, {message: '#{PATH} wrong'});
    var model = mongoose.model(name, schemes[name]);

    if (definition.validators)
        _.each(definition.validators, function (path) {
            model.schema.path(path.name).validate(path.validator, path.err);
        });

    //TODO реализовать createIndex
    /*if (definition.compoundIndexes)
        _.each(definition.compoundIndexes, function (cIndex) {
            model.schema.path(path.name).index(cIndex);
        });*/


    return model;
}
