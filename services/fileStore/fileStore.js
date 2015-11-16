var mbClientConn = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");

var db = require('../common/dbConnection/mongo').getDb();
var mongo = require('../common/dbConnection/mongo').mongo;

var Grid = require('gridfs');
var gfs = Grid(db, mongo);

var docxTemplater = require('docxtemplater');
var unoconv = require('unoconv2');

var fs = require('fs');

unoconv.listen().stderr.on('data', function (data) {
    console.error(data);
});

var mbClient = mbClientConn(function (isReconnecting) {

    mbClient.registerRoute('/files/docx/toFilledPDF', function (request) {
        var fileId = mongo.ObjectID();
        var templateId = request.payload.templateId;
        var objToFill = request.payload.objToFill;
        var fileName = request.payload.fileName;
        var clientIdByPeriod = request.payload.clientIdByPeriod;
        gfs.readFile({
            _id: templateId
        }, function (error, bufTemplate) {
            if (error) {
                console.error(error);
                request.sendResponse(resultFactory.buildError(error));
            } else {
                var docToFill = new docxTemplater(bufTemplate);
                docToFill.setData(objToFill);
                docToFill.render();

                var resultBuffer = docToFill.getZip().generate({type: 'nodebuffer'});

                fs.writeFile('./temp/' + fileId + '.docx', resultBuffer, {}, function (error, data) {
                    if (error) {
                        console.error(error);
                        request.sendResponse(resultFactory.buildError(error));
                    } else {
                        unoconv.convert('./temp/' + fileId + '.docx', 'pdf', function (error, result) {
                            if (error) {
                                console.error(error);
                                request.sendResponse(resultFactory.buildError(error));
                            } else {
                                gfs.writeFile({
                                    _id: fileId,
                                    filename: fileName + '.pdf'
                                }, result, function (error, data) {
                                    if (error) {
                                        request.sendResponse(resultFactory.buildError(error));
                                    } else {
                                        request.sendResponse(resultFactory.success({
                                            clientIdByPeriod: clientIdByPeriod,
                                            fileId: data._id
                                        }));
                                    }
                                });
                            }
                            fs.unlink('./temp/' + fileId + '.docx', function (error) {
                                if (error) {
                                    console.error(error);
                                }
                            });
                        });
                    }
                });
            }
        });

    });

    mbClient.registerService();

});