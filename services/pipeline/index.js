global.commonRequire = function (name) {
    return require('../common/' + name);
}
global.rootRequire = function (name) {
    return require(__dirname + '/' + name);
}

var resultFactory = commonRequire('operations/resultFactory');
var mbClient = commonRequire('mbConnection/netConnection');
var db = commonRequire('dbConnection/orientDB');

var pipelineModel = rootRequire('data/models/pipeline');
var pipeline_to_client = rootRequire('data/links/pipeline_to_client');

//var client = mbClient(function (isReconnecting) {
//
//    client.registerRoute('/pipeline/add', function (request) {
//        var pipeline = pipelineModel.create();
//        pipeline.update(request.payload.pipeline);
//        pipeline.validate().then(function () {
//            if (pipeline.isValid) {
//                db.create('VERTEX', 'pipeline')
//                    .set(pipeline.attrs)
//                    .one()
//                    .then(function (vertex) {
//                        var piplineLink = pipeline_to_client.create();
//                        piplineLink.update(request.payload.pipeline_to_client);
//                        db.create('EDGE', 'pipline_to_client')
//                            .from(vertex['@rid'])
//                            .to(request.payload.clientId)
//                            .set(piplineLink.attrs)
//                            .one()
//                            .then(function (edge) {
//                                request.sendResponse(resultFactory.success({
//                                    vertex: vertex['@rid'],
//                                    edge: edge['@rid']
//                                }));
//                            });
//                    });
//            } else {
//                request.sendResponse(resultFactory.validationError(pipeline.errors));
//            }
//        });
//    });
//
//    client.registerRoute('/pipeline/update', function (request) {
//        var pipeline = pipelineModel.create();
//        pipeline.update(request.payload);
//        pipeline.validate();
//        if (pipeline.isValid) {
//            db.update('VERTEX', 'pipeline')
//                .set(pipeline.attrs)
//                .one()
//                .then(function (vertex) {
//                    request.sendResponse(resultFactory.success(vertex(['@rid'])));
//                });
//        } else {
//            request.sendResponse(resultFactory.validationError(pipeline.errors));
//        }
//    });
//
//    client.registerRoute('/pipeline/remove', function (request) {
//        db.delete('VERTEX')
//            .where('@rid = #19:1')// + request.payload)
//            .one()
//            .then(function (count) {
//                request.sendResponse(resultFactory.success(count));
//            });
//    });
//
//    client.registerService();
//
//});

console.log('started');

db.query('traverse in().* from #17:6825')
    .then(function (error, result) {
        console.log(error);
        console.log(result);
    });