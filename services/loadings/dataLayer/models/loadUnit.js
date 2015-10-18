/**
 * Created by vaio on 12.10.2015.
 */
var ModelBase = require('../../../common/mongoose/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');


exports.definition = _.extend({
    name: {type: String, required: "#name required"}
}, ModelBase);