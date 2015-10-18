/**
 * Created by vaio on 12.10.2015.
 */
var ModelBase = require('../../../common/mongoose/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var negotiableLoad = require('./negotiableLoad').definition;
var _ = require('underscore');


exports.definition = _.extend({
    negotiableLoad: negotiableLoad,
    quantity: {type: Number, required: "#quantity required"},
    daysInPeriod: {type: Number},
    waterPercent: {type: Number, required: "#waterPercent required"},
    canalPercent: {type: Number, required: "#canalPercent required"},
    totalWaterLitersPerDay: {type: Number, required: "#totalWaterLitersPerDay required"},
    totalCanalLitersPerDay: {type: Number, required: "#totalCanalLitersPerDay required"}
}, ModelBase);

exports.validators = [
    {
        name: "waterPercent",
        validator: function (waterPercent) {
            if(waterPercent>=0) return true;
            return false;
        },
        err: "#waterPercent must be >= 0"
    },
    {
        name: "canalPercent",
        validator: function (canalPercent) {
            if(canalPercent>=0) return true;
            return false;
        },
        err: "#canalPercent must be >= 0"
    }
];