var resultFactory = require("../operations/resultFactory");

module.exports = function(name, definition, obj, done){
	var model = new require('./modelBuilder')(name, definition);
	model(obj).validate(function(err){
       if (err) done(resultFactory.buildError(err))
       else done(resultFactory.success({}));
    });
};
