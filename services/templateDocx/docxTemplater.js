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
                            var gfs = Grid(conn.db);

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

                    //},1000)
                }
                        //callback(console.log('End first function'))


                    //Заполнение шаблона, который взяли из БД, данными и конвертация его в PDF
                     function TemplateConvDocx(name, TemplCallback) {
                         //setTimeout(function(){
                         //    var name = request.payload.templating;
                             var nameDocx=name+'.docx';
                         var template = fs.readFileSync(__dirname + "/InOut/"+nameDocx);
                         var doc = new Docxtemplater(template);
                         //var doc = new Docxtemplater(request.payload.templating);
                         doc.setData(request.payload.data);
                         doc.render();
                         var buf = doc.getZip()
                             .generate({type: "nodebuffer"});
                         //request.sendResponse(resultFactory.success({buf:buf}));

                         fs.writeFileSync(__dirname + "/InOut/"+nameDocx, buf);
                         console.log('Full file')
                         TemplCallback();
                             //var name=request.payload.templating;
                            // var name1=name.replace(/docx/g,'pdf');



                         //},1000);
                     }

                //Конвертация заполненного шаблона
                function ConvertToPDF(name, ConvCallback) {
                    //setTimeout(function () {
                    //    var name = request.payload.templating;
                        var nameDocx=name+'.docx';
                        var name1 = name+'.pdf';
                        unoconv.convert('../templateDocx/InOut/' + nameDocx, 'pdf', function (err, result) {
                            console.log(err);
                            //var name1=name.replace(/docx/g,'pdf');
                            console.log(name1);
                            fs.writeFile('../templateDocx/InOut/' + name1, result);
                            ConvCallback();
                        });

                    //}, 1000)
                }

                     function ReadToBD(name){
                         //setTimeout(function(){
                         //    var name = request.payload.templating;
                             var nameDocx=name+'.docx';
                             var namePdf=name+'.pdf';
                                // var ff='outputFLconvertedMyAsync8.docx';
                                // console.log('filename:');


                         var IDEND=undefined;
                         function GetMyId(callback) {
                             gfs.findOne({_id: name}, function (err, file) {
                                 //if(err) {console.log("error")}
                                 if(err){
                                     console.log(err);
                                 }
                                 //console.log('idFile='+file.filename);
                                 IDEND=file.filename;
                                 callback()
                             });
                         }
                         function WhereMyId() {
                             name=IDEND;

                             var name1=name.replace(/docx/g,'pdf')
                             //console.log("IdEnd=" + IDEND);
                             console.log("Filename= "+name)
                             console.log("PDF название: "+name1)

                             var writestream = gfs.createWriteStream({
                                 filename: name1
                             });
                             fs.createReadStream('/home/nurkasym/BillingController/services/templateDocx/InOut/'+namePdf).pipe(writestream);


                             writestream.on('close', function (file) {
                                 // do something with `file`
                                 console.log(file._id + ' written To DB');
                                 request.sendResponse(resultFactory.success({id:file._id}));
                                 //console.log(file.filename + ' written To DB');

                             });
                         }GetMyId(WhereMyId);
                     }
                //Синхронный вызов процедур микросервиса
                //async.series([ReadFromDB,TemplateConvDocx,ConvertToPDF,ReadToBD], function () {
                    //console.log("That's All")                })

                    //    console.log("Record completed");
                    //exports.templateData=templateData;//Алгоритм записи данных
                    //callback(console.log('End second function'))
                    ReadFromDB(request.payload.templating,function(name){
                        TemplateConvDocx(request.payload.templating,function(name){
                            ConvertToPDF(request.payload.templating, function (name) {
                                ReadToBD(request.payload.templating)
                            })
                        })
                    })

            }
        });

        client.registerService();
    });







