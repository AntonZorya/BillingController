/**
 * Created by vaio on 26.09.2015.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.66.27/BillingController');
//mongoose.connect('mongodb://localhost/BillingController');

//var conn = mongoose.connection[0];

module.exports = mongoose;
