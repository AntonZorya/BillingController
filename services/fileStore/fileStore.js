var mbClientConn = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");

var db = require('../common/dbConnection/mongo').getDb();
var mongo = require('../common/dbConnection/mongo').mongo;

var Grid = require('gridfs-stream');
var gfs = Grid(db, mongo);
var fs = require('fs');

var mbClient = mbClientConn(function (isReconnecting) {

    mbClient.registerRoute('/files/docx/toFilledPDF', function (request) {
        var templateId = request.payload.templateId;
        var objToFill = request.payload.objToFill;

        var bufArr = [];
        var bufTemplate;

        var gfsReadStream = gfs.createReadStream({
            _id: templateId
        });

        gfsReadStream.on('error', function (error) {
            console.error(error);
            mbClient.sendResponse(resultFactory.buildError(error));
        });

        gfsReadStream.on('data', function (data) {
            bufArr.push(data);
        });

        gfsReadStream.on('end', function () {
            bufTemplate = Buffer.concat(bufArr);
            fs.writeFileSync('template.docx', bufTemplate);
            request.sendResponse(resultFactory.success('Ok'));
        });
    });

    mbClient.registerService();

});