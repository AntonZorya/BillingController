/**
 * Created by vaio on 12.10.2015.
 */
var ModelBase = require('../../../common/mongoose/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var negotiableLoad = require('./negotiableLoad').definition;
var _ = require('underscore');


exports.definition = {
    clientLoadsArray: [{
        negotiableLoad: negotiableLoad,
        quantity: {type: Number, required: "#quantity required"},
        daysInPeriod: {type: Number},
        waterPercent: {type: Number, required: "#waterPercent required", min: 0},
        canalPercent: {type: Number, required: "#canalPercent required", min: 0},
        totalWaterLitersPerDay: {type: Number, required: "#totalWaterLitersPerDay required"},
        totalCanalLitersPerDay: {type: Number, required: "#totalCanalLitersPerDay required"}
    }]
};