var clientTypeDef = require('../../models/client/clientType');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('ClientType', clientTypeDef);

exports.add = function (clientType, done) {
    var model = Collection(clientType);
    model.save(function (err) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0});
    });
};

exports.getByName = function (name, done) {
    Collection.findOne({"name": name, isDeleted: false}, function (err, res) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
};

exports.getAll = function (done) {
    Collection.find(function (err, res) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
};