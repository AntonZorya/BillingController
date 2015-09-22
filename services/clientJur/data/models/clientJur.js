var _ = require('underscore');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ModelBase = rootRequire('/data/models/base/modelBase');
var phones = rootRequire('/data/models/phones').definition;

var clientType = rootRequire('/data/models/clientType').definition;

var clientPipelines = rootRequire('/data/models/clientPipelines').definition;

exports.definition = _.extend({
    accountNumber: {type: String},
    number: {type: String},
    name: {type: String, required: "#name required"},
    bin: {type: String, required: "#bin required"},
    rnn: {type: String},

    addressId: {type: Schema.Types.ObjectId, ref: 'Address', required: true},
    address: {type: String, required: "#address required"},
    phone: {type: String},
    email: {type: String},
    period: {type: Number},
    pipelines: clientPipelines,

    controllerId: {type: Schema.Types.ObjectId, ref: 'Controller', required: true},
    clientType: clientType,
    kskId: {type: Schema.Types.ObjectId, ref: 'ksk'},
    abonentEntryDate: {type: Date}
}, ModelBase);