/**
 * Created by vaio on 25.09.2015.
 */
var ModelBase = require('../../../common/mongoose/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');


exports.definition = _.extend({
    name: {type: String, required: "#name required"},
    oldName: {type: String},
    parentId: {type: Schema.Types.ObjectId, ref: 'Address'},
    addressTypeId: {type: Schema.Types.ObjectId, ref: 'AddressType', required: true}
}, ModelBase);