var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

module.exports = {
	_id : {type: Schema.Types.ObjectId, default: function() { return mongoose.Types.ObjectId() }} ,
	isDeleted: {type: Boolean, default: false},
	createDateTime: {type: Date, default: new Date()} 
};