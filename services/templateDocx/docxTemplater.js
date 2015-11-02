var mbClient = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");
var async=require('async');
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

                            //Берет из БД файл по id-шнику и записывает в File System(fs)
                function ReadFromDB(name, ReadCallback) {
                    //setTimeout(function(){
                    //var name = request.payload.templating;
                    var nameDocx=name+'.docx';
                    //_id:'12345678'


                    var fs_write_stream = fs.createWriteStream('/home/nurkasym/BillingController/services/templateDocx/InOut/'+nameDocx);
                    var readstream = gfs.createReadStream({
                        _id: name
                    });

                    var IDEND=undefined;
                    function GetMyId(callback) {
                        gfs.findOne({_id: name}, function (err, file) {
                            //if(err) {console.log("error")}
                            if(err){
                                console.log(err);
                            }
                            console.log('idFile='+file.filename);
                            IDEND=file.filename;
                            callback()
                        });
                    }
                    function WhereMyId() {
                        name=IDEND;
                        //console.log("IdEnd=" + IDEND);
                        console.log("RabotayBlyad"+name)
                        console.log(name + ' file has been written fully!');
                    }
                    readstream.pipe(fs_write_stream);
                    fs_write_stream.on('close', function () {
                        GetMyId(WhereMyId);
                        //console.log('file has been written fully!');
                        ReadCallback();
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







