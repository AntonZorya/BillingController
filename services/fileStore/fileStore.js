var mbClientConn = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");

var db = require('../common/dbConnection/mongo').getDb();
var mongo = require('../common/dbConnection/mongo').mongo;

var Grid = require('gridfs');
var gfs = Grid(db, mongo);

var docxTemplater = require('docxtemplater');
var unoconv = require('unoconv2');
var fs = require('fs');

var mbClient = mbClientConn(function (isReconnecting) {

    mbClient.registerRoute('/files/docx/toFilledPDF', function (request) {
        var templateId = request.payload.templateId;
        var objToFill = request.payload.objToFill;
        var fileName = request.payload.fileName;
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

                fs.writeFile('./temp/' + fileName+'.docx', resultBuffer, {}, function (error, data) {
                    if (error) {
                        console.error(error);
                        request.sendResponse(resultFactory.buildError(error));
                    } else {
                        unoconv.convert('./temp/' + fileName+'.docx', 'pdf', function (error, result) {
                            if (error) {
                                console.error(error);
                                request.sendResponse(resultFactory.buildError(error));
                            } else {
                                gfs.writeFile({
                                    filename: fileName+'.pdf'
                                }, result, function (error, data) {
                                    if (error) {
                                        request.sendResponse(resultFactory.buildError(error));
                                    } else {
                                        request.sendResponse(resultFactory.success(data._id));
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

    });

    mbClient.registerService();

});