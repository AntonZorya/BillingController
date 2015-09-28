/**
 * Created by vaio on 26.09.2015.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.66.27/BillingControllerAddress');

module.exports = mongoose;