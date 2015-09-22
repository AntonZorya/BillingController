var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ModelBase = rootRequire('/data/models/base/modelBase');

exports.definition = _.extend({
    name: {type: String, required: "#name required"},
    tariffId: {type: Schema.Types.ObjectId, ref: 'Tariff'},
    minConsumption: {type: Number},
    avgConsumption: {type: Number},
    maxConsumption: {type: Number},
    parentId: {type: Schema.Types.ObjectId}
}, ModelBase);