var mbClient = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");

var mongoose=require('mongoose');
//var mongoose = require("../common/dbConnection/mongoDB");
var Schema = mongoose.Schema;
mongoose.connect('mongodb://192.168.66.27/BillingControllerTest');
var conn = mongoose.connections[0];


var fs=require('fs');

var Grid = require('gridfs-stream');

Grid.mongo = mongoose.mongo;
var Docxtemplater=require('docxtemplater');
var unoconv=require('unoconv2');




    var client = mbClient(function (isReconnecting) {

        client.registerRoute("/templater/templaterData", function (request) {
            if (!request.payload) {
                return request.sendResponse(resultFactory.internalError(["#nothing to save"]));
            }
            else {

                //вывести из БД



                    var gfs = Grid(conn.db);
                /* var writestream = gfs.createWriteStream({
                        filename: 'outputFLconverted1.pdf'
                    });
                    fs.createReadStream('/home/nurkasym/BillingController/services/templateDocx/InOut/outputFLconverted.pdf').pipe(writestream);
                    writestream.on('close', function (file) {
                        // do something with `file`
                        console.log(file.filename + ' written To DB');
                    });*/
                var id=request.payload.templating;
                console.log('id='+id);

                 var fs_write_stream = fs.createWriteStream('/home/nurkasym/BillingController/services/templateDocx/InOut/outputFromBCDBTemplate223.docx');
                 var readstream = gfs.createReadStream({
                 _id: id
                 });
                 readstream.pipe(fs_write_stream);
                 fs_write_stream.on('close', function () {
                 console.log('file has been written fully!');
                 });


                   var template=fs.readFileSync(__dirname+ "/InOut/outputFromBCDBTemplate223.docx");
                    var doc = new Docxtemplater(template);
                   //var doc = new Docxtemplater(request.payload.templating);
                    doc.setData(request.payload.data);
                    doc.render();
                    var buf = doc.getZip()
                        .generate({type:"nodebuffer"});
               //request.sendResponse(resultFactory.success({buf:buf}));

                fs.writeFileSync(__dirname+"/InOut/outputFL1.docx",buf);
                unoconv.convert('../templateDocx/InOut/outputFL1.docx', 'pdf', function (err, result) {
                    console.log(err);
                    fs.writeFile('../templateDocx/InOut/outputFLconvertedNewMy223.pdf', result);
                });
                //    console.log("Record completed");
                //exports.templateData=templateData;//Алгоритм записи данных

            }
        });

        client.registerService();
    });







