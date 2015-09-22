var repo = require('../../dataLayer/repositories/client/clientTypeRepo');

exports.getAll = function (done) {
    repo.getAll(function (data) {
        done(data);
    });
};