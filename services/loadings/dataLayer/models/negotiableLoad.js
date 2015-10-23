/**
 * Created by vaio on 12.10.2015.
 */
var ModelBase = require('../../../common/mongoose/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var loadUnit = require('./loadUnit').definition;
var _ = require('underscore');


exports.definition = _.extend({
    name: {type: String, required: "#name required"},
    loadUnit: loadUnit,
    litersPerDay: {type: Number, required: "#litersPerDay required"},
    groupNumber: {type: Number}
}, ModelBase);